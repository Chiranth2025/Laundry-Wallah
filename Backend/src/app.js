// used for create a server
const express = require('express');
const app = express();
const cors=require('cors')
const authRouter=require("./routes/auth.routes")
// 1. Import your Mongoose model (uncommented!)
const cus_model = require('./model/cus_model'); // Adjust the path if your model is in a different folder

app.use(express.json());
app.use(cors());
app.use("/api/auth",authRouter)//used prefix key here
// POST -- Save to MongoDB
app.post('/order', async (req, res) => {
        const newOrder = new cus_model(req.body);
        await newOrder.save(); 
        
        res.status(201).json({
            message: "Data is sent and saved successfully"
        });
});

// GET -- Fetch from MongoDB
app.get('/order', async (req, res) => {
        // Fetch all orders from the database
        const allOrders = await cus_model.find(); 
        
        res.status(200).json({
            message: "Data is fetched successfully",
            order: allOrders
        });
      }
);

// DELETE -- Remove from MongoDB using ID
app.delete('/order/:id', async (req, res) => {
        const id = req.params.id;
        await cus_model.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Order deleted successfully",
        });
});

module.exports = app;