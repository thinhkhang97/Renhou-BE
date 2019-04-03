var express = require('express')
var router = express.Router()
var MemberModel = require('../models/Member');

const handlePageError = (res, e) => res.setStatus(500).send(e.message)

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

module.exports = router