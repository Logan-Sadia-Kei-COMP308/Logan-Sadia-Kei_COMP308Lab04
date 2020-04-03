exports.render = (req, res) => {
  res.render("index", {
    title: "TensorFlow Tester"
  });
};

exports.submitIris = (req, res, next) => {
  // get testing data from form
  let testingData = [
    {
      sepal_length: parseFloat(req.body.sepalLength),
      sepal_width: parseFloat(req.body.sepalWidth),
      petal_length: parseFloat(req.body.petalLength),
      petal_width: parseFloat(req.body.petalWidth),
      species: req.body.species
    }
  ];
  console.log("=============testing data============ ");

  console.log(testingData);

  // get test configuration
  let epochNum = req.body.epochNum;
  let learningRate = req.body.learningRate;

  console.log("Number of Epoch:" + epochNum);
  console.log("Learning rate:" + learningRate);

  function checkGuess(resultData, userGuess) {
    let val1 = resultData[0];
    let val2 = resultData[1];
    let val3 = resultData[2];
    let final = Math.max(val1, Math.max(val2, val3));
    let name = "";

    if (final == val1) {
      name = "Setosa";
    } else if (final == val2) {
      name = "Virginica";
    } else if (final == val3) {
      name = "Versicolor";
    }

    if (userGuess.toUpperCase() === name.toUpperCase()) {
      return "Your guess " + name + " is same as mine!";
    } else {
      return (
        "You guessed " +
        userGuess.charAt(0).toUpperCase() +
        userGuess.slice(1) +
        ", but I think it's " +
        name +
        ". You should study more!"
      );
    }
  }

  // run tensor flow
  async function run() {
    let testResults = await testRun(epochNum, learningRate, testingData);
    var resultForData = testResults;
    let siriAnswer = checkGuess(resultForData[0], testingData[0].species);
    console.log("in testRun():" + resultForData[0]);
    res.render("result", {
      title: "Guess with Siri",
      epoch: epochNum,
      learningRate: learningRate,
      resultForTest1: resultForData[0],
      siriAnswer: siriAnswer
    });
  }
  run();
};

async function testRun(epochNum, learningRate, irisData) {
  //
  //https://github.com/PacktPublishing/Hands-on-Machine-Learning-with-TensorFlow.js/tree/master/Section5_4
  //
  const tensorFlowEngine = require("@tensorflow/tfjs");
  require("@tensorflow/tfjs-node");

  //load iris training and testing data
  // inputs(for training and testing)
  const iris = require("../../iris.json");

  // for building neural network
  let model;

  // for data maping to tensor
  let trainingData, outputData;
  let testingData;

  //
  const mapJsonDataToTensor = () => {
    //tensor of features for training data
    /**
     * The 4 features of iris flowers are mapped to an array here.
     */
    console.log("----- tensor of features for training data -----");
    trainingData = tensorFlowEngine.tensor2d(
      iris.map(item => {
        let mappedItem = [
          item.sepal_length,
          item.sepal_width,
          item.petal_length,
          item.petal_width
        ];

        // for mapping result check
        console.log("mapped Item Traning Data=>" + mappedItem);

        return mappedItem;
      })
    );

    //tensor of output for training data
    //
    /**
     * Items in iris.json are mapped to an array which represents the boolean combination of species
     * for training the model
     *
     *  iris setosa: http://www.perennials.com/plants/iris-setosa-var-arctica.html
     * iris virginia: https://www.fs.fed.us/wildflowers/beauty/iris/Blue_Flag/iris_virginica.shtml
     * iris versicolor: https://www.fs.fed.us/wildflowers/beauty/iris/Blue_Flag/iris_versicolor.shtml
     */
    console.log("----- tensor of output for training data -----");
    outputData = tensorFlowEngine.tensor2d(
      iris.map(item => {
        let mappedItem = [
          item.species === "setosa" ? 1 : 0,
          item.species === "virginica" ? 1 : 0,
          item.species === "versicolor" ? 1 : 0
        ];

        // console.log(item);
        console.log("=>OutpUT dATA" + mappedItem);

        return mappedItem;
      })
    );

    console.log("----- tensor of features for testing data -----");
    console.log(irisData);
    testingData = tensorFlowEngine.tensor2d(
      irisData.map(item => {
        let mappedItem = [
          item.sepal_length,
          item.sepal_width,
          item.petal_length,
          item.petal_width
        ];

        // for mapping result check
        console.log(item);
        console.log("=>" + mappedItem);

        return mappedItem;
      })
    );
  };
  const buildNeuralNetwork = () => {
    // build neural network using a sequential model
    model = tensorFlowEngine.sequential();

    // adding three layers: the first layer, the hidden layer, and the output layer
    //add the first layer
    model.add(
      tensorFlowEngine.layers.dense({
        inputShape: [4], // four input neurons
        activation: "sigmoid",
        units: 5 //dimension of output space (first hidden layer)
      })
    );

    //add the hidden layer
    model.add(
      tensorFlowEngine.layers.dense({
        inputShape: [5], //dimension of hidden layer
        activation: "sigmoid",
        units: 3 //dimension of final output
      })
    );

    //add output layer
    model.add(
      tensorFlowEngine.layers.dense({
        activation: "sigmoid",
        units: 3 //dimension of final output
      })
    );

    //compile the model with an MSE loss function and Adam algorithm
    model.compile({
      loss: "meanSquaredError",
      optimizer: tensorFlowEngine.train.adam(learningRate)
    });
  };

  /**
   * This method is for getting the result of prediction for testingData
   */
  const doPrediction = async () => {
    console.log("----- Trainning data with TensorFlow -----");

    // train/fit the model for the fixed number of epochs
    const startTime = Date.now();

    console.log("----- Prediction for testing data -----");

    await model.fit(trainingData, outputData, {
      epochs: epochNum,
      callbacks: {
        onEpochEnd: async (epoch, log) => {
          console.log(`Epoch ${epoch}: Loss = ${log.loss}`);
          elapsedTime = Date.now() - startTime;
          console.log("Elapsed Time " + elapsedTime);
        }
      }
    });

    // test network
    let results = model.predict(testingData);
    results.print();
    console.log(results);
    return results.array();
  };

  mapJsonDataToTensor();
  buildNeuralNetwork();
  let results = await doPrediction();

  return results;
}
