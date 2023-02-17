const jwt=require('jsonwebtoken');
const express=require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const authenticate=require("../middleware/authenticate");
const cookieParser=require('cookie-parser');
router.use(cookieParser());

require('../db/conn');
const User=require("../model/userSchema");



/*
router.get('/',(req,res)=>
{
    res.send("hello world from the server router js");
});
*/
/*
router.post('/register', (req,res)=>{

    const {name, email,phone,work,password,cpassword} =req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error : "pls filled the field property"});
    }

    User.findOne({email:email})
    .then((userExist)=>{
        if(userExist){
            return res.status(422).json({ error: "email already exist"});
        }

        const user = new User({name, email,phone,work,password,cpassword});

        user.save().then(()=>{
            res.status(201).json({message: "user registered successfully"});
        }).catch((err)=>res.status(500).json({error : "failed to registered"}));
    }).catch(err =>{console.log(err);});

*/

router.post('/register', async (req,res)=>{

    const {name, email,phone,work,password,cpassword} =req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error : "pls filled the field property"});
    }

    try{
        
        const userExist= await User.findOne({email:email})
        if (userExist){
            return res.status(422).json({ error: "email already exist"});
        }
        else if(password  != cpassword)
        {
            return res.status(422).json({error:"password are not matching"});
        }
        else{
        const user = new User({name,email,phone,work,password,cpassword});
         
        //const userRegister = await user.save();

        await user.save();
        res.status(201).json({message: "user registered successfully"});

        /*
        if(userRegister){
            res.status(201).json({message: "user registered successfully"});
        }
        else{
            res.status(500).json({ error: "failed to registered"})
        }
        */
    }
    }
    catch(err){
            console.log(err);
    }
    


    //console.log(name);
    //console.log(work);

    //console.log(req.body.name);
    //console.log(req.body.email);
    //res.json({message:req.body});
    //res.send("mera register page");
});

/*
router.post('/signin', (req,res)=>{
    console.log(req.body);
    res.json({message : "awesome"})
})
*/

router.post('/signin', async(req,res)=>{
    try{
        let token;
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({eror:"pls filled the data"})

        }

        const userLogin = await User.findOne({email:email});
        //console.log(userLogin);
        if(userLogin){
        const isMatch=await bcrypt.compare(password, userLogin.password);   
        token = await userLogin.generateAuthToken();    
        res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
            httpOnly:true
        });

        if(!isMatch){
            return res.status(400).json({error: "invalid credientials in password"});
        }else{
            
            console.log(token);
            res.json({message: "user signin successfully"});
        }}
        else{
            return res.status(400).json({error: "invalid credientials"});
        }

    }
    catch(err){
        console.log(err);
    }
})

router.get('/about',authenticate, (req,res)=>
{
    console.log("hello my about");
    res.send(req.rootUser);
});

router.get('/getdata', authenticate,(req,res)=>{
    console.log('hello my contact');
    res.send(req.rootUser);
})

router.post('/contact',authenticate,async (req,res)=>
{
    try{
        const {name,email,phone,message}=req.body;

        if(!name || !email|| !phone|| !message){
            console.log('error in contact form');
            return res.json({error: "plzz filled the contact form"});
        }

        const userContact=await User.findOne({_id:req.userID});

        if(userContact){
            const userMessage= await userContact.addMessage(name, email, phone, message);

            await userContact.save();
            console.log("saved successfully");
            res.status(201).json({message:"user Contact successfully"});
            console.log("message received successfully");
        }
    }
    catch(err)
    {
        console.log(err);
    }
});

router.get('/logout', (req,res)=>
{
    console.log("hello my logout");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('user logout');
});




module.exports=router;
