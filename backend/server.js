/* eslint-disable linebreak-style */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import data from './data';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';

mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(()=>{
  console.log('Connected to mongodb');
})
.catch((error)=> {
  console.log(error.message);
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.get('/api/paypal/clientId', (req, res) => {
  res.send({clientId: config.PAYPAL_CLIENT_ID});
});

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/:id', (req, res) =>{
  const product = data.products.find((x) => x._id === req.params.id);

  if(product){
    res.send(product);
  }else{
    res.status(404).send({message: 'Product not found'});
  }
  
});

app.use((err, req, res, next) =>{
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({message: err.message});
});

app.listen(5000, () => {
  console.log('running at http://localhost:5000');
});
