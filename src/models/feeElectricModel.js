const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feeElectricSchema = new Schema({
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
    electricNo: {
        type: Number
    }
},{collection: 'Fee_Electric'});

const feeElectricModel = mongoose.model('Fee_Electric',feeElectricSchema);

module.exports = feeElectricModel;