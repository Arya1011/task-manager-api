//This file will contain al the user routes which have been removed from the index.js file
const express=require('express');
const router=new express.Router();
const sharp=require('sharp');
const User=require('../models/user');
const auth=require('../middleware/auth');
const multer=require('multer');
const { sendWelcomeEmail,sendCancellationEmail}=require('../emails/account');  //Using object destructuring



router.post('/users',async(req,res)=>{        //Performing some sort(post) of pre-defined operation on the databse server
    const user=new User(req.body);
    try{
        await user.save(); 
        //Sending welcome mail after validating user
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(e){
         res.status(400).send(e);
    }
    
router.post('/users/login',async(req,res)=>{
     try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.generateAuthToken();   //This function is defined on user instance and not User instance 
        res.send({ user,token});
     }catch(e){
        res.status(400).send();
     }
})

    // user.save().then(()=>{
    //    res.status(201);
    //    res.send(user);
    // }).catch((error)=>{
    //   res.status(400);
    //   res.send(error);
    // })
})

// app.post('/users',(req,res)=>{        //Performing some sort(post) of pre-defined operation on the databse server
//     const user=new User(req.body);

//     user.save().then(()=>{
//        res.status(201);
//        res.send(user);
//     }).catch((error)=>{
//       res.status(400);
//       res.send(error);
//     })
// })

router.get('/users/me',auth,async(req,res)=>{     //This route handler helps us get all users from the database(We are adding more security to this route handler since we dont want to expose data of other users to a user who is logging in)
    res.send(req.user);
    // try{
    //       const users=await User.find({});
    //       res.send(users);
    // }catch(e){
    //     res.status(500).send(e);
    // }

    // User.find({}).then((users)=>{
    //     res.send(users);
    // }).catch((error)=>{
    //     res.status(500).send(error)  //Error means that database connection was lost
    // })
})

// app.get('/users',(req,res)=>{     //This route handler helps us get all users from the database
//     User.find({}).then((users)=>{
//         res.send(users);
//     }).catch((error)=>{
//         res.status(500).send(error)  //Error means that database connection was lost
//     })
// })

const upload=multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('PLZ upload supported file type'))
        }
        cb(undefined,true);
    }
})
//Posting an avatar for  user
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{  //Since we have removed dest from the options object we have access to the data inside the callback function
     const buffer=await sharp(req.file.buffer).resize({ width:250,height:250}).png().toBuffer()
    //req.user.avatar=req.file.buffer       //file is basically an object on which we have certain properties(we are saving data on the avatar field of the user model)
    req.user.avatar=buffer;
    await req.user.save();
    
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

//Deleting an avatar for a user
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})

//For getting an avatar for a user by id
router.get('/users/:id/avatar',async (req,res)=>{
       try{
          const user=await User.findById(req.params.id);

       if(!user || !user.avatar){           //When user does not have an image associated with their account or if there is no user
          throw new Error()
       }
         res.set('Content-Type','image/png')    //Telling user what type of data being returned
         res.send(user.avatar);
       }catch(e){
           res.status(404).send()
       }
})

router.get('/users/:id',async(req,res)=>{
    //console.log(req.params);         //params basically is an object which will contain all the url parameters which we type in the url(in this case we are just giving id as a parameter)
    const _id=req.params.id;
    try{
        const user=await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
         res.status(500).send();
    }
})

router.post('/users/logout',auth,async(req,res)=>{
       try{
           req.user.tokens=req.user.tokens.filter((token)=>{   //We are removing a given item from the tokens array to basically logout the user
               return token.token!==req.token
           })
           await req.user.save();
           res.send();
       }catch(e){
          res.status(500).send();
       }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
           req.user.tokens=[];
           await req.user.save();
           res.send();
    }catch(e){
       res.status(500).send();
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body);    //Returns an array of strings in which each is a property of the object
    const allowedUpdates=['name','email','password','age'];
    const isValidOperation=updates.every((update)=>{
                return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
        return res.status(400).send({
            error:'Invalid Operation'
        })
    }
    try{
        //const user=await User.findById(req.params.id);
        updates.forEach((update)=>{
              req.user[update]=req.body[update];  //updates mei sab alag alag hai name,email,password so we cant use user.name,user.password etc using this syntax we can say that whatever is value in update variable is being acessed on the user instance
      })

      await req.user.save();  //When we call this function we are executing the middleware function
         
      //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})(findByIdAndUpdate() performs direct operations on the database and do  not pass control to the middleware function so we dont use this code)
        
      if(!req.user){   //This code is iseless since we have added auth function we know that user has already logged in and has been authorized
            return res.status(404).send();
        }
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})


router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id);  //We have access to the user._id property because we are usng the auth middleware

        // if(!user){
        //     return res.status(404).send();
        // }
        await req.user.remove(); //this line of code does the same job as the above three lines
        sendCancellationEmail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e){
       res.status(500).send();
    }
})

// router.delete('/users/:id',auth,async(req,res)=>{  //This code is being revised since we were providing id to delete a user which is unsafe
//     try{
//         const user=await User.findByIdAndDelete(req.params.id);

//         if(!user){
//             return res.status(404).send();
//         }
//         res.send(user);
//     }catch(e){
//        res.status(500).send();
//     }
// })

// app.get('/users/:id',(req,res)=>{
//     //console.log(req.params);         //params basically is an object which will contain all the url parameters which we type in the url(in this case we are just giving id as a parameter)
//     const _id=req.params.id;
//     User.findById(_id).then((user)=>{
//         if(!user)
//         {
//             return res.status(404).send();
//         }

//         res.send(user);
        
//     }).catch((e)=>{
//           res.status(500).send();      //Error means that database connection was lost
//     })
// })
module.exports=router;