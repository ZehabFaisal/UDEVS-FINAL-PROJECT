const { Interview, Application, Job, User } = require("../models");

exports.getInterviews = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const where = {};

    if (role === "recruiter") {
      const recruiterJobs = await Job.findAll({
        where: { recruiter_id: userId },
        attributes: ["id"],
      });
      const jobIds = recruiterJobs.map((j) => j.id);
      const apps = await Application.findAll({
        where: { job_id: jobIds },
        attributes: ["id"],
      });
      where.application_id = apps.map((a) => a.id);
    } else if (role === "candidate") {
      const candidateApps = await Application.findAll({
        where: { candidate_id: userId },
        attributes: ["id"],
      });
      where.application_id = candidateApps.map((a) => a.id);
    }

    const interviews = await Interview.findAll({
      where,
      include: [
        {
          model: Application,
          as: "application",
          include: [
            { model: User, as: "candidate", attributes: ["id", "name", "email"] },
            { model: Job, as: "job", attributes: ["id", "title"] },
          ],
        },
        {
          model: User,
          as: "interviewer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    res.json({ success: true, interviews });
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const { application_id, date, time, location, type } = req.body;

    const application = await Application.findByPk(application_id, {
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

    const existing = await Interview.findOne({
      where: { application_id, status: "scheduled" },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An interview is already scheduled for this application",
      });
    }

    const interview = await Interview.create({
      application_id,
      interviewer_id: req.user.id,
      date,
      time,
      location,
      type,
    });

    await application.update({ status: "interview_scheduled" });

    res
      .status(201)
      .json({ success: true, message: "Interview scheduled", interview });
  } catch (error) {
    console.error("Schedule interview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id, {
      include: [{ model: Application, as: "application", include: [{ model: Job, as: "job" }] }],
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (
      interview.interviewer_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const allowed = ["date", "time", "location", "type", "status"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    await interview.update(updates);

    res.json({ success: true, message: "Interview updated", interview });
  } catch (error) {
    console.error("Update interview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
