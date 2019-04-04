const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feeElectricSchema = new Schema({
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
    electricNo: {
        type: Number
    }
},{collection: 'Fee_Electric'});

const feeElectricModel = mongoose.model('Fee_Electric',feeElectricSchema);

module.exports = feeElectricModel;