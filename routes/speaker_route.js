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
    // response.sendFile(path.join(__dirname, '../', 'views/add.html'));
    response.render('speakers/register.ejs')
})
speaker.post('/add',(request,response)=>{
    let newSpeaker=new mongoose.model('speaker')(
        request.body
    )
    newSpeaker.save().then((data)=>{
        response.send("saved")
    }).catch((error)=>{
        response.send(error+"")
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
    mongoose.model('speaker').updateOne({_id:request.body._id},{ $set: {name:request.body.name} },function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        // db.close();
      })
})
speaker.get('/delete',(request,response)=>{
    mongoose.model('speaker').find({},{_id:1,UserName:1}).then((speakers)=>{
        response.render('speakers/delete.ejs',{speakers})
    }).catch((error)=>{
        response.send(""+error)
    })
})

speaker.post('/delete',(request,response)=>{
    mongoose.model('speaker').deleteOne({ _id: request.body._id }, function(err, obj) {
        if (err) throw err;
        response.send('deleted')
      })
})
module.exports=speaker