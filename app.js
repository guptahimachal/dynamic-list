const express = require('express')
const app = express()

// For Post
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    console.log("Request received from client")
    
    var today = new Date();
    if(today.getDay() === 6 || today.getDay === 7 )
    
    
    
    res.send("Home Page")
})

app.listen(5000,()=>{
    console.log("Listening at Port 5000")
})