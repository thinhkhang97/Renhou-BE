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

module.exports = router;
