var express = require('express');
var router = express.Router();

const totalBillModel = require('../models/totalBillModel');
const itemHouseModel = require('../models/itemHouseModel');
const unitPriceModel = require('../models/unitPriceModel');

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
    var idUser = req.body.idUser;
    var listItem = req.body.listItem;
    var idUser = req.body.idUser;

    // var currentMonth = 3;
    // var currentYear = "2019";
    // var electricNo = 135;
    // var waterNo = 10;
    // var idRoom = "P01";
    // var listItem = ['MAY_LANH', 'CUA_SO'];
    // var idUser = "user";

    var totalElectric, totalWater;
    var totalMoneyElectric, totalMoneyWater, totalItemMoney;
    var totalMoney = 0;
    var beforeMonth = currentMonth - 1;

    totalBillModel.findOne({
        idRoom: idRoom,
        year: currentYear,
        month: beforeMonth.toString()
    }).exec(function (err, totalBillBefore) {
        console.log(totalBillBefore);
        if (totalBillBefore == null || totalBillBefore == {}) {
            res.send("No data");
        } else {
            totalElectric = electricNo - parseInt(totalBillBefore.electricNo);
            totalWater = waterNo - parseInt(totalBillBefore.waterNo);

            unitPriceModel.findOne({idRoom: idRoom, idUser: idUser}).exec(function (err, unitPrice) {
                if (unitPrice == null || unitPrice == {}) {
                    res.send("No data");
                } else {
                    totalMoneyElectric = totalElectric * unitPrice.unitPriceElectric;
                    totalMoneyWater = totalWater * unitPrice.unitPriceWater;

                    totalItemMoney = 0;
                    itemHouseModel.find({idRoom: idRoom}).exec(function (err, itemList) {
                        if (itemList == null || itemList.length == 0) {
                            res.send("Không có vật dụng");
                        } else {
                            listItem.forEach(item => {
                                var itemMoney = itemList.filter(x => x.idItem.includes(item) == 1);

                                totalItemMoney = totalItemMoney + parseInt(itemMoney[0].money);
                            });

                            console.log(totalItemMoney.toString() + "," + totalMoneyWater.toString() + "," + totalMoneyElectric.toString());
                            totalMoney = totalMoneyWater + totalMoneyElectric + totalItemMoney;

                            const totalBill = new totalBillModel({
                                idRoom: idRoom,
                                month: currentMonth.toString(),
                                year: currentYear.toString(),
                                electricNo: totalElectric,
                                waterNo: totalWater,
                                totalMoneyElectric: totalMoneyElectric,
                                totalMoneyWater: totalMoneyWater,
                                itemMoneyItem: totalItemMoney,
                                totalMoney: totalMoney
                            });

                            totalBill.save(function (err) {
                                if(err) console.log(err);
                                res.send(totalBill);
                            });
                        }
                    });
                }
            });
        }
    });
});

//Hóa đơn tiền điện
router.get('/feeElectric', function (req, res, next) {
    res.send('DETAIL FEE API');
  });

module.exports = router;
