const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const totalBillSchema = new Schema ({

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
        type: Number,
    },
    waterNo: {
        type: Number,
    },
    totalMoneyElectric:{
        type: Number,
    },
    totalMoneyWater: {
        type: Number,
    },
    // Tổng tiền vật dụng hư trong nhà
    itemMoneyItem: {
        type: Number,
    },
    totalMoney: {
        type: Number,
    },
    status: {
        type: Number
    }
},{collection: 'Total_Bill'});

const totalBillModel = mongoose.model('Total_Bill',totalBillSchema);

module.exports = totalBillModel;