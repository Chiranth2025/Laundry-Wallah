const mongoose=require('mongoose')

async function connectDB(){
  await mongoose.connect("mongodb+srv://yt:2XgX66jZVxOoIBDP@cluster0.znd63ec.mongodb.net/Laundry_Wallah")
  console.log("Connected to DB")
}

module.exports=connectDB;