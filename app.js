require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

app.use(express.json());    

const userRoute = require("./router/user");

app.use("/user", userRoute);



app.use("*", (req,res,next)=>{
    res.status(200).json({
        cons: false,
        msg: "No route with your url!"
    })
})
app.use((err, req, res, next) => {
    err.status = err.status || 200;
    res.status(err.status).json({
        cons: false,
        msg: err.message
    })
})


app.listen(process.env.PORT, console.log(`Server is runing at port ${process.env.PORT}`));