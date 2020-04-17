const tf = require('@tensorflow/tfjs-node');
import { models } from '../models';
import * as data from './data';

const trainModel = async (xTrain, yTrain, xTest, yTest) => {
  console.log('Training model... Please wait.');
  // Prepare the model for training.
  const learningRate = 0.009;
  const numberOfEpochs = 500;
  const optimizer = tf.train.adam(learningRate);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]] }));
  model.add(tf.layers.dense({ units: 80, activation: 'sigmoid' }));
  model.add(tf.layers.dense({ units: 80, activation: 'sigmoid' }));
  model.add(tf.layers.dense({ units: yTrain.shape[1], activation: 'softmax' }));

  model.summary();

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  let valAcc;
  await model
    .fit(xTrain, yTrain, {
      epochs: numberOfEpochs,
      validationData: [xTest, yTest],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          valAcc = logs.acc;
          console.log(`Epoch: ${epoch}, Loss: ${logs.loss}, Acc: ${logs.acc}`);
          await tf.nextFrame();
        },
      },
    })
    .then(async () => {
      const finalValAccPercent = valAcc * 100;
      console.log(`Final validation accuracy: ${finalValAccPercent.toFixed(1)}%;`);

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
      await model.save('file://src/tensor/diagnosisModel');
      console.log('Model saved');
    });

  return model;
};

export const run = async () => {
  // fetch data and remove unwanted fields
  const cleaned = await models.MedicalRecords.getAll().then((d) =>
    d
      .map(({ id, HistoryofPresentIllness, ...rest }) => rest)
      .filter((d) => d.VA_OD != null && d.VA_OS != null)
  );
  const data2d = await cleaned.map((d) => Object.keys(d).map((key) => d[key]));
  tf.util.shuffle(data2d);

  // fetch all existing diagnosis (classes)
  const classes = await models.Diagnosis.getAll().then((res) => res.map((d) => d.value));
  const numClasses = classes.length;
  const [xTrain, yTrain, xTest, yTest] = await data.getData(data2d, numClasses, 0.2);

  let model = '';

  try {
    // Load model
    model = await tf.loadLayersModel('file://src/tensor/diagnosisModel/model.json');
  } catch (err) {
    // Train the model
    model = await trainModel(xTrain, yTrain, xTest, yTest);
  }

  return { model };
};
