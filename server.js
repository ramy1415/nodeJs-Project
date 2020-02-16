const express =require('express');
const server=express();
const authenticator=require('./routes/authenticator_route');


server.listen(8082);

server.use(authenticator)

server.get('/home',(request,response)=>{
    response.send('hi you are in home')
});