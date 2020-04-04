// define
module.exports = async (epochNum, learningRate, irisData) => {
    // load dependencies and data
    const tensorFlowEngine = require("@tensorflow/tfjs");
    require("@tensorflow/tfjs-node");
    const iris = require("./iris.json");

    // variables
    let trainingData, outputData;
    let testingData;
    let model;

    // define data conversion method
    const mapJsonToTensor = () => {
        // tensor of features for training data
        /**
         * The 4 features of iris flowers are mapped to an array here.
         */
        console.log("----- tensor of features for training data -----");
        trainingData = tensorFlowEngine.tensor2d(
            iris.map((item) => {
                let mappedItem = [
                    item.sepal_length,
                    item.sepal_width,
                    item.petal_length,
                    item.petal_width,
                ];
                
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
         * iris setosa: http://www.perennials.com/plants/iris-setosa-var-arctica.html
         * iris virginia: https://www.fs.fed.us/wildflowers/beauty/iris/Blue_Flag/iris_virginica.shtml
         * iris versicolor: https://www.fs.fed.us/wildflowers/beauty/iris/Blue_Flag/iris_versicolor.shtml
         */
        console.log("----- tensor of output for training data -----");
        outputData = tensorFlowEngine.tensor2d(
            iris.map((item) => {
                let mappedItem = [
                    item.species === "setosa" ? 1 : 0,
                    item.species === "virginica" ? 1 : 0,
                    item.species === "versicolor" ? 1 : 0,
                ];

                // console.log(item);
                console.log("=>OutpUT dATA" + mappedItem);

                return mappedItem;
            })
        );

        console.log("----- tensor of features for testing data -----");
        console.log(irisData);
        testingData = tensorFlowEngine.tensor2d(
            irisData.map((item) => {
                let mappedItem = [
                    item.sepal_length,
                    item.sepal_width,
                    item.petal_length,
                    item.petal_width,
                ];

                // for mapping result check
                console.log(item);
                console.log("=>" + mappedItem);

                return mappedItem;
            })
        );
    };

    // define building neural network method
    const buildNeuralNetwork = () => {
        // build neural network using a sequential model
        model = tensorFlowEngine.sequential();

        // adding three layers: the first layer, the hidden layer, and the output layer
        // add the first layer
        model.add(
            tensorFlowEngine.layers.dense({
                inputShape: [4], // four input neurons
                activation: "sigmoid",
                units: 5, //dimension of output space (first hidden layer)
            })
        );

        // add the hidden layer
        model.add(
            tensorFlowEngine.layers.dense({
                inputShape: [5], //dimension of hidden layer
                activation: "sigmoid",
                units: 3, //dimension of final output
            })
        );

        // add output layer
        model.add(
            tensorFlowEngine.layers.dense({
                activation: "sigmoid",
                units: 3, //dimension of final output
            })
        );

        // compile the model with an MSE loss function and Adam algorithm
        model.compile({
            loss: "meanSquaredError",
            optimizer: tensorFlowEngine.train.adam(learningRate),
        });
    };

    /**
     * This method is for getting the result of prediction for testingData
     */
    const doPrediction = async () => {
        console.log("----- Trainning data with TensorFlow -----");

        // train/fit the model for the fixed number of epochs
        const startTime = Date.now();

        await model.fit(trainingData, outputData, {
            epochs: epochNum,
            callbacks: {
                onEpochEnd: async (epoch, log) => {
                    console.log(`Epoch ${epoch}: Loss = ${log.loss}`);
                    elapsedTime = Date.now() - startTime;
                    console.log("Elapsed Time " + elapsedTime);
                },
            },
        });

        console.log("----- Prediction for testing data -----");

        // test network
        let results = model.predict(testingData);
        results.print();
        console.log(results);

        return results.array();
    };

    mapJsonToTensor();
    buildNeuralNetwork();

    return await doPrediction();
}