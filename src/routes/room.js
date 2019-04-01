var express = require('express');
var router = express.Router();
var Room = require('../models/Room');

router.post(
  '/',
  async (req, res) => {
    try {
      const objid = mongoose.Schema.Types.ObjectId;
      const room = await new Room({id:objid,...req.body}).save()
      return res.send({
        message: 'Created new room successfully!',
        data: room
      })
    } catch (e) {
      res.setStatus(500).send(e.message)
    }
  }
)

router.get(
  '/all',
  async (req, res) => {
    try {
      const rooms = await Room.find({owner: req.query.owner})
      return res.send({
        data: rooms
      })
    } catch (e) {
      res.setStatus(500).send(e.message)
    }
  }
)

router.get(
  '/:id',
  async (req, res) => {
    try {
      const room = await Room.findOne({id: req.params.id})
      return res.send({
        data: room
      })
    } catch (e) {
      res.setStatus(500).send(e.message)
    }
  }
)

module.exports = router;
