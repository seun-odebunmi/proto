const tf = require('@tensorflow/tfjs-node');

export const convertToTensors = (data, targets, testSplit, numClasses) => {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error('data and split have different numbers of examples');
  }

  // Randomly shuffle `data` and `targets`.
  const indices = [];
  for (let i = 0; i < numExamples; ++i) {
    indices.push(i);
  }
  tf.util.shuffle(indices);

  const shuffledData = [];
  const shuffledTargets = [];
  for (let i = 0; i < numExamples; ++i) {
    shuffledData.push(data[indices[i]]);
    shuffledTargets.push(targets[indices[i]]);
  }

  // Split the data into a training set and a tet set, based on `testSplit`.
  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = shuffledData[0].length;

  // create a 2D tf.tensor to hold the feature data
  const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

  // create a 1D tf.tensor to hold the labels and convert the number label
  // from the set {0, 1, 2, ...} to one-hot encoding (e.g., 0 ---> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), numClasses);

  // split the data into training and test sets, using slice
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, numClasses]);
  const yTest = ys.slice([0, 0], [numTestExamples, numClasses]);

  return [xTrain, yTrain, xTest, yTest];
};

export const getData = async (medData, numClasses, testSplit) => {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];

    // group data and target by class (target is classifier)
    for (let i = 0; i < numClasses; ++i) {
      dataByClass.push([]);
      targetsByClass.push([]);
    }
    for (const example of medData) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);
      if (dataByClass[target - 1]) dataByClass[target - 1].push(data);
      if (targetsByClass[target - 1]) targetsByClass[target - 1].push(target);
    }
    // ensure each classifier has at least one row of data
    const filDataByClass = dataByClass.filter((d) => d.length > 0);
    const filTargetsByClass = targetsByClass.filter((d) => d.length > 0);
    const filNumClasses = filTargetsByClass.length;

    // split into training and test data
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    const concatAxis = 0;
    for (let i = 0; i < filNumClasses; ++i) {
      if (filDataByClass[i] && filTargetsByClass[i]) {
        const [xTrain, yTrain, xTest, yTest] = convertToTensors(
          filDataByClass[i],
          filTargetsByClass[i],
          testSplit,
          filNumClasses
        );
        xTrains.push(xTrain);
        yTrains.push(yTrain);
        xTests.push(xTest);
        yTests.push(yTest);
      }
    }

    return [
      tf.concat(xTrains, concatAxis),
      tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis),
      tf.concat(yTests, concatAxis),
    ];
  });
};
