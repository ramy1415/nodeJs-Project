const express=require('express');
const users=express.Router();
const mongoose=require('mongoose')
const bcrypt = require('bcrypt');
require('../model/speakerModel')
require('../model/eventsModel')
let events=mongoose.model('events')
let speakers = mongoose.model('speaker');
users.use((request,response,next)=>{
    if(request.session.role=="admin")
        response.redirect('/admin/profile')
    else
        next()
})

users.use((request,response,next)=>{
    response.locals.UserName=request.session.UserName
    response.locals.UserId=request.session.UserId
    next()
})

users.get('/profile',(req,res)=>{
    // my_id=req.session.UserId
    events.find({mainSpeaker:req.session.UserId}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').then((mainSpeaker_list)=>{
        events.find({otherSpeakers:req.session.UserId}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').then((otherSpeakers_list)=>{
            res.render("users/profilespeaker.ejs",{mainSpeaker_list,otherSpeakers_list})
        }).catch((error)=>{
            console.log(error)
        })
    }).catch((error)=>{
        console.log(error)
    })
    // events.find({mainSpeaker:req.session.UserId}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').exec((error, mainSpeaker_list) => {
    //     if (error) return handleError(error);
    //     res.render("users/profilespeaker.ejs",{mainSpeaker_list})
    // })


    // speakers.findOne({UserName:req.session.UserName}).then((speaker)=>{
    //     // events.find({},{})
    //     res.render("users/profilespeaker.ejs",{speaker})
    // }).catch((error)=>{
    //     console.log("/profile->"+error)
    // })
})



users.get('/edit',(req,res)=>{
    console.log(req.session._id)
    mongoose.model('speaker').findOne({_id:req.session.UserId}).then((data)=>{
        res.render('users/editprofile.ejs',{data})
    }).catch((error)=>{
        console.log(error)
    })  
})


users.post('/edit',async(request,response)=>{
    await bcrypt.hash(request.body.Password, 10, function(err, hash) {
        mongoose.model('speaker').updateOne({_id:request.session.UserId},{ $set: {
            FullName:request.body.FullName,
            UserName:request.body.UserName,
            Password:hash,
            Address:{
                city:request.body.city,
                street:request.body.street,
                building:request.body.building
            }
        } }).then((success)=>{
            request.session.UserName=request.body.UserName
            response.redirect('/user/profile')
        }).catch((error)=>{
            response.send("edit failed")
        })
    });
    
})

users.post('/leavemain', (request, response) => {
    // events.findOne({_id:request.body.event}).then((data)=>{
    //     console.log(data.mainSpeaker.$set())
    // })
    events.updateOne({_id:request.body.event}, { $set: { mainSpeaker: null} }, { runValidators: true },).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error)
    })
    // console.log(request.body.event)
    // console.log(request.body.my_id)
})

users.post('/leaveother', (request, response) => {
    // events.findOne({_id:request.body.event}).then((data)=>{
    //     console.log(data.mainSpeaker.$set())
    // })
    events.updateOne({_id:request.body.event}, { $pull: { otherSpeakers: request.body.my_id} }, { runValidators: true },).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error)
    })
    // console.log(request.body.event)
    // console.log(request.body.my_id)
})



module.exports=users