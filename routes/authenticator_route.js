const express=require('express');
const authenticator=express.Router();

authenticator.get('/middleware',(req,res)=>{
    console.log(req.method)
    console.log(req.url)
    res.send('hi')
})
authenticator.use(express.urlencoded({extended:true}));
authenticator.post('/login',(req,res)=>{
    if(req.body.userName=="eman"&&req.body.passWord=="123")
        res.redirect('/admin/profile')
    else if(req.body.userName=="ramy"&&req.body.passWord=="123")
        res.redirect('/speaker/profile')
    else
        res.redirect('/login')
        
})


module.exports=authenticator;