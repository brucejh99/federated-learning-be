const express = require('express')
const app = express();
const port = process.env.PORT || 4200;

const FederatedModel = require('./src/model');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

const federatedModel = new FederatedModel();
const weights = federatedModel.getWeights();
federatedModel.setWeights(weights);
