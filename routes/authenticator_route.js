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
    response.render('speakers/login.ejs',{notfound: request.flash('user'),wrongpassword:request.flash('password')})
});
authenticator.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/login')
})
authenticator.get('/register',(request,response)=>{
    request.flash("error","")
    response.render('speakers/register.ejs',{error:request.flash("error")})
})
authenticator.post('/register',(request,response)=>{
    upload(request,response,(err)=>{
        if(err){
            console.log("error"+err)
        }else{
            bcrypt.hash(request.body.Password, 10, function(err, hash) {
                if(request.body.Password!="")
                    request.body.Password= hash
                let newSpeaker=new mongoose.model('speaker')(
                    request.body
                )
                if(request.file){
                    newSpeaker.Avatar=request.file.filename
                }else{
                    newSpeaker.Avatar="avatar-anon.jpg"
                }
                
                newSpeaker.save().then((data)=>{
                    if(request.session.role=="admin")
                        response.redirect('/admin/speaker/list')
                    else
                        response.redirect('/login')
                }).catch((error)=>{
                    request.flash("error",error)
                    response.render('speakers/register.ejs',{error:request.flash("error")})
                })
            });
        }
        
    })        
})

authenticator.post('/login',(request,response,next)=>{
    console.log(request.body.Password)
    if(request.body.UserName=="eman"&&request.body.Password=="123"){
        request.session.role="admin"
        request.session.UserName=request.body.UserName
        response.redirect('/admin/profile')
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
            request.flash('password', 'Wrong Password')
            request.flash("user","")
            response.render('speakers/login.ejs',{ wrongpassword: request.flash('password'),notfound: request.flash('user') })
        });
    }).catch((error)=>{
        console.log("login->"+error)
        request.flash('password', '')
        request.flash("user",request.body.UserName+" not found")
        response.render('speakers/login.ejs',{ wrongpassword: request.flash('password'),notfound: request.flash('user') })
    })
})
module.exports=authenticator;