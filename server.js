const express =require('express');
const server=express();
const authenticator=require('./routes/authenticator_route');
const speaker_route=require('./routes/speaker_route');
const events_route=require('./routes/events_route');
server.set('view-engine','ejs')
let path = require('path');
let mongoose=require('mongoose');

server.use(express.static(path.join(__dirname,'/public')))

mongoose.connect("mongodb://localhost:27017/eventsdb",{useNewUrlParser: true,useUnifiedTopology: true}).then((data)=>{
    console.log("connected")
    console.log(path.join(__dirname,'/public'))
}).catch((error)=>{
    console.log("not connected")
})
server.listen(8082);

server.get('',(request,response)=>{
    // response.sendFile(path.join(__dirname, '../', 'views/addevent.html'))
    response.render('login.ejs')
})

server.use(authenticator)
server.use('/speaker',speaker_route)
server.use('/event',events_route)

