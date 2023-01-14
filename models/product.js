const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ProductSchema= new Schema({
   product:{type:String,required:true},
    price:{type:String,required:true},
   //  image:{type:String,required:true},
   description:{type:String,required:true },
   owner:{type:mongoose.Types.ObjectId,required:true , ref :'User'}

});

module.exports = mongoose.model('Product',ProductSchema);