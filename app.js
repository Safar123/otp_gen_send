const express = require('express')
const app = express();

app.use(express.json());

const userRouter = require('./routes/userRoutes');
const errorHandler = require('./utils/errorHandler');


app.use('/api/v1/user', userRouter);

app.use(errorHandler);

module.exports = app