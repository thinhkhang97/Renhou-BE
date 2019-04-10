var mongoose = require('mongoose')
 
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {type: String,match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ,'not valid email']},
    password: {type: String},
    isActive: {type: Boolean}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
 
module.exports = mongoose.model('User', UserSchema)