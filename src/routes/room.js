var express = require('express');
var router = express.Router();
var Room = require('../models/Room');
var Rule = require('../models/FeeRule');
var passport = require('passport');

const handlePageError = (res, e) => res.status(500).send(e.message)
const handleAccessDeny = (res) =>  res.status(403).send({messase: 'Access deny',})

//Add a new room with fee rule
router.post('/',(req, res) => {
  if(req.user._id != req.body.userId)
    return handleAccessDeny(res);
  else{
    const room = new Room(req.body);
    room.save((e,newRoom)=>{
      if(e)
        return handlePageError(res,e);
      else
      {
        req.body.roomId = newRoom._id;
        const rule = new Rule((req.body));
        rule.save((e1,newRule)=>{
          if(e1)
            return handlePageError(res,e1);
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
  }
})


//Configurate list member
router.put('/members',(req, res) => {
  if(req.user._id != req.body.userId)
    return handleAccessDeny(res);
  else{
    Room.findOne({_id:req.body.roomId}).exec((e,data)=>{
      if(e || !data)
        return handlePageError(res,e);
      if(data.userId != req.body.userId)
      {
        return handleAccessDeny(res);
      }
      else{
        Room.updateOne({_id:req.body.roomId},{membersIdNumber:req.body.listMember}).exec((e)=>{
          if(e)
            return handlePageError(res,e);
          res.send({
            messase: 'configurate success',
          })
        }) 
      }
    }) 
  }
})

//Configurate room and rule fee
router.put('/config',(req, res) => {
  if(req.user._id != req.body.userId)
    return handleAccessDeny(res);
  else{
    Room.findOne({_id:req.body.roomId}).exec((e,data)=>{
      if(e || !data)
        return handlePageError(res,e);
      if(data.userId != req.body.userId)
      {
        return handleAccessDeny(res)
      }
      else{
        Room.updateOne({_id:req.body.roomId},req.body).exec((e1)=>
        {
          if(e1)
            return handlePageError(res,e1);
        })
        Rule.findOneAndUpdate({roomId:req.body.roomId},req.body).exec((e2)=>{
          if(e)
            return handlePageError(res,e2);
          else
            return res.status(200).send({
              messase: 'configurate success'});
        }) 
      }
    }) 
  }
})

//Find all room of an owner base on owner _id
router.get('/all/:userid', (req, res) => {
  if(req.user._id != req.params.userid)
    return handleAccessDeny(res)
  else{
    Room.find({userId: req.params.userid}).exec((e,data)=>{
      if(e)
        return handlePageError(res,e);
      else
        res.send({
            data: data
        })
    }) 
  }
})

//Find a room base on _id 
router.get('/:roomId', (req, res) => {
  if(req.user._id != req.query.userId)
    return handleAccessDeny(res)
  else{
    Room.findOne({_id: req.params.roomId}).exec((e,data)=>{
      if(e)
        return handlePageError(res,e);
      else
        Rule.findOne({roomId: req.params.roomId}).exec((e1,extradata)=>{
          if(e1)
            return handlePageError(res,e1);
          else
            res.send({
                data: {
                  room: data,
                  rule: extradata
                }
            })
        }) 
    }) 
  }
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
