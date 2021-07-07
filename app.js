const express = require('express')
const app = express()
app.set('view engine', 'ejs');

// For Post
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

let newListItems = ["Buy food","Cook food","Eat food"];
let workItems = []

app.get('/',(req,res)=>{
    console.log("Request received from client")
    
    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }
    // var day = today.toLocaleDateString("hi-u-ca-indian",options)
    let day = today.toLocaleDateString("en-BZ",options)
    
    res.render('list',{listTitle : day, newListItemsH : newListItems})
})

app.post('/',(req,res)=>{
    let item = req.body.newItem
    if(req.body.list === 'Work List'){
        workItems.push(item)
        res.redirect('/work')
    }
    else{
        newListItems.push(item)
        res.redirect('/')
    }
})

app.get('/work',(req,res)=>{
    res.render("list",{listTitle: "Work List",newListItemsH : workItems})
})

app.post('/work',(req,res)=>{
    workItems.push(req.body.newItem)
    res.redirect('/work')
})

app.listen(5000,()=>{
    console.log("Listening at Port 5000")
})