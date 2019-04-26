var express = require('express')
var router = express.Router()
var MemberModel = require('../models/Member');
var RoomModel = require('../models/Room');

const handlePageError = (res, e) => res.status(500).send(e.message)
const handleAccessDeny = (res) =>  res.status(403).send({messase: 'Access deny',})


//add new members to the room
router.post(
  '/create/:idRoom',
  async (req, res) => {
    if(req.user._id != req.body.userId)
     return handleAccessDeny(res)
    else{
        try {
          const room = (await RoomModel.findById(req.params.idRoom));
          if(req.body.userId != room.userId)
          {
            return handleAccessDeny(res)
          }
          else{
            req.body.roomId = req.params.idRoom;
            const memberDoc = new MemberModel(req.body);
            const member = await memberDoc.save();
            //add user to the room
            const listUserInRoom = room.membersIdNumber;
            listUserInRoom.push(member._id);
            await RoomModel.findOneAndUpdate( req.params.idRoom, {membersIdNumber: listUserInRoom,status:'used'});
            return res.send({
              message: 'Created new member successfully!',
              data: member
            })
          }
        } catch (e) {
          return handlePageError(res, e)
        }
      }
    }
)

//update infor of a member
router.put(
  '/update/:id',
  async (req, res) => {
    if(req.user._id != req.body.userId)
      return handleAccessDeny(res)
    else{
      try {
        const member = (await MemberModel.findById(req.params.id));
        if(req.body.userId != member.userId){
          return handleAccessDeny(res)
        }
        else{
          await MemberModel.findOneAndUpdate(req.params.id, req.body)
          return res.json({ message: 'Updated Member successfully!' })
        }
      } catch (e) {
        return handlePageError(res, e)
      }
    }
  }
)

//get all members
router.get(
  '/get/all/:userid',
  async (req, res) => {
    if(req.user._id != req.params.userid)
      return handleAccessDeny(res)
    else{
      try {
        await MemberModel.find({userId: req.params.userid, delFlag : false}, function(err, member){
          if(err){
            return res.status(404).send({ message: 'Not found!' })
          }
            return res.json({ member: member })
        })
      } catch (e) {
        return handlePageError(res, e)
      }
    }
  }
)

//get all members in a room id
router.get(
  '/get/room/:roomId',
  async (req, res) => {
    if(req.user._id != req.query.userId)
      return handleAccessDeny(res)
    else{
      try {
        await MemberModel.find({roomId: req.params.roomId, delFlag : false}, function(err, member){
          if(err){
            return res.status(404).send({ message: 'Not found!' })
          }
            return res.json({ member: member })
        })
      } catch (e) {
        return handlePageError(res, e)
      }
    }
  }
)


//get infor of a member
router.get(
  '/get/:id',
  async (req, res) => {
    if(req.user._id != req.query.userId)
      return handleAccessDeny(res)
    else{
      try {
        await MemberModel.findOne({_id : req.params.id, delFlag : false}, function(err, member){
          if(err){
            return res.status(404).send({ message: 'Not found member with id ' + req.params.id + ' !' })
          }
          else if(member.userId != req.query.userId)
          {
            return handleAccessDeny(res);
          }
          else{
            return res.json(member)
          }
        })
      } catch (e) {
        return handlePageError(res, e)
      }
    } 
  }
)

//delete a member
router.delete(
  '/delete/:id',
  async (req, res) => {
    if(req.user._id != req.query.userId)
      return handleAccessDeny(res)
    else{
      try {
        const member = await MemberModel.findById(req.params.id);
        if(req.query.userId != member.userId){
          return handleAccessDeny(res)
        }
        else{
          await MemberModel.findOneAndUpdate(req.params.id, {delFlag:true})
          return res.json({ message: 'Deleted Member successfully!' })
        } 
      } catch (e) {
        return handlePageError(res, e)
      }
    }
  }
)

//get the members in a room
router.post(
  '/room/get',
  async (req, res) => {
    if(req.user._id != req.body.userId)
      return handleAccessDeny(res)
    else{
      try {
        await MemberModel.find({'_id' : { $in: req.body.listMembersId}, delFlag : false, userId: req.body.userId}, function(err, members){
          if(err){
            return res.status(404).send({ message: 'Not found!' })
          }
            return res.json({ member: members })
        })
      } catch (e) {
        return handlePageError(res, e)
      }
    }
  }
)

module.exports = router