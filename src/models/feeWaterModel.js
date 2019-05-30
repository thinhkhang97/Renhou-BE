const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feeWaterSchema = new Schema({
    idRoom: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: false
    },
    month: {
        type: String,
        required: false
    },
    waterNo: {
        type: String,
        required: false
    }
},{collection: 'Fee_Water'});

const feeWaterModel = mongoose.model('Fee_Water',feeWaterSchema);

module.exports = feeWaterModel;