const dotenv=require('dotenv')
const mongoose=require('mongoose')
const express = require('express')
const app = express();

dotenv.config({path: './config.env'});
require('./db/conn');


app.use(express.json());
app.use(require('./router/auth'));


const PORT=process.env.PORT;



//Rendering Client
app.use(express.static("client/build"));
app.get("/",function(req,res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

//PORT
app.listen(PORT, ()=>{
    console.log("server running at port 5000");
})
