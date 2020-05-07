//We will define authentication middleware here to use it in different route handlers to provide authentication for different routes

const jwt=require('jsonwebtoken');
const User=require('../models/user');

const auth=async(req,res,next)=>{
    // console.log('auth middleware');
    // next();
    try{
       const token=req.header('Authorization').replace('Bearer ','');           //header returns the entire string token we are just removing the Bearer from it
       const decoded=jwt.verify(token,process.env.JWT_SECRET);                     //Validating the token provided by the user
       const user=await User.findOne({ _id:decoded._id,'tokens.token':token});  //Find the user in the database
       if(!user){
           throw new Error();
       }
       
       req.user=user;
       req.token=token; //route handlers will get access to the token
       next();
       console.log(token);
       console.log(req.user);
       
    }catch(e){
        res.status(401).send({error:'Please authenticate'});
    }
}

module.exports=auth;