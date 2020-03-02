let mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reference');
var connection = mongoose.createConnection("mongodb://localhost:27017/eventsdb",{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true });
autoIncrement.initialize(connection);


autoIncrement.initialize(connection);
speakerSchema=new mongoose.Schema({
    FullName:{
        type:String,
        required:true,
        match: /[a-zA-Z]{3,}/
    },
    UserName:{
        type:String,
        required:true,
        unique:true,
        match: /[a-zA-Z]{3,}/  
    },
    Password:{
        type:String,
        required:true,
        match:/.{6,}/
    },
    Address:{
        city:{
            type:String,
            required:true,
        },
        street:{
            type:String,
            required:true,
        },
        building:{
            type:Number,
            required:true
        }},
    Avatar:{
        type:String,
    },

});
speakerSchema.plugin(autoIncrement.plugin, 'speaker');
mongoose.model("speaker",speakerSchema);