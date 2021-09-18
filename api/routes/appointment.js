const express = require("express");
const router = express.Router();
const appointmentController = require('../controllers/appointment');

router.get('/', appointmentController.get );
router.get('/:id', appointmentController.get );
router.delete("/:id", appointmentController.requireExist, appointmentController.delete);
router.post("/new", appointmentController.insertCheck, appointmentController.add);
router.post("/update", appointmentController.requireExist, appointmentController.update);

module.exports = router;
