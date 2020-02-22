let mongoose=require('mongoose');

speakerSchema=new mongoose.Schema({
    _id:Number,
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
mongoose.model("speaker",speakerSchema);