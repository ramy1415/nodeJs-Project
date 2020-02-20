const express=require('express');
const authenticator=express.Router();
const path=require('path')
const mongoose=require('mongoose')
require('../model/speakerModel')
let speakers = mongoose.model('speaker');



authenticator.get('/login',(request,response)=>{
    response.render('speakers/login.ejs')
});
authenticator.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/login')
})
authenticator.get('/register',(request,response)=>{
    response.render('speakers/register.ejs')
})
authenticator.post('/register',(request,response)=>{
    let newSpeaker=new mongoose.model('speaker')(
        request.body
    )
    newSpeaker.save().then((data)=>{
        response.redirect('/login')
    }).catch((error)=>{
        response.send(error+"")
    })
})

authenticator.post('/login',(request,response,next)=>{
    if(request.body.UserName=="eman"&&request.body.Password=="123"){
        request.session.role="admin"
        request.session.UserName=request.body.UserName
        response.redirect('/admin/profile')
        return;
    }
    speakers.findOne({UserName:request.body.UserName,Password:request.body.Password}).then((speaker)=>{
        if(speaker){
            request.session.role="speaker"
            request.session.UserName=request.body.UserName
            response.redirect('/user/profile')
        }
        else
            response.redirect('/login')
    }).catch((error)=>{
        console.log(error+"")
    })
})

module.exports=authenticator;