const express=require('express');
const users=express.Router();
const mongoose=require('mongoose')
require('../model/speakerModel')
users.use((request,response,next)=>{
    if(request.session.role=="admin")
        response.redirect('/admin/profile')
    else
        next()
})

users.use((request,response,next)=>{
    response.locals.UserName=request.session.UserName
    response.locals.UserId=request.session.UserId
    next()
})

users.get('/profile',(req,res)=>{
    res.render("users/profilespeaker.ejs")
})



users.get('/edit',(req,res)=>{
    console.log(req.session._id)
    mongoose.model('speaker').findOne({_id:req.session.UserId}).then((data)=>{
        res.render('users/editprofile.ejs',{data})
    }).catch((error)=>{
        console.log(error)
    })  
})


users.post('/edit',(request,response)=>{
    console.log("editt = "+request.body.id)
    mongoose.model('speaker').updateOne({_id:request.session.UserId},{ $set: {
        FullName:request.body.FullName,
        UserName:request.body.UserName,
        Password:request.body.Password,
        Address:{
            city:request.body.city,
            street:request.body.street,
            building:request.body.building
        }
    } }).then((success)=>{
        response.redirect('/user/profile')
    }).catch((error)=>{
        response.send("edit failed")
    })
})


module.exports=users