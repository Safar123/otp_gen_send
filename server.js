const dotenv= require('dotenv')
dotenv.config({path:'./config.env'});

const app = require('./app');
const dbConnectFunc = require('./database');

dbConnectFunc();

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
})
