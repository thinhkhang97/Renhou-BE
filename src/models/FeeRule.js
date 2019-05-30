var mongoose = require('mongoose')
 
const Schema = mongoose.Schema
 
const FeeRuleSchema = new Schema({
    roomId:{type: Schema.Types.ObjectId,  required: true , index: true},
    roomCost:Number,
    perElectricCost:Number,
    perWaterCost:Number
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('FeeRule', FeeRuleSchema)