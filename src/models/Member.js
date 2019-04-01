var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const MemberSchema = new Schema({
  name: String,
  idCard: String,
  phone: String,
  email: String,
  delFlag: Boolean
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
 
module.exports = mongoose.model('members', MemberSchema)