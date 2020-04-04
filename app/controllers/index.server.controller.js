// load dependencies
const runTensorFlow = require('../../TensorFlow')

// render controller
exports.render = (req, res) => {
    if (typeof (req.session.form) === "undefined") {
        req.session.form = {
            epochNum: "",
            learningRate: "",
            sepalLength: "",
            sepalWidth: "",
            petalLength: "",
            petalWidth: "",
            species: "",
        };
    }

    // render index page
    res.render("index", {
        title: "Guess Iris Species with Siri",
        expressFlash: req.flash('error'),
        form: req.session.form
    });
};

// submitIris controller
exports.submitIris = (req, res, next) => {
    const {
        epochNum,
        learningRate,
        sepalLength,
        sepalWidth,
        petalLength,
        petalWidth,
        species
    } = req.body;

    // get testing data from the form
    let testingData = [{
        sepal_length: parseFloat(sepalLength),
        sepal_width: parseFloat(sepalWidth),
        petal_length: parseFloat(petalLength),
        petal_width: parseFloat(petalWidth),
        species: species,
    }, ];

    console.log("=============testing data============ ");
    console.log(testingData);
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

        // clear session
        req.session.destroy();

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