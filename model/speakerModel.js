let mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reference');
var connection = mongoose.createConnection("mongodb://localhost:27017/eventsdb");
autoIncrement.initialize(connection);


autoIncrement.initialize(connection);
speakerSchema=new mongoose.Schema({
    FullName:{
        type:String,
        required:[true,"Full name is required"],
        // match:"[a-zA-Z]{3,}"
    },
    UserName:{
        type:String,
        required:[true,"User name is required"],
        unique:true   
    },
    Password:{
        type:String,
        required:[true,"Password is required"],
    },
    Address:{city:String,street:String,building:Number},
    Avatar:{
        type:String, 
    },

});
speakerSchema.plugin(autoIncrement.plugin, 'speaker');
mongoose.model("speaker",speakerSchema);