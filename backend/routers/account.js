const express=require('express');
const router=express.Router();
const {authMiddleware}=require("../middleware");

const {User,Account}=require("../db");

 
router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    });
    if(!account){
        return res.status(400).json({
            message:"THIS ACCOUNT NOT EXIST"
        });
 
    }
    res.json({
       balance: account.balance 
    })
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;

    const account =await Account.findOne({ userId:req.userId}).Session(session);
    if(!account|| account.balance<amount){
        await session.abortTransaction;
        return res.status(400).json({
            message:"Insufficient balance"
        });

    }

    const toaccount=await Account.findOne({userId:to}).Session(session);
    if(!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"INVALID RECIEVER"
        });
    }
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).Session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).Session(session);
    await session.commitTransaction();
    console.log("done");
})
module.exports=router;

