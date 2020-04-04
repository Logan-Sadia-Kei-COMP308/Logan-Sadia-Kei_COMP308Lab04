// load dependencies
const runTensorFlow = require('../../TensorFlow')

// render controller
exports.render = (req, res) => {
  res.render("index", {
    title: "Guess Iris Species with Siri",
  });
};

// submitIris controller
exports.submitIris = (req, res, next) => {
  // get testing data from the form
  let testingData = [
    {
      sepal_length: parseFloat(req.body.sepalLength),
      sepal_width: parseFloat(req.body.sepalWidth),
      petal_length: parseFloat(req.body.petalLength),
      petal_width: parseFloat(req.body.petalWidth),
      species: req.body.species,
    },
  ];

  console.log("=============testing data============ ");
  console.log(testingData);

  // get test configuration
  let epochNum = req.body.epochNum;
  let learningRate = req.body.learningRate;

  console.log("Number of Epoch:" + epochNum);
  console.log("Learning Rate:" + learningRate);

  // define 
  const checkGuess = (resultData, userGuess) => {
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

    // return message according to the guess
    if (userGuess.toUpperCase() === name.toUpperCase()) {
      return `Your guess ${name} is same as mine!`;
    } else {
      return (
        `You guessed ${userGuess[0].toUpperCase() + userGuess.slice(1)}` +
        `, but I think it's ${name}. You should study more!`
      );
    }
  }

  // run TensorFlow and then process the result
  runTensorFlow(epochNum, learningRate, testingData).then(testResults => {
    // get the  result
    let testResult = testResults[0];

    // check the testing result with user's guess
    let siriAnswer = checkGuess(testResult, testingData[0].species);

    // render result page
    res.render("result", {
      title: "Hi, it's Siri",
      epoch: epochNum,
      learningRate: learningRate,
      testResult: testResult,
      siriAnswer: siriAnswer,
    });
  })

};