//This file defines the User model of the database
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('./task');

const userSchema=new mongoose.Schema({         //We could have just passed the entire object as a argument into model () but herewe are creating schema first and then passing it into the function       
    name:{
        type: String,            
        required:true,                          
        trim:true
    },
    email:{
       type:String,
       required:true,
       unique:true,
       trim:true,
       lowercase:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error('Email is invalid');
           }
       }
    },
    password:{
         type:String,
         required:true,
         trim:true,
         minlength:6,
         validate(value){
             if(validator.contains(value,'password')){
                  throw new Error('Please choose another password');
             }
         }
    },
    age:{
         type: Number,
         default:0,
         validate(value){
             if(value<0){
                 throw new Error('Age must be a positive number');
             }
         }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{              //This is used to establish relationship bwn user and his image we will 
         type:Buffer      //Helps store biary data of image alongside user in the databse since on deployment platforms we need to store files on their servers
    }
},{
    timestamps:true
})

//Setting up a virtual property(This is just a relationship bwn two diff entities)

userSchema.virtual('tasks',{   //THis is not stoed in the db as a property on the owner model
    ref:"Task",
    localField:"_id",
    foreignField:"owner"    //The property on the other entity which we use to establish a relationship
})

userSchema.methods.generateAuthToken=async function(){
    const user=this;
    const token=jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET);  //We need tom convert the object string into a standard string
    
    user.tokens=user.tokens.concat({ token });
    await user.save();                         //token is being saved to the database

    return token;


}

userSchema.methods.toJSON=function(){   //This function is determining what info we are sending back when  user logs in just for better security
    const user=this;
    const userObject=user.toObject();  //Returns object with each property name and value as entity of colllection
    
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;     //So that the profile response is small to make our response faster
    return userObject
}

userSchema.statics.findByCredentials=async(email,password)=>{     //Basically we are creating a fucntion which can be used by every User Schema
      const user=await User.findOne({email:email});

      if(!user){
          throw new Error('Unable to login');
      }

      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
          throw new Error('Unable to login');
      }
      return user;
} 

//Middleware functions being used

//Hash the plain text pwd before saving
userSchema.pre('save',async function(next){                        //Some function being performed on the User Schema before we save it to the database
      const user=this;                                             //This gives access to the user being saved
    
    //   console.log('Before Saving'); 

    if(user.isModified('password')){                             //We need to hash the password only if it has been modified by the user(if new user is added or if we change the password of an existing user)
          user.password=await bcrypt.hash(user.password,8);      //Using hashed value to override the plain text pwd
    }

       next();


})

//Delete user tasks if user is removed(this middleware function will be used in delete task router)

userSchema.pre('remove',async function(next){
    const user=this;
   //We will delete multiple tasks using the owner field
   await Task.deleteMany({ owner: user._id});
    next();
})

const User=mongoose.model('User',userSchema);

/*
const me=new User({                              //Creating an instance of the model
    name:'Aryamaan',
    age:19,
    email:'aryamaan1011@gmail.com',
    password:'dlxyzaryy'
})

me.save().then(()=>{
    console.log(me);
}).catch((error)=>{
    console.log('Error!',error);
})
*/


module.exports=User;