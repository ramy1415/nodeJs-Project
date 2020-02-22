const express=require('express');
const authenticator=express.Router();
const path=require('path')
const mongoose=require('mongoose')
require('../model/speakerModel')
let speakers = mongoose.model('speaker');
const bcrypt = require('bcrypt');
const multer=require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.body.UserName+path.extname(file.originalname))
    }
  })
   
  var upload = multer({ storage: storage }).single('avatar')


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
    // console.log(request.body.avatar)
    upload(request,response,(err)=>{
        if(err){
            console.log("error"+err)
        }else{
            bcrypt.hash(request.body.Password, 10, function(err, hash) {
                request.body.Password= hash
                let newSpeaker=new mongoose.model('speaker')(
                    request.body
                )
                if(request.file)
                    newSpeaker.Avatar=request.file.filename
                console.log(newSpeaker)
                newSpeaker.save().then((data)=>{
                    response.redirect('/login')
                }).catch((error)=>{
                    response.send(error+"")
                })
            });
        }
        
    })
    var newPass;
        
})

authenticator.post('/login',(request,response,next)=>{
    if(request.body.UserName=="eman"&&request.body.Password=="123"){
        request.session.role="admin"
        request.session.UserName=request.body.UserName
        console.log('hi eman')
        response.redirect('/admin/profile')
        request.flash("hi eman")
        return;
    }
    
    speakers.findOne({UserName:request.body.UserName}).then((speaker)=>{
        
        bcrypt.compare(request.body.Password, speaker.Password).then(function(result) {
            if(result){
                request.session.role="speaker"
                request.session.UserName=request.body.UserName
                request.session.UserId=speaker._id
                response.redirect('/user/profile')
            }
            else
                response.redirect('/login')
        });
        
        
    }).catch((error)=>{
        console.log(error+"")
    })
})

module.exports=authenticator;