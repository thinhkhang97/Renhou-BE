var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const FeeRuleSchema = new Schema({
    ownerId: Schema.Types.ObjectId,
    roomId:{type: Schema.Types.ObjectId,index: true},
    dateUpdate:Date,
    roomCost:Number,
    perElectricCost:Number,
    perWaterCost:Number,
})

module.exports = mongoose.model('FeeRule', FeeRuleSchema)