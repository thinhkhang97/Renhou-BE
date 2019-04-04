var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const RoomSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    status:{
        type:String,
        default:`empty`,
    },
    membersIdNumber:[String],
    billsIdNumber:[String],
    furnituresIdNumber:[String]
})

module.exports = mongoose.model('Room', RoomSchema)