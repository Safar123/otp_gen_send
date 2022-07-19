const dotenv= require('dotenv')
dotenv.config({path:'./config/config.env'});

const app = require('./app');
const dbConnectFunc = require('./config/database');

dbConnectFunc();

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
})
