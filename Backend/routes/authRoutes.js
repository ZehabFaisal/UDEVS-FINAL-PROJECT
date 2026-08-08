const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["candidate", "recruiter", "admin"])
      .withMessage("Role must be candidate, recruiter, or admin"),
    body("company").if(body("role").equals("recruiter")).notEmpty()
      .withMessage("Company is required for recruiters"),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(["candidate", "recruiter", "admin"])
      .withMessage("Invalid role"),
  ],
  validate,
  authController.login
);

router.get("/verify", auth, authController.verify);

module.exports = router;
