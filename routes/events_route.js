const express = require('express');
const events_route = express.Router();
let mongoose = require('mongoose')
let path = require('path');
require('../model/eventsModel')
require('../model/speakerModel')
let events = mongoose.model('events');
let speakers = mongoose.model('speaker');

events_route.use((request,response,next)=>{
    response.locals.UserName=request.session.UserName
    response.locals.rold=request.session.rold
    next()
})

events_route.get('/list', (request, response) => {
    events.find({}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').exec((error, events_details) => {
        if (error) return handleError(error);
        response.render('events/list.ejs',{events_details})
    })
})
events_route.use((request,response,next)=>{
    if(request.session.role=="admin")
        next()
    else
        response.redirect('/speaker/profile')
})
events_route.get('/add', (request, response) => {
    speakers.find({}).then((data) => {
        response.render('events/addevent.ejs', { data,message:"" })
    }).catch((error) => {
        console.log("add get->"+error)
    })
})

events_route.post('/add', (request, response) => {
    let newEvent = new mongoose.model('events')(request.body)
    newEvent.save().then((data) => {
        events.find({}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').then((events_details)=>{
            response.render('events/list.ejs',{events_details})
        }).catch((error)=>{
            console.log(error+"")
        })
    }).catch((error) => {
        speakers.find({}).then((data) => {
            response.render('events/addevent.ejs', { data,message:error })
        }).catch((error) => {
            console.log(error)
        })
    });
})
events_route.get('/edit', (request, response) => {
    events.find({}, { _id: 1,title:1 }).then((events_data) => {
        response.render('events/editevents.ejs', { events_data })
    }).catch((error) => {
        response.send(error + "");
    })
})


events_route.post('/edit', (request, response) => {
    let id = request.body._id;
    mongoose.model('events').findOne({ _id: id }).then((data) => {
        speakers.find({}, { UserName: 1 ,_id:1 }).then((speakers) => {
            response.render('events/editthis.ejs', { data,speakers,error:"" })
        }).catch((error) => {
            console.log(error + "")
        })
    }).catch((error) => {
        console.log(error + "")
    })

})


events_route.get('/editthis/:_id',(request,response)=>{
    let id=request.params._id
    mongoose.model('events').findOne({ _id: id }).then((data) => {
        speakers.find({}, { UserName: 1 ,_id:1 }).then((speakers) => {
            response.render('events/editthis.ejs', { data,speakers,error:"" })
        }).catch((error) => {
            console.log(error + "")
        })
    }).catch((error) => {
        console.log(error + "")
    })
})

events_route.get('/delete',(request,response)=>{
    mongoose.model('events').find({},{_id:1,title:1}).then((events)=>{
        response.render('events/delete.ejs',{events})
    }).catch((error)=>{
        response.send(""+error)
    })
})

// events_route.get('/remove/:_id',(request,response)=>{
//     let id=request.params._id
//     mongoose.model('events').deleteOne({ _id: id}, function(err, obj) {
//         if (err) throw err;
//         events.find({}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').exec((error, events_details) => {
//             if (error) return handleError(error);
//             response.render('events/list.ejs',{events_details})
//         })
//       })
// })

events_route.post('/remove',(request,response)=>{
    let id=request.body.id
    mongoose.model('events').deleteOne({_id:id}).then((success)=>{
        response.send(success)
    }).catch((error)=>{
        console.log(error+"")
    })
})



events_route.post('/delete',(request,response)=>{
    mongoose.model('events').deleteOne({ _id: request.body._id }, function(err, obj) {
        if (err) throw err;
        events.find({}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').exec((error, events_details) => {
            if (error) return handleError(error);
            response.render('events/list.ejs',{events_details})
        })
      })
})

events_route.post('/editthis',(request,response)=>{
    mongoose.model('events').updateOne({_id:request.body._id},{ $set: {
        title:request.body.title,
        event_date:request.body.event_date,
        mainSpeaker:request.body.mainSpeaker,
        otherSpeakers:request.body.otherSpeakers,
        } },{runValidators:true},function(error, res) {
        if (error){
            mongoose.model('events').findOne({ _id: request.body._id }).then((data) => {
                speakers.find({}, { UserName: 1 ,_id:1 }).then((speakers) => {
                    response.render('events/editthis.ejs', { data,speakers,error }) 
                    return
                }).catch((error) => {
                    console.log(error + "123")
                })
            }).catch((error) => {
                console.log(error + "456")
            })
        }else{
            response.redirect("list")
        }
        
        // db.close();
      })
})





module.exports = events_route;