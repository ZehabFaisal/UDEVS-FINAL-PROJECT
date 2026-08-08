const { Op } = require("sequelize");
const { User, RecruiterProfile, Job, Application } = require("../models");

exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await RecruiterProfile.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const result = recruiters.map((r) => {
      const plain = r.toJSON();
      plain.name = plain.user?.name || "";
      plain.email = plain.user?.email || "";
      return plain;
    });

    res.json({ success: true, recruiters: result });
  } catch (error) {
    console.error("Get recruiters error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateRecruiterStatus = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findByPk(req.params.id);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Recruiter not found" });
    }

    await profile.update({ status: req.body.status });

    res.json({
      success: true,
      message: "Recruiter status updated",
      recruiter: profile,
    });
  } catch (error) {
    console.error("Update recruiter status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await User.findAll({
      where: { role: "candidate" },
      attributes: ["id", "name", "email", "role", "created_at"],
      include: [
        {
          model: Application,
          as: "applications",
          attributes: ["id", "status", "ai_score"],
          include: [
            { model: Job, as: "job", attributes: ["id", "title"] },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const result = candidates.map((c) => {
      const plain = c.toJSON();
      if (plain.applications && plain.applications.length > 0) {
        const latest = plain.applications[0];
        plain.status = latest.status;
        plain.role_applied = latest.job?.title || "";
      } else {
        plain.status = "New";
        plain.role_applied = "";
      }
      return plain;
    });

    res.json({ success: true, candidates: result });
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalRecruiters = await User.count({ where: { role: "recruiter" } });
    const totalCandidates = await User.count({ where: { role: "candidate" } });
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: "active" } });
    const totalApplications = await Application.count();
    const pendingRecruiters = await RecruiterProfile.count({
      where: { status: "pending" },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalCandidates,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingRecruiters,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
