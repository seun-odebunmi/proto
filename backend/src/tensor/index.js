const tf = require('@tensorflow/tfjs-node');
import { models } from '../models';
import { getData } from './data';

const trainModel = async (xTrain, yTrain, xTest, yTest) => {
  console.log('Training model... Please wait.');
  // Prepare the model for training.
  const learningRate = 0.009;
  const numberOfEpochs = 100;
  const optimizer = tf.train.adam(learningRate);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 120, activation: 'relu', inputShape: [xTrain.shape[1]] }));
  model.add(tf.layers.dense({ units: 80, activation: 'relu' }));
  model.add(tf.layers.dense({ units: yTrain.shape[1], activation: 'softmax' }));

  model.summary();

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  let valAcc;
  let valLoss;
  await model
    .fit(xTrain, yTrain, {
      epochs: numberOfEpochs,
      validationData: [xTest, yTest],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          valAcc = logs.acc;
          valLoss = logs.loss;
          console.log(`Epoch: ${epoch}, Loss: ${logs.loss}, Acc: ${logs.acc}`);
          await tf.nextFrame();
        },
      },
    })
    .then(async () => {
      const finalValAccPercent = valAcc * 100;
      console.log(`Final validation accuracy: ${finalValAccPercent.toFixed(1)}%;`);
      console.log('Done Training');
      await model.save('file://src/tensor/diagnosisModel');
      console.log('Model saved');
    });

  return model;
};

export const run = async () => {
  let model = '';
  try {
    model = await tf.loadLayersModel('file://src/tensor/diagnosisModel/model.json');
  } catch (err) {
    // fetch data and remove unwanted fields
    const cleaned = await models.MedicalRecords.getAll().then((d) =>
      d.map(({ id, HistoryofPresentIllness, user_id, ...rest }) => ({ ...rest }))
    );
    const data2d = await cleaned
      .map((d) => Object.keys(d).map((key) => d[key]))
      .filter((d) => d.indexOf(null) < 0);

    // fetch all existing diagnosis (classes)
    const classes = await models.Diagnosis.getAll().then((res) => res.map((d) => d.value));
    const numClasses = classes.length;
    const [xTrain, yTrain, xTest, yTest] = await getData(data2d, numClasses, 0.2);

    model = await trainModel(xTrain, yTrain, xTest, yTest);

    const input = tf.tensor2d([20, 2, 6, 6, 1, 1, 3, 3], [1, 8]);
    const prediction = model.predict(input).argMax(-1).dataSync();
    console.log('pred', prediction);
  }

  return { model };
};
