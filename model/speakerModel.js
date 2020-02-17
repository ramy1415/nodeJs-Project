let mongoose=require('mongoose');

speakerSchema=new mongoose.Schema({
    _id:Number,
    name:String
});
mongoose.model("speaker",speakerSchema);