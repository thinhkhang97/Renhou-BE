const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemHouseSchema = new Schema({

    idRoom: {
        type: String,
        required: false
    },
    idItem: {
        type: String,
        required: false,
    },
    nameItem: {
        type: String,
        required: false
    },
    money: {
        type: Number,
    },
    status: {
        // 1 còn sử dụng được
        // 0 không sử dụng được
        type: Boolean,
    }

},{collection: 'Item_House'});

const itemHouseModel = mongoose.model('Item_House',itemHouseSchema);

module.exports = itemHouseModel;