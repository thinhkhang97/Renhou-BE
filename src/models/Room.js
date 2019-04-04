var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const RoomSchema = new Schema({
    userID: String,
    name: String,
    address: String,
    status:{
        type:String,
        default:`empty`,
    },
    leaderIdNumber:String,
    membersIdNumber:[String],
    billsIdNumber:[String],
    furnituresIdNumber:[String]
})

module.exports = mongoose.model('Room', RoomSchema)