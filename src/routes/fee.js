var express = require('express');
var router = express.Router();
var FeeRule = require('../models/FeeRule');

//Tính tiền điện,nước của phòng theo số điện nước nhập vào
//electric,water,oldElectric,oldWater
router.get('/', function(req, res, next) {
  FeeRule.findOne({_id: req.query.id}).sort({dateUpdate:-1}).exec((e,rule)=>{
    if(e)
      return res.status(500).send({
          messase: 'error',
          data: e
      })
    if(rule)
    {
      let sum = 0;
      sum += (req.query.electric - req.query.oldElectric) * rule.perElectricCost;
      sum += (req.query.water - req.query.oldWater) * rule.perWaterCost;
      res.send({
          data: sum
      })
    }
  }) 
});

const totalBillModel = require('../models/totalBillModel');
const itemHouseModel = require('../models/itemHouseModel');
const unitPriceModel = require('../models/unitPriceModel');
const roomCostModel = require('../models/roomCost');

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
    var idUser = req.body.idUser;

    var totalElectric, totalWater;
    var totalMoneyElectric, totalMoneyWater, totalItemMoney;
    var totalMoney = 0;
    var beforeMonth = currentMonth - 1;

    totalBillModel.findOne({
        idRoom: idRoom,
        year: currentYear,
        month: beforeMonth.toString()
    }).exec(function (err, totalBillBefore) {
        if(err) res.status(500).send({message: 'error',data: e});
        if (totalBillBefore == null || totalBillBefore == {}) {
            res.send({message : "No data", status : 1});
        } else {
            totalElectric = electricNo - parseInt(totalBillBefore.electricNo);
            totalWater = waterNo - parseInt(totalBillBefore.waterNo);

            unitPriceModel.findOne({idRoom: idRoom, idUser: idUser}).exec(function (err, unitPrice) {
                if(err) res.status(500).send({message: 'error',data: e});
                if (unitPrice == null || unitPrice == {}) {
                    res.send({message: "No data",status: 1});
                } else {
                    totalMoneyElectric = totalElectric * unitPrice.unitPriceElectric;
                    totalMoneyWater = totalWater * unitPrice.unitPriceWater;

                    totalItemMoney = 0;
                    itemHouseModel.find({idRoom: idRoom}).exec(function (err, itemList) {
                        if(err) res.status(500).send({message: 'error',data: e});
                        if (itemList == null || itemList.length == 0) {
                            res.send({
                                message : "Không có vật dụng",
                                status: 1
                            });
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
                                if(err) res.status(500).send({
                                    message: 'error',
                                    data: err
                                });
                                res.send({
                                    message: 'This bill is saved in month',
                                    data: totalBill,
                                    status: 0
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/showFeeList',function(req,res,next){
    var idRoom = req.body.idRoom;
    totalBillModel.find({idRoom: idRoom}).exec(function(err,totalBillList){
        if(err) res.status(500).send({message: 'error',data: e});
        res.send({data: totalBillList});
    })
});

//Hóa đơn từng tháng
router.get('/feeDetail', function (req, res, next) {

    var idRoom = req.body.idRoom;
    var month = req.body.month;
    var year = req.body.year;
    var beforeMonth;
    if(1 == month){
        beforeMonth = 12;
    }else{
        beforeMonth = month - 1;
    }
    totalBillModel.findOne({idRoom: idRoom,month: month.toString(),year: year}).exec(function(err,feeDetailCurrent){
        if(err) res.status(500).send({message: 'error',data:err});
        totalBillModel.findOne({idRoom : idRoom,month:beforeMonth.toString(),year:year}).exec(function(err,feeDetailBefore){
            if(err) res.status(500).send({message:'error',data:err});
            roomCostModel.findOne({idRoom: idRoom}).exec(function(err,roomCost){
                if(err) res.status(500).send({message: 'error',data: err});
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
                res.send({
                    message: 'Get fee detail successfully',
                    data: feeDetail
                });
            })
        })
    })
});



module.exports = router;
