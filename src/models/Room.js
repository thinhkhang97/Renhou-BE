var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const RoomSchema = new Schema({
    ownerId: Schema.Types.ObjectId,
    name: String,
    address: String,
    status:{
        type:String,
        default:`empty`,
    },
    membersIdNumber:[String],
})

module.exports = mongoose.model('Room', RoomSchema)