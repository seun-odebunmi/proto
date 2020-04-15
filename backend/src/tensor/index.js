import { models } from '../models';
const tf = require('@tensorflow/tfjs-node');

const getData = async testSplit => {
  const resData = await models.MedicalRecords.getAll();
  const cleaned = resData.map(({ id, HistoryofPresentIllness, ...rest }) => rest);

  const classes = await models.Diagnosis.getAll().then(result => result.map(async d => d.value));
  const numClasses = classes.length;
  // console.log('classes', classes, 'numClasses', numClasses);

  const flatData = cleaned.map(d => Object.keys(d).map(key => d[key]));
  // console.log('flatData', flatData, flatData.length);

  return tf.tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];

    for (let i = 0; i < numClasses; ++i) {
      dataByClass.push([]);
      targetsByClass.push([]);
    }

    for (const example of flatData) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);
      dataByClass[target - 1].push(data);
      targetsByClass[target - 1].push(target);
    }

    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    const concatAxis = 0;

    for (let i = 0; i < numClasses; ++i) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(
        dataByClass[i],
        targetsByClass[i],
        testSplit,
        numClasses
      );

      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    return [
      tf.concat(xTrains, concatAxis),
      tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis),
      tf.concat(yTests, concatAxis)
    ];
  });
};

const convertToTensors = (data, targets, testSplit, numClasses) => {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error('data and split have different numbers of examples');
  }

  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = data[0].length;

  // create a 2D tf.tensor to hold the feature data
  const xs = tf.tensor2d(data, [numExamples, xDims]);

  // create a 1D tf.tensor to hold the labels and convert the number label
  // from the set {0, 1, 2, ...} to one-hot encoding (e.g., 0 ---> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(targets).toInt(), numClasses);

  // split the data into training and test sets, using slice
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, numClasses]);
  const yTest = ys.slice([0, 0], [numTestExamples, numClasses]);

  return [xTrain, yTrain, xTest, yTest];
};

const trainModel = async (xTrain, yTrain, xTest, yTest) => {
  // Prepare the model for training.
  const model = tf.sequential();
  const learningRate = 0.01;
  const numberOfEpochs = 120;
  const optimizer = tf.train.adam(learningRate);

  model.add(tf.layers.dense({ units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]] }));
  model.add(tf.layers.dense({ units: 235, activation: 'softmax' }));

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  const history = await model.fit(xTrain, yTrain, {
    epochs: numberOfEpochs,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log('Epoch: ' + epoch + ' Logs: ' + logs.loss);
        await tf.nextFrame();
      }
    }
  });

  return model;
};

// expose as service
const run = async () => {
  const [xTrain, yTrain, xTest, yTest] = await getData(0.2);
  // console.log(xTrain, yTrain, xTest, yTest);
  // Train the model
  const model = await trainModel(xTrain, yTrain, xTest, yTest);
  // Predict
  // const input = [];
  // const prediction = model.predict(input);
  // console.log(prediction);

  // const predictionWithArgMax = model
  //   .predict(input)
  //   .argMax(-1)
  //   .dataSync();
  // console.log(predictionWithArgMax);

  const xData = xTest.dataSync();
  const yTrue = yTest.argMax(-1).dataSync();

  const predictions = await model.predict(xTest);
  const yPred = predictions.argMax(-1).dataSync();

  var correct = 0;
  var wrong = 0;

  for (var i = 0; i < yTrue.length; i++) {
    if (yTrue[i] == yPred[i]) {
      correct++;
    } else {
      wrong++;
    }
  }
  console.log('Prediction error rate: ' + wrong / yTrue.length);

  console.log('Done Training');
};

export { run };
