var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const MemberSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  roomId: {type: Schema.Types.ObjectId, required: true},
  name: String,
  idCard: String,
  phone: String,
  dob: Date,
  address: String,
  email: String,
  delFlag: Boolean
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
 
module.exports = mongoose.model('Member', MemberSchema)