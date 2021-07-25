const express = require('express')
const app = express();
const port = process.env.PORT || 4200;

const FederatedModel = require('./src/model');


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/test-weights', (req, res) => {
  console.log('got post');
  console.log(req.body);
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const federatedModel = new FederatedModel();
const weights = federatedModel.getWeights();
federatedModel.setWeights(weights);
