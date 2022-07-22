require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`)
//mongodb+srv://mongo:mongo@cluster0.xvax18f.mongodb.net/testdb?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/${process.env.DB_NAME}


const permitRoute = require("./router/permit");
const roleRoute = require("./router/role");
const adminRoute = require("./router/admin");
const userRoute = require("./router/user");

app.use("/permit", permitRoute);
app.use("/role", roleRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);



app.use("*", (req, res, next) => {
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
const defaultData = async () => {
    let migrator = require("./migration/migrator");
    // await migrator.migrate();
    // await migrator.backUp();
    // await migrator.addOwnerRole();
}
// defaultData();



app.listen(process.env.PORT, console.log(`Server is runing at port ${process.env.PORT}`));
