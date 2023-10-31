const jwt=require("jsonwebtoken");
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
mongoose.connect("mongodb://127.0.0.1:27017/login-signup_Page")
.then(()=>{
    console.log("Mongodb connected")
})
.catch((Error)=>{
    console.log(Error);
})




const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

//generating tokens
LogInSchema.methods.generateAuthToken =async function() {
 try{
    console.log(this._id)
   const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
    this.tokens=this.tokens.concat({token});

    await this.save();
   return token;

 }catch(error){
    res.send("error in making token",error);
    console.log("error in making token",error);
 }
}



//generate hash value
LogInSchema.pre("save",async function(next){
    // it takes to parameters the function name and a function to proceed next  op in  the main program
   
   if(this.isModified('password')){
    console.log(`the current password is ${this.password}`);
    this.password= await bcrypt.hash(this.password,10);
    this.cpassword= await bcrypt.hash(this.cpassword,10);
    console.log(`the current password is ${this.password}`);
   }
   next();
})


const collection=new mongoose.model("logcollection",LogInSchema);

//  data={
//    Name:"Dinesh",
//    password:"idgverrvbcd"
// }
// collection.insertMany([data])
module.exports=collection;
