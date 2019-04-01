var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const RoomSchema = new Schema({
    owner: Number,
    id: Schema.Types.ObjectId,
    name: String,
    address: String,
    status:{
        type:String,
        default:`empty`,
    },
    leaderIdNumber:String,
    membersIdNumber:[String],
})

module.exports = mongoose.model('room', RoomSchema)