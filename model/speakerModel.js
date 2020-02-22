let mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reference');
var connection = mongoose.createConnection("mongodb://localhost:27017/eventsdb");
autoIncrement.initialize(connection);


autoIncrement.initialize(connection);
speakerSchema=new mongoose.Schema({
    FullName:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true,
        unique:true   
    },
    Password:{
        type:String,
        required:true 
    },
    Address:{city:String,street:String,building:Number},
    Avatar:{
        type:String,
        required:true  
    },

});
speakerSchema.plugin(autoIncrement.plugin, 'speaker');
mongoose.model("speaker",speakerSchema);