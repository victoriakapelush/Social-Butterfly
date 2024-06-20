const express = require("express");
const router = express.Router();
const { logoutUser } = require('../controllers/logoutController');

router.post('/:username/logout', logoutUser);

module.exports = router;