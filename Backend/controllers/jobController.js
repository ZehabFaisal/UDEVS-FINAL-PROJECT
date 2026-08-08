const { Op } = require("sequelize");
const { Job, Application, User } = require("../models");

exports.getAllJobs = async (req, res) => {
  try {
    const { search, category, job_type, location, page = 1, limit = 10 } = req.query;

    const where = { status: "active" };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;
    if (job_type) where.job_type = job_type;
    if (location) where.location = { [Op.iLike]: `%${location}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: jobs, count } = await Job.findAndCountAll({
      where,
      include: [
        { model: User, as: "recruiter", attributes: ["id", "name", "email"] },
        { model: Application, as: "applications", attributes: ["id"] },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const result = jobs.map((job) => ({
      ...job.toJSON(),
      applications_count: job.applications.length,
      applications: undefined,
    }));

    res.json({
      success: true,
      jobs: result,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: User, as: "recruiter", attributes: ["id", "name", "email"] },
        {
          model: Application,
          as: "applications",
          include: [
            { model: User, as: "candidate", attributes: ["id", "name", "email"] },
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Error! Job does not found" });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, category, location, job_type, salary_min, salary_max, description, requirements } =
      req.body;

    const job = await Job.create({
      recruiter_id: req.user.id,
      title,
      category,
      location,
      job_type,
      salary_min,
      salary_max,
      description,
      requirements: requirements || [],
    });

    res.status(201).json({ 
      success: true, message: "Job is created successfully....", job
     });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    if (job.recruiter_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const allowed = [
      "title",
      "category",
      "location",
      "job_type",
      "salary_min",
      "salary_max",
      "description",
      "requirements",
      "status",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    await job.update(updates);

    res.json({ success: true, message: "Job updated", job });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    if (job.recruiter_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await job.destroy();

    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};