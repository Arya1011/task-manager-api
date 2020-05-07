const express=require('express');
require('./db/mongoose');              //Loads in the mongoose file and ensures we connect to the database
const User=require('./models/user');  //Here we are getting back the User model that we created so that we can use it for creating entries in the database
const Task=require('./models/task');
const userRouter=require('./routers/user');
const taskRouter=require('./routers/task');
const app=express();

const port=process.env.PORT;

//Example of file upload to express

const multer=require('multer');
const upload=multer({     //This helps create a single instance of multer object
    dest: 'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){   //Will be called internally by multer
        //In this if statement we are using the regular expression to write conditional logic
        if(!file.originalname.match(/\.(doc|docx)$/)){      //In case the uploaded file is not a word doc
            return cb(new Error('Pls Upload a word document'))
       }

        // if(!file.originalname.endsWith('.pdf')){      //In case thr uploaded file is not a pdf
        //      return cb(new Error('Pls Upload a PDF'))
        // }

        cb(undefined,true);
        
        //  cb(new Error('File must be a PDF'));   //The are three ways in which we can use the callback function
        //  cb(undefined,true);
        //  cb(undefined,false)

    }
})

const errorMiddleware=(req,res,next)=>{
    throw new Error('From middlware');
}

app.post('/upload',upload.single('upload'),(req,res)=>{   //Here we are basically telling multer to look for  file called upload when a post reuqest comes in
    res.send()
},(error,req,res,next)=>{   //These set of arguments will tell express that this function needs to run whenever multer wil throw an error
    //console.log(error);
     res.status(400).send({error:error.message});    //Woh message basically ek property hai
})


// app.post('/upload',upload.single('upload'),(req,res)=>{   //Here we are basically telling multer to look for  file called upload when a post reuqest comes in
//      res.send()
// })

// app.use((req,res,next)=>{       //  With middleware: new request->do something->run route handler this function serves as the middleare function
// //    console.log(req.method,req.path);
// //    next();
// if(req.method==='GET'){
//      res.send('GET request not allowed');
// }else{
//     next();
// }
// })

// app.use((req,res,next)=>{         //Since this is a middleware if we dont use next() we will never be able to use the routehandlers listed below
//       res.status(503).send('Site under maintainence');
// })

app.use(express.json());               //app.use() is always used to customize a server

app.use(userRouter);

app.use(taskRouter);

//We will Use async-await for all route handlers 




app.listen(port,()=>{
    console.log('Server is up on port '+port);
})

/*

//const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');     //Used for authentication of our users in task app

const myFunction=async()=>{

  
const token=jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn: '7 days'});   //First argument is the properties we want to embed into the jsontoken and the second one is a secret key
console.log(token);

const data=jwt.verify(token,'thisismynewcourse');
console.log(data);

    //    const password='arya12345';
//    const hashedPassword=await bcrypt.hash(password,8);        //hash() metod returns a promise so we are using await
//    //console.log(password);
//    //console.log(hashedPassword);

//    const isMatch=await bcrypt.compare(password,hashedPassword);
//    //console.log(isMatch);
}

myFunction();

*/

// const pet={
//     name:'Bro'
// }

// pet.toJSON=function(){  //toJSON basically returns a JSON object which we can manpulate according to our needs
//     return {}
// }

// console.log(JSON.stringify(pet));

// // const Task=require('./models/task');

/*
const main=async()=>{
//    const task=await Task.findById('5e9da1203bc0904ee095213b');
//    await task.populate('owner').execPopulate();   //This line finds the task which is assocuated with the id and it will populate its owner field with all the properties of the ref it uses ie.,User model(earlier we were only getting an id back)
//    console.log(task.owner);

  const user=await User.findById('5e9d9fec98dd96521c646f0d');
  await user.populate('tasks').execPopulate();  //Tasks are not stored as a field for the users instead it is just a virtual
  console.log(user.tasks);

}


main();
*/