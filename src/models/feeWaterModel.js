const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feeWaterSchema = new Schema({
    idRoom: {
        type: String,
        require: false
    },
    year: {
        type: String,
        require: false
    },
    month: {
        type: String,
        require: false
    },
    waterNo: {
        type: String,
        require: false
    }
},{collection: 'Fee_Water'});

const feeWaterModel = mongoose.model('Fee_Water',feeWaterSchema);

module.exports = feeWaterModel;