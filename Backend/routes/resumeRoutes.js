const router = require("express").Router();
const resumeController = require("../controllers/resumeController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", auth, role("candidate"), resumeController.getResume);
router.post("/upload", auth, role("candidate"), resumeController.uploadResume);
router.delete("/", auth, role("candidate"), resumeController.deleteResume);

module.exports = router;