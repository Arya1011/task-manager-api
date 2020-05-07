//This file basically connects to the dataase we have created and we export this file in other files to help them connect to the database

const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex:true,
})

//Both Task and User will get stored as tasks and users collection inside the task-manager-api database(implicitly done by mongoose)







/*
const task=new Task({
    description:'Planting seeds',
    completed:true
});

task.save().then(()=>{
    console.log(task);
}).catch((error)=>{
    console.log('Error',error);
})
*/
