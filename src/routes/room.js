var express = require('express');
var router = express.Router();
var Room = require('../models/Room');
var Rule = require('../models/FeeRule');


//Add a new room with fee rule
router.post('/',(req, res) => {
  const room = new Room(req.body);
  room.save((e,newRoom)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
    {
      req.body.roomId = newRoom._id;
      const rule = new Rule((req.body));
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


//Configurate list member
router.put('/members',(req, res) => {
  Room.findOneAndUpdate({_id:req.body.roomId},{membersIdNumber:req.body.listMember}).exec((e,data)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
      res.send({
          messase: 'configurate success',
      })
  }) 
})

//Configurate fee cost
router.put('/feecost',(req, res) => {
  console.log(req.body)
  Rule.findOneAndUpdate({roomId:req.body.roomId},req.body).exec((e,data)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
      res.send({
          messase: 'configurate success',
      })
  }) 
})

//Find all room of an owner base on owner _id
router.get('/all/:userid', (req, res) => {
  Room.find({userId: req.params.userid}).exec((e,data)=>{
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
      Rule.findOne({roomId: req.params.id}).exec((e2,extradata)=>{
        if(e2)
          res.status(500).send({
              messase: 'error',
              data: e2
          })
        else
          res.send({
              data: {
                room: data,
                rule: extradata
              }
          })
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
