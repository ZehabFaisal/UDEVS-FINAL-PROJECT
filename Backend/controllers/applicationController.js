const { Application, Job, User, Interview } = require("../models");

exports.getApplications = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const where = {};

    if (role === "candidate") {
      where.candidate_id = userId;
    } else if (role === "recruiter") {
      const recruiterJobs = await Job.findAll({
        where: { recruiter_id: userId },
        attributes: ["id"],
      });
      where.job_id = recruiterJobs.map((j) => j.id);
    }

    const applications = await Application.findAll({
      where,
      include: [
        { model: User, as: "candidate", attributes: ["id", "name", "email", "resume_url"] },
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "category", "location", "job_type"],
        },
        { model: Interview, as: "interview" },
      ],
      order: [["created_at", "DESC"]],
    });

    const result = applications.map((app) => {
      const plain = app.toJSON();
      plain.name = plain.candidate?.name || "";
      plain.role = plain.job?.title || "";
      return plain;
    });

    res.json({ success: true, applications: result });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const { job_id } = req.body;

    const job = await Job.findByPk(job_id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    const existing = await Application.findOne({
      where: { candidate_id: req.user.id, job_id },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const application = await Application.create({
      candidate_id: req.user.id,
      job_id,
      status: "new",
    });

    res.status(201).json({ success: true, message: "Application submitted", application });
  } 
  catch (error) {
    console.error("Submit application error occurred:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: "job", attributes: ["recruiter_id"] }],
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (
      application.job.recruiter_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await application.update({ status });

    res.json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (
      application.candidate_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await application.destroy();

    res.json({ success: true, message: "Application deleted" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
