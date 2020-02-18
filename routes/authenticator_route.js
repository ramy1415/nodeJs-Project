const express=require('express');
const authenticator=express.Router();
const path=require('path')
const mongoose=require('mongoose')
require('../model/speakerModel')
let speakers = mongoose.model('speaker');
// authenticator.use(express.static('.'))


authenticator.get('/middleware',(req,res)=>{
    console.log(req.method)
    console.log(req.url)
})
authenticator.use(express.urlencoded({extended:true}));

authenticator.get('/login',(request,response)=>{

    response.render('speakers/login.ejs')
});

authenticator.get('/register',(request,response)=>{
    response.render('register.ejs')
})

authenticator.post('/login',(req,response)=>{

    
    if(req.body.UserName=="eman"&&req.body.Password=="123"){
        response.redirect('/admin/profile')
        return;
    }
    speakers.findOne({UserName:req.body.UserName,Password:req.body.Password}).then((speaker)=>{
        if(speaker)
            response.redirect('/speaker/profile')
        else
            response.redirect('/login')
    }).catch((error)=>{
        console.log(error+"")
    })
})

module.exports=authenticator;