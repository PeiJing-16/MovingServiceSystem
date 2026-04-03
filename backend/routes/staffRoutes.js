const express = require('express');
const {
  getStaffMembers,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} = require('../controllers/staffController');

const router = express.Router();

router.get('/', getStaffMembers);
router.post('/', createStaffMember);
router.put('/:id', updateStaffMember);
router.delete('/:id', deleteStaffMember);

module.exports = router;