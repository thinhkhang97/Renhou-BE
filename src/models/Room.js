var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const RoomSchema = new Schema({
    userId: Schema.Types.ObjectId,
    name: String,
    address: String,
    status:{
        type:String,
        default:`empty`,
    },
    membersIdNumber:[String],
    billsIdNumber:[String],
    furnituresIdNumber:[String]
})

module.exports = mongoose.model('Room', RoomSchema)