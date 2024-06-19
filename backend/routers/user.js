const express=require("express");
const userrouter=express.Router();
const {authMiddleware}=require("../middleware");


const zod=require("zod");
const {User,Account}=require("../db");
const jwt=require("jsonwebtoken");
const{JWT_SECRET}=require("../config");

const signup=zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})
router.post("/signup",async(req,res)=>{
    const{success}=signup.safeParse(req.body)
    if(!success){
        return res.status(411).json({
         message:"INPUTS ARE INCORRECT"    
        })
    }

    const existingUser=await User.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message:"ALREADY TAKEN"
        })
    }
    const user= await User.create({
        username:req.body.username,
        password:req.body.password,
        firstname:req.body.firstname,
        lastname:req.body.lastname
    })

const userId=user._id;
 await Account.create({
    userId,
    balance:1+Math.random()*10000
 })
const token =jwt.sign({
    userId
},JWT_SECRET);

res.json({
    message:"User created successfully",
    token:token
})
})

const signin=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async(req,res)=>{
    const{ success}=signin.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    });

    if(user){
        const token =jwt.sign({
           userId:user._id 
        },JWT_SECRET);

        res.json({
            token:token
        })
        return;
    }

res.status(411).json({
   message:"Error while logging in" 
})
    
})

const updateBody=zod.object({
    password:zod.string.optional(),
    firstname:zod.string.optional(),
    lastname:zod.string.optional()
})

router.put("/",authMiddleware,async(req,res)=>{
    const { success }=update.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:"Error while updating information"
        })
    }
    await User.updateOne(req.body,{
      _id:req.userId
    })

    res.json({
      message:"Updatd successfully"  
    })
})
router.get("/bulk",async(req,res)=>{
    const filter=req.query.filter||"";
    const users= await User.find({
      $or:[{
        firstname:{
            "$regex": filter
        }
       }
        ,{
            lastname:{
                "$regex":filter
            }
        
      }]  
    })

    res.json({
      User:  users.map(User=>({
          username:User.username,
          firstname:User.firstname,
           lastname:User.lastname,
           _id:User._id
        }))
    })
})
module.exports=userrouter;