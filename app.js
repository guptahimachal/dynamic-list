const express = require('express')
const app = express()
const _ = require('lodash');
app.set('view engine', 'ejs');
const {getDate,getDay} = require('./date.js')
// For Post
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))


// Setting up mongoogse for DB integration
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});

// Creating the schema for list items
const itemSchema = new mongoose.Schema({
    name: String,
});
// Creating the model(collection) for list items
const Item = mongoose.model('item', itemSchema);


// Creating the schema for storing custom list
const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema],
});
// Ctrating the model(collection) for storing custom lists
const List = mongoose.model('list', listSchema);


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
                res.render('list',{listTitle : "Today", newListItemsH : items})
        }
    });
})

app.post('/',(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;
    let item = new Item({name:itemName});

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},(err,list)=>{
            if(!err)
                if(list){
                    list.items.push(item);
                    list.save();
                    res.redirect("/"+listName);
                }
        });
    }
});

app.post('/delete',(req,res)=>{
    // itemToBeDeleted is array containing _id of the items selected in checkbox
    let itemToBeDeleted = req.body.itemID;
    const listName = req.body.list;

    if(listName === 'Today'){
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
    }
    else{
        List.findOneAndUpdate(
            {  name: listName },
            { $pull:
                {
                    items: 
                    { 
                        _id:
                        {
                            $in:itemToBeDeleted
                        }
                    }
                } 
            },
            (err,result)=>{
                if(!err)
                    res.redirect("/"+listName);
                else
                    console.log(err)
            }
        )
    }
});      

app.get('/:listName',(req,res)=>{
    const listName = _.capitalize(req.params.listName);
    
    List.findOne({name:listName},(err,list)=>{
        if(!err)
            if(list){
                let items = list.items;
                res.render('list',{listTitle : listName,  newListItemsH : items})
            }
            else{
                const newList = new List({name : listName, items : defaultItems});
                newList.save();
                res.redirect("/"+listName);
            }
    });
})

app.listen(5000,()=>{
    console.log("Listening at Port 5000")
})