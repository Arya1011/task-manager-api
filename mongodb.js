//This file will include code to perform CRUD operations(Create,Read,Update,Delete) on our database

const mongodb=require('mongodb');                                              //This returns an Object
const MongoClient=mongodb.MongoClient;                                          //This will basically give us all functions required to connect to the database
const ObjectID=mongodb.ObjectID;

const connectionURL='mongodb://';
const databaseName='task-manager';


const id=new ObjectID();                                                       //Returns an instance of an ObjectID
/*
console.log(id);
console.log(id.getTimestamp());
console.log(id.id);                                                            //Returns buffer data which is binary form(since it takes up half space as compared to characater string)
console.log(id.id.length); 
console.log(id.toHexString().length);                                          //Returns length of string representation of the buffered data 
*/

MongoClient.connect(connectionURL,{useNewUrlParser: true,useUnifiedTopology: true},(error,client)=>{    //read up Docs if required in future
        if(error){
           return console.log('Unable to connect to Database');
        }
        const db=client.db(databaseName);                                    //This gives back a database reference(basically used for getting the connection to a specific db)
        //console.log('Connected Correctly');
        
        /*
        //This code shows how to insert a single document
        db.collection('users').insertOne({                                  //No SQL uses collections in which fileds are inserted(users is the name of the collection)
            _id:id, 
            name:'Aryamaan',
             age:19
        },(error,result)=>{
            if(error){
                return console.log('Unable to insert user');
            }
            console.log(result.ops);                                        //This gives an array of documents(objects) which gives back all the required documents
        })

        */
        
 
       /*
       Inserting Many Documents
       db.collection('users').insertMany([
           {
               name:'Jen',
               age:28
           },
           {
               name:'Arya',
               age:19
           }
       ],(error,result)=>{
           if(error){
               return console.log('Unable to insert documents')
           }
           console.log(result.ops);
       })
       */

       /*
      db.collection('tasks').insertMany([
          {
              string:'Read Books',
              completed:true
          },
          {
              
            string:'Do proj',
            completed:false
          },
          {
              string:'Play Football',
              completed:false
          }
      ],(error,result)=>{
          if(error){
              return console.log('Documents could not be inserted into database');
          }
          console.log(result.ops);
      })
      */

    /*
     //Fetching By Name
     db.collection('users').findOne({name:'Jen'},(error,user)=>{
         if(error){
             return console.log('Unable to fetch');
         }
         console.log(user);
     })

     //Fetching By ID
     db.collection('users').findOne({ _id:new ObjectID("5e8321cab5637d6c746a183d")},(error,user)=>{        //findOne() returns an array of Objects whcih have been stored in the collection
        if(error){
            return console.log('Unable to fetch');
        }
        console.log(user);
    })
    */

/*
    db.collection('users').find({age:19}).toArray((error,users)=>{                        //find returns a cursor(kinda like a pointer).
                  console.log(users);
    })
    
    db.collection('users').find({age:19}).count((error,count)=>{                        //find returns a cursor(kinda like a pointer).
        console.log(count);
})                                                                                 
*/

/*
    db.collection('tasks').findOne({_id:new ObjectID("5e8321cab5637d6c746a183d")},(error,task)=>{
        if(error){
            return console.log('Unable to fetch');
        }
        console.log(task);
    })

    db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
            console.log(tasks)
    })
    
*/

/*
const updatePromise=db.collection('users').updateOne({
    _id: new ObjectID('5e831f2cf3a13872707dd26d')
},{
       $set:{
           name:'Mike'
       },
       $inc:{
            age:12
       }
})

updatePromise.then((result)=>{
       console.log(result);
}).catch((error)=>{
      console.log(error);
})

*/

/*
const updatePromise=db.collection('tasks').updateMany({
    completed: false
},{
    $set:{
        completed:true
    }
})

updatePromise.then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})
*/

db.collection('tasks').deleteOne({
    string:'Read Books'
}).then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})

})