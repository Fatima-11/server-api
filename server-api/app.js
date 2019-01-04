const http = require('http');


const express = require('express')
const app = express()

const mongoose = require('mongoose')

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const authroutes = require('./routes/auth-user')

//function that will execute for every incoming request
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use('/auth', authroutes);

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({message: message, data: data})
})

mongoose
  .connect(
    'mongodb://fatima:Hanana1133@cluster0-shard-00-00-ibnpf.mongodb.net:27017,cluster0-shard-00-01-ibnpf.mongodb.net:27017,cluster0-shard-00-02-ibnpf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
  )
  .then(result => {
      console.log('connected to the server')
    app.listen(3000);
  })
  .catch(err => console.log(err));
