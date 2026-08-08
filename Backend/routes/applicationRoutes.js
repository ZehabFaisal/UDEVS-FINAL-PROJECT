const router = require("express").Router();
const { body } = require("express-validator");
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const validate = require("../middleware/validate");

router.get("/", auth, applicationController.getApplications);

router.post(
  "/",
  auth,
  role("candidate"),
  [body("job_id").isInt().withMessage("Valid job ID is required")],
  validate,
  applicationController.submitApplication
);

router.put(
  "/:id/status",
  auth,
  role("recruiter", "admin"),
  [
    body("status")
      .isIn([
        "new",
        "under_review",
        "interview_scheduled",
        "rejected",
        "hired",
      ])
      .withMessage("Invalid status"),
  ],
  validate,
  applicationController.updateApplicationStatus
);

router.delete(
  "/:id",
  auth,
  role("candidate", "admin"),
  applicationController.deleteApplication
);

module.exports = router;
