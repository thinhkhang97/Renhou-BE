var express = require('express');
var router = express.Router();
var Room = require('../models/Room');

//Add a new room
router.post('/',(req, res) => {
  const room = new Room(req.params);
  room.save((e,data)=>{
    if(e)
      res.status(500).send({
          messase: 'error',
          data: e
      })
    else
      res.send({
          message: 'Created new room successfully!',
          data: data
      })
  })
})

//Find all room of an owner base on owner _id
router.get('/all', (req, res) => {
  Room.find({owner: req.query.owner}).exec((e,data)=>{
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
router.get('/', (req, res) => {
  Room.findOne({_id: req.query.id}).exec((e,data)=>{
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
router.get('/', (req, res) => {
  Room.findOne({name: req.query.name,address:req.query.address}).exec((e,data)=>{
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

module.exports = router;
