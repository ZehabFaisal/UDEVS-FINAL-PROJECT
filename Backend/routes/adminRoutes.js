const router = require("express").Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/recruiters", auth, role("admin"), adminController.getRecruiters);
router.put("/recruiters/:id/status", auth, role("admin"),
  adminController.updateRecruiterStatus
);
router.get("/candidates", auth, role("admin"), adminController.getCandidates);
router.get("/stats", auth, role("admin"), adminController.getStats);

module.exports = router;