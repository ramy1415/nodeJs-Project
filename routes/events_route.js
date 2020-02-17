const express=require('express');
const events_route=express.Router();
let mongoose=require('mongoose')
let path=require('path');
require('../model/eventsModel')
let events=mongoose.model('events');
events_route.use(express.static('.'))
events_route.use(express.urlencoded({extended:true}))



events_route.get('/add',(request,response)=>{
    // response.sendFile(path.join(__dirname, '../', 'views/addevent.html'))
    response.render('addevent.ejs')
})

events_route.get('/list',(request,response)=>{
    events.find({}).populate('mainSpeaker','UserName').populate('otherSpeakers','UserName').exec((error,data)=>{
        if (error) return handleError(error);
        response.send(data);
    })
})

events_route.post('/add',(request,response)=>{
    let newEvent=new mongoose.model('events')(request.body)
    newEvent.save().then((data)=>{
        console.log("saved")
    }).catch((error)=>{
        console.log(""+error)
    });
})
module.exports=events_route;