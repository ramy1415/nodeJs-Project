let mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reference');
var connection = mongoose.createConnection("mongodb://localhost:27017/eventsdb");
autoIncrement.initialize(connection);

let eventsSchema=new mongoose.Schema({
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

eventsSchema.plugin(autoIncrement.plugin, 'events');
mongoose.model('events',eventsSchema)