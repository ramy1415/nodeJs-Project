let mongoose=require('mongoose');

let eventsSchema=new mongoose.Schema({
    _id:Number,
    title:{
        type:String,
        required:true
    },
    event_date:String,
    mainSpeaker:{
        type:Number,
        ref:'speaker'
    },
    otherSpeakers:[{
        type:Number,
        ref:'speaker'
    }]
})

mongoose.model('events',eventsSchema)