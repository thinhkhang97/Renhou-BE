const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomCostSchema = new Schema ({
    idRoom:{
        type: String,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    roomCost: {
        type: Number,
    },
    waterCost: {
        type: Number,
    },
    electricCost: {
        type: Number,
    }
},{collection: 'Room_Cost'});

const  roomCostModel = mongoose.model('Room_Cost',roomCostSchema);

module.exports = roomCostModel;