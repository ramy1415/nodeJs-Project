let mongoose=require('mongoose');

speakerSchema=new mongoose.Schema({
    _id:Number,
    FullName:{
        type:String,
        required:true
    },
    UserName:String,
    Password:String,
    Address:{city:String,street:String,building:Number}

});
mongoose.model("speaker",speakerSchema);