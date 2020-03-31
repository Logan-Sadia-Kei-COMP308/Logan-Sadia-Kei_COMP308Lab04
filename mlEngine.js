//
//https://github.com/PacktPublishing/Hands-on-Machine-Learning-with-TensorFlow.js/tree/master/Section5_4
//
const tensorFlowEngine = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

//load iris training and testing data
const iris = require('./iris.json');
const irisTesting = require('./iris-testing.json');

//
// convert/setup our data for tensorflow.js
//
//tensor of features for training data
/** 
 * 
 * The 4 features of iris flowers are mapped to an array here.
*/
console.log("----- tensor of features for training data -----");
const trainingData = tensorFlowEngine.tensor2d(iris.map(item => {
    let mappedItem = [item.sepal_length, item.sepal_width, item.petal_length, item.petal_width]

    // for mapping result check
    // console.log(item);
    // console.log("=>" + mappedItem);

    return mappedItem;
}))

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
const outputData = tensorFlowEngine.tensor2d(iris.map(item => {
    let mappedItem = [
        item.species === "setosa" ? 1 : 0,
        item.species === "virginica" ? 1 : 0,
        item.species === "versicolor" ? 1 : 0
    ];

    // console.log(item);
    // console.log("=>" + mappedItem);

    return mappedItem;
}))


//
//tensor of features for testing data
/** 
 * The three irises in iris-testing.json are mapped for testing
*/
console.log("----- tensor of features for testing data -----");
const testingData = tensorFlowEngine.tensor2d(irisTesting.map(item => {
    let mappedItem = [item.sepal_length, item.sepal_width, item.petal_length, item.petal_width]

    // for mapping result check
    console.log(item);
    console.log("=>" + mappedItem);

    return mappedItem;
}))


// build neural network using a sequential model
const model = tensorFlowEngine.sequential()

// adding three layers: the first layer, the hidden layer, and the output layer
//add the first layer
model.add(tensorFlowEngine.layers.dense({
    inputShape: [4], // four input neurons
    activation: "sigmoid",
    units: 5, //dimension of output space (first hidden layer)
}))

//add the hidden layer
model.add(tensorFlowEngine.layers.dense({
    inputShape: [5], //dimension of hidden layer
    activation: "sigmoid",
    units: 3, //dimension of final output
}))

//add output layer
model.add(tensorFlowEngine.layers.dense({
    activation: "sigmoid",
    units: 3, //dimension of final output
}))


//compile the model with an MSE loss function and Adam algorithm
model.compile({
    loss: "meanSquaredError",
    optimizer: tensorFlowEngine.train.adam(.06),
})


console.log("----- Train data with TensorFlow -----");
// train/fit the model for the fixed number of epochs
const startTime = Date.now()
model.fit(trainingData, outputData, { epochs: 100 })
    .then((history) => {
        //console.log(history)
        //display prediction results for the inpud samples
        model.predict(testingData).print()
        elapsedTime = Date.now() - startTime;
        console.log(elapsedTime)

    })
// test network

/**
 * Below is the result of prediction for testingData:
 *
 * Tensor
    [[0.9898434, 0.0007745, 0.0179387],
     [0.0035934, 0.910811 , 0.1022497],
     [0.0108282, 0.02224  , 0.9679161]]
 *
 * The first item is 98% close to setosa, 0.077% close to virginica, and 1.79% close to versicolor
 * The second item is 91% close to virginica
 * The third item is 96% close to versicolor
*/