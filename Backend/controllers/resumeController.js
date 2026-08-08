const multer = require("multer");
const path = require("path");
const { User } = require("../models");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("resume");

exports.uploadResume = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    try {
      const resumeUrl = `/uploads/resumes/${req.file.filename}`;
      await User.update({ resume_url: resumeUrl }, { where: { id: req.user.id } });

      res.json({
        success: true,
        message: "Resume is uploaded successfully",
        resume_url: resumeUrl,
      });
    } 
    catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

exports.getResume = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "resume_url"],
    });

    res.json({
      success: true,
      resume_url: user.resume_url || null,
    });
  } 
  catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    await User.update({ resume_url: null }, { where: { id: req.user.id } });
    res.json({ success: true, message: "Resume removed" });
  } 
  catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};