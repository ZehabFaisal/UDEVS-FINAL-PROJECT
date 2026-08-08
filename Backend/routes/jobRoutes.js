const router = require("express").Router();
const { body } = require("express-validator");
const jobController = require("../controllers/jobController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const validate = require("../middleware/validate");

router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

router.post(
  "/",
  auth,
  role("recruiter"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("job_type")
      .isIn(["Full-time", "Part-time", "Contract", "Internship"])
      .withMessage("Invalid job type"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("salary_min")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Salary min must be positive"),
    body("salary_max")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Salary max must be positive"),
  ],
  validate,
  jobController.createJob
);

router.put(
  "/:id",
  auth,
  role("recruiter", "admin"),
  jobController.updateJob
);

router.delete(
  "/:id",
  auth,
  role("recruiter", "admin"),
  jobController.deleteJob
);

module.exports = router;
