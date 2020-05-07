const express=require('express');
const router=new express.Router();
const auth=require('../middleware/auth');   //This will help us ensure that each task we create has an owner
const Task=require('../models/task');


router.post('/tasks',auth,async(req,res)=>{
    //const task=new Task(req.body);
    const task=new Task({
        ...req.body,    //This is spread operator which wil copy all the properties from the req.body object into this object
        owner: req.user._id  //The person we have authenticated(this helps us create an association bwm the owner and the task)
    })
     try{
         await task.save();
        res.status(201).send(task);
     }catch(e){
        res.status(400).send(e);
     }
})

// app.post('/tasks',(req,res)=>{
//     const task=new Task(req.body);

//     task.save().then(()=>{
//         res.status(201);
//         res.send(task);
//     }).catch((e)=>{
//         res.status(500).send(e);
//     })
// })

//GET/tasks?completed=true
//GET/tasks?limit=10 skip(this would return only 10 results when we load a page)
router.get('/tasks',auth,async(req,res)=>{
    
    const match={}  //We are creating an object which  will be given a completed property on the basis of the URL string
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==='true' //req.query.complted will not be a boolean but will be a string value
       
    
    }

    if(req.query.sortBy){
            const parts=req.query.sortBy.split(':');
            sort[parts[0]]= part[1]==='desc'?-1:1   //The name of the sorting criteria is given by the user so we need to fetch it from the URL
    }
     try{
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit),  //since a number proived in URL will be a string and not an integer
                skip:parseInt(req.query.skip),
                 sort
                //  :{
                // //     //createdAt: -1      //These are all in built names which are used by mongoose(-1 means descending order 1 means ascending order)
                // //     //completed:-1
                // // }
            }
        }).execPopulate()
       //const tasks=await Task.findOne({owner:req.user._id});
       res.send(req.user.tasks);
     }catch(e){
        res.status(500).send(e);
     }
    
})

// app.get('/tasks',(req,res)=>{
//     Task.find({}).then((tasks)=>{
//         res.send(tasks);
//     }).catch((e)=>{
//         res.status(500).send();
//     })
// })

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id;
    
    try{
        //const task=await Task.findById(_id);
        const task=await Task.findOne({ _id:_id,owner:req.user._id})  //Only fetching tasks if we are logged in and those tasks which we have created(we are using both task id and user id to ensure that there is more security to establish relation bwn user and task)
          if(!task){
              return res.status(404).send();
          }
          res.send(task);
    }catch(e){
       res.status(500).send();
    }
    
})

router.patch('/tasks/:id',auth,async(req,res)=>{
      const updates=Object.keys(req.body);
      const allowedUpdates=['description','completed'];
      const isValidOperation=updates.every((update)=>{
           return allowedUpdates.includes(update);
      })

      
    if(!isValidOperation){
        return res.status(400).send({
            error:'Invalid Operation'
        })
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id});
        //const task=await Task.findById(req.params.id);
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=>{
            task[update]=req.body[update];  //updates mei sab alag alag hai name,email,password so we cant use user.name,user.password etc using this syntax we can say that whatever is value in update variable is being acessed on the user instance
    })

    await task.save();  //When we call this function we are executing the middleware function
        res.send(task);
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        //const task=await Task.findByIdAndDelete(req.params.id);
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});

        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
       res.status(500).send();
    }
})


// app.get('/tasks/:id',(req,res)=>{
//     const _id=req.params.id;
//     Task.findById(_id).then((task)=>{
//         if(!task){
//             return res.status(404).send();
//         }
//         res.send(task);
//     }).catch((e)=>{
//         res.status(500).send();
//     })
// })

module.exports=router;