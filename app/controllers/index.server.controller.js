exports.render = (req, res) => {
    res.render('index', {
        title: 'TensorFlow Tester'
    });

}

exports.submitIris = (req, res, next) => {

    // get testing data from form
    let testingData = {
        sepal_length: req.body.sepalLength,
        sepal_width: req.body.sepalWidth,
        petal_length: req.body.petalLength,
        petal_width: req.body.petalWidth,
        species: req.body.species
    }
    console.log(testingData);

    // get test configuration
    let epochNum = req.body.epochNum;
    let learningRate = req.body.learningRate;

    console.log("Number of Epoch:" + epochNum);
    console.log("Learning rate:" + epochNum);

    // run tensor flow

    // render
    res.render('result', {
        title: 'Thank you!'
    });
}