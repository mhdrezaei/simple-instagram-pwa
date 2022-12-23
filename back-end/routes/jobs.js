const express = require("express");
const { addNewJob , getAllJob , searchJob } = require("../controller/jobsController");
const router = express.Router();

  
router.route("/job/new").post(addNewJob);
router.route("/job/search").post(searchJob);
router.route("/alljobs").get(getAllJob);

module.exports = router;
