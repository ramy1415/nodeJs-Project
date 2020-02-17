const express =require('express');
const server=express();
const authenticator=require('../routes/authenticator_route');
const path=require('path')
server.use(express.static('.'))
server.listen(8082);


server.use(authenticator)

server.get('/login',(request,response)=>{
    response.sendFile(path.join(__dirname, '../', 'login.html'));
});