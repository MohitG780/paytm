const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://mohitgupta000780:<password>@cluster0.v8ylcnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const userSchema=mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String
});

const User=mongoose.model("User",userSchema);
const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const Account=mongoose.model('Account',accountSchema);

module.exports({
    User,Account
});