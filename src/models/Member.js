var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const MemberSchema = new Schema({
  userID: String,
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