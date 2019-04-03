var express = require('express');
var router = express.Router();

const feeElectricModel = require('../models/feeElectricModel');
const feeWaterModel = require('../models/feeWaterModel');
const totalBillModel = require('../models/totalBillModel');
const itemHouseModel = require('../models/itemHouseModel');

const MONEY_ELECTRIC = 3000;
const MONEY_WATER = 16000;

//FEE API
//Tinh phí dựa vào các giá trị trong query:
// -ID phòng từ đó truy xuất ra số điện nước cũ
// -Số điện mới
// -Số nước mới
// -Danh sách ID các đồ vật hư hỏng để tra giá trong database
// OUTPUT: tiền tổng
router.get('/fee', function(req, res, next) {

    var currentMonth = req.body.currentMonth;
    var currentYear = req.body.currentYear;
    var electricNo = req.body.electricNo;
    var waterNo = req.body.waterNo;
    var idRoom = req.body.idRoom;
    var listItem = req.body.listItem;
    // var currentMonth = 3;
    // var currentYear = "2019";
    // var electricNo = 135;
    // var waterNo = 10;
    // var idRoom = "P01";
    // var listItem = ['MAY_LANH','CUA_SO'];

    var totalElectric, totalWater, totalItemMoney;
    var totalMoney = 0;
    var beforeMonth = currentMonth - 1;

    feeElectricModel.findOne({idRoom : idRoom,year: currentYear, month: beforeMonth.toString()}).exec(function (err, resultElectric) {
        if (err) console.log(err);
        totalElectric = electricNo - parseInt(resultElectric.electricNo);

        feeWaterModel.findOne({idRoom: idRoom, year: currentYear, month: beforeMonth.toString()}).exec(function (err, resultWater) {
            if (err) console.log(err);
            totalWater = waterNo - parseInt(resultWater.waterNo);

            totalItemMoney = 0;
            itemHouseModel.find({idRoom: idRoom}).exec(function (err, itemList) {
                if (err) console.log(err);
                listItem.forEach(item => {
                    var itemMoney = itemList.filter(x => x.idItem.includes(item) == 1);
                    console.log(itemMoney);
                    totalItemMoney = totalItemMoney + parseInt(itemMoney[0].money);
                });

                console.log(totalItemMoney.toString() + "," + totalWater.toString() + "," + totalElectric.toString());

                totalMoney = totalElectric*MONEY_ELECTRIC + totalWater*MONEY_WATER + totalItemMoney;
                console.log(totalMoney);

                const totalBill = new totalBillModel({
                   idRoom: idRoom,
                   month: currentMonth,
                   year: currentYear,
                    totalElectric: totalElectric,
                    totalWater: totalWater,
                    itemMoney: totalItemMoney,
                    totalMoney: totalMoney
                });
                
                totalBill.save(function(err){
                    if(err) console.log(err);
                    
                    res.send(totalBill);
                });

                // res.send(totalMoney.toString());
            });
        });
    });
});

//Hóa đơn tiền điện
router.get('/feeElectric', function (req, res, next) {
    res.send('DETAIL FEE API');
  });

module.exports = router;
