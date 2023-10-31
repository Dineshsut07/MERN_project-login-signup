require("dotenv").config();

const express=require("express");
const app=express();
const path=require("path");
const templatePath=path.join(__dirname,"../templates/views")
const partialsPath=path.join(__dirname,"../templates/partials")
const port =process.env.PORT || 3000
const hbs=require("hbs")
const bcrypt=require("bcryptjs");
const collection1=require("./mongodb");


app.use(express.json());

hbs.registerPartials(partialsPath);

app.set("view engine","hbs");
app.set("views",templatePath);

app.use(express.urlencoded({extended:true}))


console.log(process.env.SECRET_KEY);

app.get("/", async(req,res) =>{
   res.render("home")
   
})
app.get("/signup", async(req,res) =>{
   res.render("signup")
   
})
app.get("/login", async(req,res) =>{
   res.render("login")
   
})

app.post("/signup",async(req,res)=>{
  try{
      
   password=req.body.password;
   cpassword=req.body.cpassword;

   if(password === cpassword){
    const  data= new collection1({
      name:req.body.name,
      email:req.body.email,
      
      password:req.body.password,
      cpassword:req.body.cpassword,

   } )
//we use the middleware here
//ist to generate tokens and 2nd bcrypt the data
   const token =await data.generateAuthToken();
   console.log(token);
   
   await data.save();
   await console.log(data);
   res.render("home")

   }else{
      res.send("password doesnot match");
   }

  }
  catch(e){
   console.log("error bla blaa ",e)
  }

})
app.post("/login",async(req,res)=>{
  try{
    const check=await collection1.findOne({email:req.body.email})
    const passwordmatch= await bcrypt.compare(req.body.password,check.password);
    
    const token =await  check.generateAuthToken();
    console.log(token);
    
    
    
    if(passwordmatch){
       res.render("home")
    }
    else{
      res.send("wrong password");
    }
  
  }
  catch(e){
   res.send("Wrong details")
  }

})

// how to use bcrypt 

// const bcrypt=require("bcryptjs");

// const securepassword =async(password)=>{

//    const passwordhash= await bcrypt.hash(password,10);
//    console.log(passwordhash);

//    const passwordmatch= await bcrypt.compare("dinesh12",passwordhash);
//    console.log(passwordmatch);

// }

// securepassword("dinesh123");

//what is json web tokens :
//it is used to make authentication of users so user can be loged in system for long time

// const jwt=require("jsonwebtoken");

// const createToken = async() => {
//   const token =await  jwt.sign({_id:"653fdf21acca2e0f5fa41604"},"mynameisthedineshiamanenginneringstuidnetthank",{expiresIn:"2 seconds"});
//    console.log(token); 
//    const userver=await jwt.verify(token,"mynameisthedineshiamanenginneringstuidnetthank");
//    console.log(userver);
// };

// createToken();











app.listen(port,() =>{
   console.log("connnected to ",port);
})