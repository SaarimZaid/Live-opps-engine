const mongoose = require('mongoose')
const offerSchema = new mongoose.Schema({
    offer_id:String,
    offer_title:String,
    offer_description:String,
    offer_image:String,
    content:Array,
    schedule:Object,
    target:String,
    pricing:Array,
    username:String
})

mongoose.model('Offer', offerSchema)