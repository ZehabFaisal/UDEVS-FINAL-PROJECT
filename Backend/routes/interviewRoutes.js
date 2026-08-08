const router = require("express").Router();
const { body } = require("express-validator");
const interviewController = require("../controllers/interviewController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const validate = require("../middleware/validate");

router.get("/", auth, interviewController.getInterviews);

router.post(
  "/",
  auth,
  role("recruiter", "admin"),
  [
    body("application_id").isInt().withMessage("Valid application ID is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("location")
      .isIn(["Google Meet", "Zoom", "Microsoft Teams", "Office", "Phone"])
      .withMessage("Invalid location"),
    body("type")
      .isIn(["In-Person", "Video-Call", "Voice-Call"])
      .withMessage("Invalid interview type"),
  ],
  validate,
  interviewController.scheduleInterview
);

router.put(
  "/:id",
  auth,
  role("recruiter", "admin"),
  interviewController.updateInterview
);

module.exports = router;
