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
    events.find({mainSpeaker:req.session.UserId}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').then((mainSpeaker_list)=>{
        events.find({otherSpeakers:req.session.UserId}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').then((otherSpeakers_list)=>{
            res.render("users/profilespeaker.ejs",{mainSpeaker_list,otherSpeakers_list})
        }).catch((error)=>{
            console.log(error)
        })
    }).catch((error)=>{
        console.log(error)
    })
})



users.get('/edit',(req,res)=>{
    mongoose.model('speaker').findOne({_id:req.session.UserId}).then((data)=>{
        res.render('users/editprofile.ejs',{data,error:""})
    }).catch((error)=>{
        console.log(error)
    })  
})


users.post('/edit',async(request,response)=>{
    await bcrypt.hash(request.body.Password, 10, function(err, hash) {
        mongoose.model('speaker').updateOne({_id:request.session.UserId},{ $set: {
            FullName:request.body.FullName,
            UserName:request.body.UserName,
            Password:request.body.Password,
            Address:{
                city:request.body.city,
                street:request.body.street,
                building:request.body.building
            }
        } },{runValidators:true}).then((success)=>{
            mongoose.model('speaker').updateOne({_id:request.session.UserId},{ $set: {Password:hash}},{runValidators:true}).then((success)=>{    //doing this in order to validate the entered password using mongo 1st then hash it after
                console.log("updated")
            }).catch((error)=>{
                console.log("no")
            })
            request.session.UserName=request.body.UserName
            response.redirect('/user/profile')
        }).catch((error)=>{
            console.log("hi")
            mongoose.model('speaker').findOne({_id:request.session.UserId}).then((data)=>{
                response.render('users/editprofile.ejs',{data,error})
            console.log("eman")
            }).catch((error)=>{
                console.log(error)
            })  
        })
    });
})


users.post('/leavemain', (request, response) => {
    events.updateOne({_id:request.body.event}, { $set: { mainSpeaker: null} }, { runValidators: true },).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error)
    })
})

users.post('/leaveother', (request, response) => {
    events.updateOne({_id:request.body.event}, { $pull: { otherSpeakers: request.body.my_id} }, { runValidators: true },).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error)
    })
})



module.exports=users