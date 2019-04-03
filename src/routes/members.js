var express = require('express')
var router = express.Router()
var MemberModel = require('../models/Member');

const handlePageError = (res, e) => res.status(500).send(e.message)

//new a member
router.post(
  '/',
  async (req, res) => {
    try {
      const memberDoc = new MemberModel(req.body);
      const member = await memberDoc.save();

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
  '/:id',
  async (req, res) => {
    try {
      await MemberModel.findOneAndUpdate(req.params.id, req.body)

      return res.json({ message: 'Updated Member successfully!' })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

//get all member
router.get(
  '/all',
  async (req, res) => {
    try {
      await MemberModel.find({delFlag : false}, function(err, member){
        if(err){
          return res.status(404).send({ message: 'Not found any member !' })
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
  '/:id',
  async (req, res) => {
    try {
      await MemberModel.findById(req.params.id, function(err, member){
        if(err){
          return res.status(404).send({ message: 'Not found user with id ' + req.params.id + ' !' })
        }
          return res.json({ member: member })
      })
    } catch (e) {
      return handlePageError(res, e)
    }
  }
)

module.exports = router