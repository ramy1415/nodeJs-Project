const express=require('express');
const users=express.Router();


users.use((request,response,next)=>{
    response.locals.UserName=request.session.UserName
    next()
})

users.get('/profile',(req,res)=>{
    res.render("users/profilespeaker.ejs")
})


module.exports=users