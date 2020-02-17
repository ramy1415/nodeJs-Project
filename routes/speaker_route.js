const express=require('express');
const speaker=express.Router();
speaker.use(express.static('.'))
require('../model/speakerModel')
let mongoose=require('mongoose');
const path=require('path')
speaker.use(express.urlencoded({extended:true}));


speaker.get('/profile',(request,response)=>{

    response.send("profile")
})
speaker.get('/add',(request,response)=>{
    response.sendFile(path.join(__dirname, '../', 'add.html'));
})
speaker.post('/add',(request,response)=>{
    let newSpeaker=new mongoose.model('speaker')(
        {_id:request.body.id,
            name:request.body.name}
    )
    newSpeaker.save().then((data)=>{
        console.log("saved")
    }).catch((error)=>{
        console.log("error")
    })
})
speaker.get('/list',(request,response)=>{
    mongoose.model('speaker').find({}).then((data)=>{
        response.send(data)
    }).catch((error)=>{
        response.send(""+error)
    })
})
speaker.post('/edit',(request,response)=>{
    mongoose.model('speaker').updateOne({name:request.body.name},{ $set: {name:request.body.name2} },function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        // db.close();
      })
})
speaker.post('/delete',(request,response)=>{
    mongoose.model('speaker').deleteOne({ name: request.body.name }, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
      })
})
module.exports=speaker