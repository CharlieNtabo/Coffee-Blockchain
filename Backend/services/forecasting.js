const tf = require('@tensorflow/tfjs-node');

const predictDemand = async (historicalData) => {
  const data = historicalData.length > 0 ? historicalData : [
    [1, 100], [2, 120], [3, 130], [4, 150], [5, 170]
  ];

  const xs = tf.tensor2d(data.map(d => [d[0]]), [data.length, 1]);
  const ys = tf.tensor2d(data.map(d => [d[1]]), [data.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

  await model.fit(xs, ys, { epochs: 100 });

  const nextMonth = tf.tensor2d([[data.length + 1]], [1, 1]);
  const prediction = model.predict(nextMonth).dataSync()[0];

  return Math.round(prediction);
};

module.exports = { predictDemand };