const express=require('express');
const authenticator=express.Router();
const path=require('path')
authenticator.use(express.static('.'))


authenticator.get('/middleware',(req,res)=>{
    console.log(req.method)
    console.log(req.url)
})
authenticator.use(express.urlencoded({extended:true}));

authenticator.get('/login',(request,response)=>{
    response.sendFile(path.join(__dirname, '../', 'login.html'));
});

authenticator.post('/login',(req,res)=>{
    if(req.body.userName=="eman"&&req.body.userPass=="123")
        res.redirect('/admin/profile')
    else if(req.body.userName=="ramy"&&req.body.userPass=="123")
        res.redirect('/speaker/profile')
    else
        res.redirect('/login')
})

module.exports=authenticator;