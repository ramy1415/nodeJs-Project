const express =require('express');
const server=express();
const io = require('socket.io')(5005);
const authenticator=require('./routes/authenticator_route');
const speaker_route=require('./routes/speaker_route');
const events_route=require('./routes/events_route');
const users_route=require('./routes/users_route');
const session=require('express-session')
const flash = require('connect-flash');
const path = require('path');
const mongoose=require('mongoose');
server.listen(8082);
console.log("listening on port 8082")
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.set('view-engine','ejs')
server.use(session({
    secret:"ramy",
    resave:false,
    saveUninitialized :true

}))
server.use(flash());
server.use(express.static(path.join(__dirname,'/public')))
server.use(express.static(path.join(__dirname,'node_modules/jquery/dist')))
server.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist')))

io.on('connection',(socket)=>{
    socket.on('chat-message',(message)=>{
        socket.broadcast.emit('chat-others',message)
    })
})
mongoose.connect("mongodb://localhost:27017/eventsdb",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true}).then((data)=>{ //should be in a separate file
    console.log("connected to mongoDB")
}).catch((error)=>{
    console.log("not connected to mongoDB")
})


server.get('',(request,response,next)=>{
    response.redirect('/login')
})

server.use(authenticator)
server.use((request,response,next)=>{
    if(request.session.role)
        next()
    else
        response.redirect('/login')
})


server.use('/user',users_route)
server.use((request,response,next)=>{
    if(request.session.role=="admin")
        next()
    else if(request.session.role=="speaker")
        response.redirect('/user/profile')
    else
        response.redirect('/login')
})



server.use('/admin',speaker_route)
server.use('/admin/event',events_route)

