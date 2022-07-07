const mongoose = require('mongoose');

const dbConnectFunc = ()=>{
    mongoose.connect(process.env.MONGO_DB_STRING, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(con=>{
        console.log(`Database connected successfully as ${con.connection.host}`)
    }).catch(err=>console.log(err))
}

module.exports = dbConnectFunc;