const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const unitPriceSchema = new Schema ({

    idRoom: {
        type: String,
        require: false
    },
    idUser: {
        type: String,
        require: false
    },
    unitPriceElectric:{
        type: Number
    },
    unitPriceWater: {
        type: Number
    },
    priceRoom: {
        type: Number
    }
},{collection: 'Unit_Price'});

const unitPriceModel = mongoose.model('Unit_Price',unitPriceSchema);

module.exports = unitPriceModel;