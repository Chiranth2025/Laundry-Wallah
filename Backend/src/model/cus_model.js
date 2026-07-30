//define the data type of the customer
const mongoose=require('mongoose')

const cus_Schema=new mongoose.Schema({
       service:{type:String},
       date:{type:String},
       time:{type:String},
       address:{type:String}
})

const cus_model=mongoose.model("order",cus_Schema)

module.exports=cus_model;