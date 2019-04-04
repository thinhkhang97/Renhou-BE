var express = require('express');
var router = express.Router();
var Room = require('../models/Room');
var Rule = require('../models/FeeRule');


//Add a new room with fee rule
router.post('/',(req, res) => {
  const room = new Room(req.params);
  room.save((e,newRoom)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
    {
      const rule = new Rule(req.params);
      rule.save((e1,newRule)=>{
        if(e1)
          res.status(500).send({
              messase: 'error',
              data: e1
          })
        else
          res.send({
            message: 'Created new room successfully!',
            data: {
              room: newRoom,
              rule: newRule
            }
          })
      })
    }
  })
})

//Find all room of an owner base on owner _id
router.get('/all', (req, res) => {
  Room.find({userId: req.query.owner}).exec((e,data)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
      res.send({
          data: data
      })
  }) 
})

//Find a room base on _id 
router.get('/:id', (req, res) => {
  Room.findOne({_id: req.params.id}).exec((e,data)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
      res.send({
          data: data
      })
  }) 
})

//Find a room base on address and name 
// router.get('/', (req, res) => {
//   Room.findOne({name: req.query.name,address:req.query.address}).exec((e,data)=>{
//     if(e)
//       res.status(500).send({
//           messase: 'error',
//           data: e
//       })
//     else
//       res.send({
//           data: data
//       })
//   }) 
// })

module.exports = router;
