const mongoose=require('mongoose')

mongoose.connect(process.env.connectionString).then(res=>{
    console.log("mongodb connected...");
    
})
.catch(err=>{
    console.log("mongodb connection faild",err);
    
})