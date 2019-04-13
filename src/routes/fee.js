var express = require('express');
var router = express.Router();

const totalBillModel = require('../models/totalBillModel');
const itemHouseModel = require('../models/itemHouseModel');
const unitPriceModel = require('../models/unitPriceModel');
const roomCostModel = require('../models/roomCost');
const feeDetailModel = require('../models/feeDetailModel');

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

router.get('/showFeeList',function(req,res,next){
    // var idRoom = req.body.idRoom;
    var idRoom = "P01";
    totalBillModel.find({idRoom: idRoom}).exec(function(err,totalBillList){
        res.send(totalBillList);
    })
});

//Hóa đơn tiền điện
router.get('/feeDetail', function (req, res, next) {

    var idRoom = req.body.idRoom;
    var month = req.body.month;
    var year = req.body.year;
    // var idRoom = "P01";
    // var month = 3;
    // var year = "2019";
    var beforeMonth;
    if(1 == month){
        beforeMonth = 12;
    }else{
        beforeMonth = month - 1;
    }
    totalBillModel.findOne({idRoom: idRoom,month: month.toString(),year: year}).exec(function(err,feeDetailCurrent){

        totalBillModel.findOne({idRoom : idRoom,month:beforeMonth.toString(),year:year}).exec(function(err,feeDetailBefore){

            roomCostModel.findOne({idRoom: idRoom}).exec(function(err,roomCost){
                var electricOldNo = feeDetailCurrent.electricNo;
                console.log(electricOldNo);
                const feeDetail = {
                    "idRoom" : idRoom,
                    "time" : month + "/" + year,
                    "electricOldNo" : electricOldNo,
                    "electricNewNo" : feeDetailCurrent.electricNo,
                    "electricCost" : roomCost.electricCost,
                    "totalMoneyElectric" : feeDetailCurrent.totalMoneyElectric,
                    "waterOldNo" : feeDetailBefore.waterNo,
                    "waterNewNo" : feeDetailCurrent.waterNo,
                    "waterCost" : roomCost.waterCost,
                    "totalMoneyWater" : feeDetailCurrent.totalMoneyWater,
                    "roomCost" : roomCost.roomCost,
                    "totalMoneyItem" : feeDetailCurrent.itemMoneyItem,
                    "totalMoney" : feeDetailCurrent.totalMoney,
                    "status" : feeDetailCurrent.status
                };
                res.send(feeDetail);
            })
        })
    })
});

module.exports = router;
