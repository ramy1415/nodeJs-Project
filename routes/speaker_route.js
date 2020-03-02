const express = require('express');
const speaker = express.Router();
speaker.use(express.static('.'))
require('../model/speakerModel')
let mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const bcrypt = require('bcrypt');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.body.UserName + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage }).single('avatar')

speaker.use((request, response, next) => {
    response.locals.UserName = request.session.UserName
    next()
})

speaker.get('/profile', (request, response) => {
    response.render('speakers/profile.ejs')
})
speaker.use((request, response, next) => {
    if (request.session.role == "admin")
        next()
    else
        response.redirect('profile')
})
speaker.get('/speaker/add', (request, response, next) => {
    response.render('speakers/add.ejs',{error:""})
})

speaker.post('/speaker/add',(request,response)=>{
    upload(request,response,(err)=>{
        if(err){
            console.log("error"+err)
        }else{
            bcrypt.hash(request.body.Password, 10, function(err, hash) {
                let newSpeaker=new mongoose.model('speaker')(
                    request.body
                )
                if(request.file){
                    newSpeaker.Avatar=request.file.filename
                }else{
                    newSpeaker.Avatar="avatar-anon.jpg"
                }
                newSpeaker.save().then((data)=>{
                    mongoose.model('speaker').updateOne({_id:data._id},{ $set: {Password:hash}},{runValidators:true}).then((success)=>{    //doing this in order to validate the entered password using mongo 1st then hash it after
                        console.log("hashed")
                    }).catch((error)=>{
                        console.log("no"+error)
                    })
                    response.redirect('/admin/speaker/list')
                }).catch((error)=>{
                    request.flash("error",error)
                    response.render('speakers/add.ejs',{error:request.flash("error")})
                })
            });
        }
        
    }) 
})

speaker.get('/speaker/list', (request, response) => {
    mongoose.model('speaker').find({}).then((speakers_details) => {
        response.render('speakers/list.ejs', { speakers_details })
    }).catch((error) => {
        response.send("" + error)
    })
})

speaker.get('/speaker/editthis/:_id', (request, response) => {
    let id = request.params._id
    mongoose.model('speaker').findOne({ _id: id }).then((data) => {
        response.render('speakers/editthis.ejs', { data ,error:""})
    })
})

speaker.post('/speaker/editThis', (request, response) => {
    upload(request, response, (err) => {
        if (err) {
            response.redirect('/admin/speaker/list')
        } else {
            mongoose.model('speaker').updateOne({ _id: request.body._id }, {
                $set: {
                    FullName: request.body.FullName,
                    Address: {
                        city: request.body.city,
                        street: request.body.street,
                        building: request.body.building,
                    }
                }
            }, { runValidators: true }, function (error, res) {
                if (error){
                    mongoose.model('speaker').findOne({ _id: request.body._id }).then((data) => {
                        response.render('speakers/editthis.ejs', { data,error })
                    }) 
                    return
                }
                if (request.file != undefined)
                    mongoose.model('speaker').updateOne({ _id: request.body._id }, { $set: { Avatar: request.file.filename } }, { runValidators: true }, function (error, res) {
                        if (error){
                            mongoose.model('speaker').findOne({ _id: request.body._id }).then((data) => {
                                response.render('speakers/editthis.ejs', { data,error })
                            }) 
                            return
                        }
                    })
                response.redirect('/admin/speaker/list')
            })
        }

    })
})
speaker.get('/speaker/delete/', (request, response) => {
    mongoose.model('speaker').find({}, { _id: 1, UserName: 1 }).then((speakers) => {
        response.render('speakers/delete.ejs', { speakers })
    }).catch((error) => {
        response.send("" + error)
    })
})
speaker.get('/speaker/remove/:_id', (request, response) => {
    let id = request.params._id
    mongoose.model('speaker').deleteOne({ _id: id }, function (err, obj) {
        if (err) throw err;
        response.redirect('/speaker/list')
    })
})
speaker.post('/speaker/remove', (request, response) => {
    let id = request.body.id
    mongoose.model('speaker').deleteOne({ _id: id }).then((success) => {
        response.send(success)
    }).catch((error) => {
        console.log(error)
    })
})

speaker.post('/speaker/delete', (request, response) => {
    mongoose.model('speaker').deleteOne({ _id: request.body._id }, function (err, obj) {
        if (err) throw err;
        response.redirect('/admin/speaker/list')
    })
})
speaker.get('/speaker/edit', (request, response) => {
    let id = request.params._id
    mongoose.model('speaker').find({}).then((speakers_data) => {
        response.render('speakers/edit.ejs', { speakers_data })
    }).then((error) => {
        console.log("" + error)
    })
})
speaker.post('/speaker/edit', (request, response) => {
    let id = request.body._id
    console.log("here")
    mongoose.model('speaker').findOne({ _id: id }).then((data) => {
        response.render('speakers/editthis.ejs', { data,error:"" })
    })
})
module.exports = speaker