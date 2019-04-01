var express = require('express');
var router = express.Router();

//Danh sách các phòng trọ gồm mã phòng và tên người trọ 
router.get('/room', function(req, res, next) {
  res.send('CACULATE FEE API');
});

//Tất cả thông tin của một phòng trọ
router.get('/roomDetail', function(req, res, next) {
    res.send('DETAIL FEE API');
  });

module.exports = router;
