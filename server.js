const express =require('express');
const server=express();
const authenticator=require('./routes/authenticator_route');
const speaker_route=require('./routes/speaker_route');


let mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/eventsdb").then((data)=>{
    console.log("connected")
}).catch((error)=>{
    console.log("not connected")
})

server.listen(8082);
server.use(authenticator)
server.use('/speaker',speaker_route)

