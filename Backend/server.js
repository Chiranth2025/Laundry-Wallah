//used for running a server
// require("dotenv").config();
const app=require('./src/app');
const connectDB=require('./src/db/db');

connectDB();

app.listen(3000,()=>{
  console.log("Port is starting at the port 3000")
})

