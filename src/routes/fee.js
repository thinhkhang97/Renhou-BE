var express = require('express');
var router = express.Router();

//FEE API
//Tinh phí dựa vào các giá trị trong query:
// -ID phòng từ đó truy xuất ra số điện nước cũ
// -Số điện mới
// -Số nước mới
// -Danh sách ID các đồ vật hư hỏng để tra giá trong database
// OUTPUT: tiền tổng
router.get('/fee', function(req, res, next) {
  res.send('CACULATE FEE API');
});

//Chưa rõ
router.get('/feeDetail', function(req, res, next) {
    res.send('DETAIL FEE API');
  });

module.exports = router;
