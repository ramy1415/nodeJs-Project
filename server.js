const express =require('express');
const server=express();
const authenticator=require('./routes/authenticator_route');
const speaker_route=require('./routes/speaker_route');
const events_route=require('./routes/events_route');
const users_route=require('./routes/users_route');
const session=require('express-session')


server.use(express.json())
server.use(express.urlencoded({ extended: true }))


server.set('view-engine','ejs')
server.use(session({
    secret:"ramy"
}))
let path = require('path');
let mongoose=require('mongoose');
server.use(express.static(path.join(__dirname,'/public')))
server.use(express.static(path.join(__dirname,'node_modules/jquery/dist')))
server.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist')))


mongoose.connect("mongodb://localhost:27017/eventsdb",{useNewUrlParser: true,useUnifiedTopology: true}).then((data)=>{
    console.log("connected")
}).catch((error)=>{
    console.log("not connected")
})
server.listen(8082);

server.get('',(request,response,next)=>{
    response.render('speakers/login.ejs')
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

