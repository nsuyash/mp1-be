const mongoose = require('mongoose')
require("dotenv").config();

const mySecret = process.env.MONGODB_URL

const initalizeDatabase = () => {
  try {
    const connected = mongoose.connect(mySecret,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    if(connected){
      console.log('Connected Successfully.')
    }
  } catch (error) {
    console.log('Connection failed.')
  }
}

module.exports = { initalizeDatabase }