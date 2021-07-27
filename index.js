const express = require('express')
const tf = require('@tensorflow/tfjs');
const app = express();
const port = process.env.PORT || 4200;

const FederatedModel = require('./src/model');
const federatedModel = new FederatedModel();


const trainedWeights = {
  set1: {},
  set2: {},
  set3: {},
  set4: {},
  set5: {},
}

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/get-weights', async (req, res) => {
  let result = await federatedModel.model.save(tf.io.withSaveHandler(async modelArtifacts => modelArtifacts));
  result.weightData = Buffer.from(result.weightData).toString("base64");
  const jsonStr = JSON.stringify(result);
  res.status(200).send({ model: jsonStr });
});

app.post('/aggregate-weights', async (req, res) => {
  try {
    const clientNum = req.body.client;
    const json = JSON.parse(req.body.model);
    const weightData = new Uint8Array(Buffer.from(json.weightData, "base64")).buffer;
    const model = await tf.loadLayersModel(tf.io.fromMemory(json.modelTopology, json.weightSpecs, weightData));
    
    let updatedSet;
    for (const currKey of Object.keys(trainedWeights)) {
      if (trainedWeights[currKey][`client${clientNum}`] === undefined) {
        updatedSet = currKey;
        trainedWeights[currKey][`client${clientNum}`] = model;
        break;
      }
    }

    if (updatedSet && Object.keys(trainedWeights[updatedSet]).length === 2) {
      console.log('calling federated aggregation');
      federatedModel.federatedAggregation(trainedWeights[updatedSet]);
      console.log('federated aggregation call done and new weights saved');
    }
    
    res.status(200).send("OK")
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
