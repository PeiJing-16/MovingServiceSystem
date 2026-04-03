const express = require('express');
const { getStaffMembers } = require('../controllers/staffController');

const router = express.Router();

router.get('/', getStaffMembers);

module.exports = router;