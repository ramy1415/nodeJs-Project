const express = require('express');
const events_route = express.Router();
let mongoose = require('mongoose')
let path = require('path');
require('../model/eventsModel')
require('../model/speakerModel')
let events = mongoose.model('events');
let speakers = mongoose.model('speaker');
events_route.use(express.static('.'))
events_route.use(express.urlencoded({ extended: true }))




events_route.get('/add', (request, response) => {
    speakers.find({}).then((data) => {
        response.render('addevent.ejs', { data })
    }).catch((error) => {
        console.log(error + "")
    })
})

events_route.get('/list', (request, response) => {
    events.find({}).populate('mainSpeaker', 'UserName').populate('otherSpeakers', 'UserName').exec((error, data) => {
        if (error) return handleError(error);
        response.send(data);
    })
})



events_route.get('/edit', (request, response) => {
    events.find({}, { _id: 1 }).then((events_ids) => {
        response.render('editevents.ejs', { events_ids })
    }).catch((error) => {
        response.send(error + "");
    })
})


events_route.post('/edit', (request, response) => {
    let id = request.body._id;
    mongoose.model('events').findOne({ _id: id }).then((data) => {
        speakers.find({}, { UserName: 1 ,_id:1 }).then((speakers) => {
            // data.mainSpeaker==
            console.log(data.otherSpeakers)
            response.render('editthis.ejs', { data,speakers })
        }).catch((error) => {
            console.log(error + "")
        })
    }).catch((error) => {
        console.log(error + "")
    })

})




events_route.post('/add', (request, response) => {
    let newEvent = new mongoose.model('events')(request.body)
    newEvent.save().then((data) => {
        console.log("saved")
    }).catch((error) => {
        console.log("" + error)
    });
})
module.exports = events_route;