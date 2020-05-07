//This file defines the task model of the database
const mongoose=require('mongoose');
const validator=require('validator');

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
        
    },

    completed:{
        type:Boolean,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,  //The type is objectID
        required:true,
        ref:'User'   //cReates a refrence from this field to the model
    }
},{
    timestamps:true
})

/*
const Task=mongoose.model('Task',{
    description:{
        type:String,
        required:true,
        trim:true
        
    },

    completed:{
        type:Boolean,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,  //The type is objectID
        required:true,
        ref:'User'   //cReates a refrence from this field to the model
    }
});
*/

const Task=mongoose.model('Task',taskSchema);

module.exports=Task;