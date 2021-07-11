const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const {getDate,getDay} = require('./date.js')
// For Post
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))


// Setting up mongoogse for DB integration
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Creating the schema for list items
const itemSchema = new mongoose.Schema({
    name: String,
});

// Creating the model(collection) for list items
const Item = mongoose.model('item', itemSchema);

// newListItems contains the default items to be displayed in the list
let newListItems = ["Buy food","Cook food","Eat food"];
let defaultItems = []
newListItems.forEach(function(item){
    let newItem = new Item({name:item});
    defaultItems.push(newItem);
});

let workItems = []

app.get('/',(req,res)=>{
    console.log("Request received from client")
    let day = getDate()

    Item.find({},(err,items)=>{ 
        if(err)
            console.log(err);
        else{
            if(items.length === 0){
                // If the list is empty, then add the default items
                Item.insertMany(defaultItems,(err)=>{
                    if(err)
                        console.log(err);
                })
                console.log("Loading first time");
                res.redirect("/");
            }
            else // If the list is not empty, then display the items
                res.render('list',{listTitle : day, newListItemsH : items})
        }
    });
})

app.post('/',(req,res)=>{
    const itemName = req.body.newItem;
    let item = new Item({name:itemName});
    item.save();
    res.redirect("/");

    // if(req.body.list === 'Work List'){
    //     workItems.push(item)
    //     res.redirect('/work')
    // }
    // else{
    //     newListItems.push(item)
    //     res.redirect('/')
    // }
})

app.post('/delete',(req,res)=>{
    // itemToBeDeleted is array containing _id of the items selected in checkbox
    let itemToBeDeleted = req.body.itemID;
    Item.deleteMany({ _id: {
            $in : itemToBeDeleted
        }
    }, (err,result)=>{
        if(err)
            console.log(err)
        else
            console.log(result.deletedCount,"items deleted")
    });
    res.redirect('/');
});

app.get('/work',(req,res)=>{
    res.render("list",{listTitle: "Work List",newListItemsH : workItems})
})

app.listen(5000,()=>{
    console.log("Listening at Port 5000")
})