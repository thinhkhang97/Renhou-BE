var express = require('express')
var router = express.Router()
var MemberModel = require('../models/Member');
var RoomModel = require('../models/Room');

const handlePageError = (res, e) => res.status(500).send(e.message)

//add new members to the room
router.post(
  '/create/:idRoom',
  async (req, res) => {
    try {

      const memberDoc = new MemberModel(req.body);
      const member = await memberDoc.save();
      //add user to the room
      const listUserInRoom = (await RoomModel.findById(req.params.idRoom)).membersIdNumber;
      listUserInRoom.push(member._id);
      await RoomModel.findOneAndUpdate( req.params.idRoom, {membersIdNumber: listUserInRoom});

      return res.send({
        message: 'Created new member successfully!',
        data: member
      })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//update infor of a member
router.put(
  '/update/:id',
  async (req, res) => {
    try {
      await MemberModel.findOneAndUpdate(req.params.id, req.body)

      return res.json({ message: 'Updated Member successfully!' })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//get all members
router.get(
  '/get/all',
  async (req, res) => {
    try {
      await MemberModel.find({delFlag : false}, function(err, member){
        if(err){
          return res.status(404).send({ message: 'Not found!' })
        }
          return res.json({ member: member })
      })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//get infor of a member
router.get(
  '/get/:id',
  async (req, res) => {
    try {
      await MemberModel.find({_id : req.params.id, delFlag : false}, function(err, member){
        if(err){
          return res.status(404).send({ message: 'Not found member with id ' + req.params.id + ' !' })
        }
          return res.json({ member: member })
      })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//delete a member
router.delete(
  '/delete/:id',
  async (req, res) => {
    try {
      await MemberModel.findOneAndUpdate(req.params.id, {delFlag:true})

      return res.json({ message: 'Deleted Member successfully!' })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//get the members in a room
router.post(
  '/room/get',
  async (req, res) => {
    try {
      await MemberModel.find({'_id' : { $in: req.body.listMembersId}, delFlag : false}, function(err, members){
        if(err){
          return res.status(404).send({ message: 'Not found!' })
        }
          return res.json({ member: members })
      })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

module.exports = router