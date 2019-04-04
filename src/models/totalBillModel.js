const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const totalBillSchema = new Schema ({

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
    totalElectric: {
        type: Number,
    },
    totalWater: {
        type: Number,
    },
    // Tổng tiền vật dụng hư trong nhà
    itemMoney: {
        type: Number,
    },
    totalMoney: {
        type: Number,
    }
},{collection: 'Total_Bill'});

const totalBillModel = mongoose.model('Total_Bill',totalBillSchema);

module.exports = totalBillModel;