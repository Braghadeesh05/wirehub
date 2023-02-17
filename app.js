const dotenv=require('dotenv')
const mongoose=require('mongoose')
const express = require('express')
const app = express();

dotenv.config({path: './config.env'});
require('./db/conn');

//const User=require('./model/userSchema');

app.use(express.json());
    

app.use(require('./router/auth'));

//mongoose.set('strictQuery', true);

//const DB="mongodb+srv://dhanush:avdhjruj@cluster0.876zbdi.mongodb.net/mernstack?retryWrites=true&w=majority"

//const DB=process.env.DATABASE;

const PORT=process.env.PORT;
/*
mongoose.connect(DB).then(() =>{
    console.log('connection successful');
}).catch((err)=>console.log(err));
*/

//middleware
/*const middleware = (req,res,next)=>{
    console.log('hello my middleware');
    next();
}
app.get('/',(req,res)=>
{
    res.send("hello world from the server from app.js");
});




app.get('/about', middleware, (req,res)=>
{
    console.log('hello my about');
    res.send("hello about world from the server");
});


app.get('/contact',(req,res)=>
{
    //cookie using
    //res.cookie("Test", 'dhanx');
    
    res.send("hello contact world from the server");
});

*/

app.use(express.static("client/build"));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})


/*
app.get('/signin',(req,res)=>
{
    res.send("hello login world from the server");
});
app.get('/signup',(req,res)=>
{
    res.send("hello  registration world from the server");
});
*/
app.listen(PORT, ()=>{
    console.log("server running at port 5000");
})
