const { request } = require('express');
const express = require('express')
const app = express();
const port = process.env.PORT || 4200;

const FederatedModel = require('./src/model');

const trainedWeights = {
  set1: {},
  set2: {},
  set3: {},
  set4: {},
  set5: {},
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/trained-weights', (req, res) => {
  try {
    const clientNum = req.body.client
    const setNum = req.body.set
    const weights = req.body.weights
    const setKey = "set" + setNum
    trainedWeights[setKey][clientNum] = weights
    if (Object.keys(trainedWeights[setKey]).length === 6) {
      // aggregate weights here 
    }
    res.status(200).send("OK")
  } catch (error) {
    res.status(500).send(error)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

const federatedModel = new FederatedModel();
const weights = federatedModel.getWeights();
federatedModel.setWeights(weights);
