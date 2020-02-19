const express=require('express');
const speaker=express.Router();
speaker.use(express.static('.'))
require('../model/speakerModel')
let mongoose=require('mongoose');
const path=require('path')


speaker.use((request,response,next)=>{
    response.locals.UserName=request.session.UserName
    next()
})

speaker.get('/profile',(request,response)=>{
    response.render('speakers/profile.ejs')
})


speaker.use((request,response,next)=>{
    if(request.session.role=="admin")
        next()
    else
        response.redirect('profile')
})
speaker.get('/add',(request,response,next)=>{
    response.render('speakers/add.ejs')
})
speaker.post('/add',(request,response)=>{
    let newSpeaker=new mongoose.model('speaker')(
        request.body
    )
    newSpeaker.save().then((data)=>{
        response.redirect('/speaker/list')
    }).catch((error)=>{
        response.send(error+"")
    })
})
speaker.get('/list',(request,response)=>{
    mongoose.model('speaker').find({}).then((speakers_details)=>{
        response.render('speakers/list.ejs',{speakers_details})
    }).catch((error)=>{
        response.send(""+error)
    })
})

speaker.get('/editthis/:_id',(request,response)=>{
    let id=request.params._id
    mongoose.model('speaker').findOne({ _id: id }).then((data)=>{
        response.render('speakers/editthis.ejs',{data})
    })
})

speaker.post('/editThis',(request,response)=>{
    mongoose.model('speaker').updateOne({_id:request.body._id},{ $set: {
        FullName:request.body.FullName,
        UserName:request.body.UserName,
        Password:request.body.Password,
        Address:{
            city:request.body.city,
            street:request.body.street,
            building:request.body.building
        }
    } },function(err, res) {
        if (err) throw err;
        response.redirect('/speaker/list')
      })
})
speaker.get('/delete/',(request,response)=>{
    mongoose.model('speaker').find({},{_id:1,UserName:1}).then((speakers)=>{
        response.render('speakers/delete.ejs',{speakers})
    }).catch((error)=>{
        response.send(""+error)
    })
})
speaker.get('/remove/:_id',(request,response)=>{
    let id=request.params._id
    mongoose.model('speaker').deleteOne({ _id: id }, function(err, obj) {
        if (err) throw err;
        response.redirect('/speaker/list')
      })
})
speaker.post('/remove',(request,response)=>{
    let id=request.body.id
    mongoose.model('speaker').deleteOne({ _id: id }).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error)
    })
})

speaker.post('/delete',(request,response)=>{
    mongoose.model('speaker').deleteOne({ _id: request.body._id }, function(err, obj) {
        if (err) throw err;
        response.redirect('/speaker/list')
      })
})


speaker.get('/edit', (request, response) => {
    let id=request.params._id
    mongoose.model('speaker').find({}).then((speakers_data)=>{
        response.render('speakers/edit.ejs',{speakers_data})
    }).then((error)=>{
        console.log(""+error)
    })
})


speaker.post('/edit', (request, response) => {
    let id=request.body._id
    mongoose.model('speaker').findOne({ _id: id }).then((data)=>{
        response.render('speakers/editthis.ejs',{data})
    })
})
module.exports=speaker