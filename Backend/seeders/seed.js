const sequelize = require("../config/db");
const { User, RecruiterProfile, Job, Application, Interview } = require("../models");

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    await sequelize.sync({ force: true });
    console.log("Tables recreated");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@recruiterai.com",
      password_hash: "admin123",
      role: "admin",
    });
    console.log("Admin created:", admin.email);

    const recruiter1 = await User.create({
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      password_hash: "recruiter123",
      role: "recruiter",
    });

    await RecruiterProfile.create({
      user_id: recruiter1.id,
      company: "TechCorp Inc.",
      status: "verified",
    });

    const recruiter2 = await User.create({
      name: "Mike Chen",
      email: "mike@startupxyz.com",
      password_hash: "recruiter123",
      role: "recruiter",
    });
    await RecruiterProfile.create({
      user_id: recruiter2.id,
      company: "StartupXYZ",
      status: "pending",
    });
    console.log("Recruiters created");

    const candidate1 = await User.create({
      name: "Alice Williams",
      email: "alice@example.com",
      password_hash: "candidate123",
      role: "candidate",
    });
    const candidate2 = await User.create({
      name: "Zehab Faisal",
      email: "zehabfaisal2003@gmail.com",
      password_hash: "candidate123",
      role: "candidate",
    });
    const candidate3 = await User.create({
      name: "Carol Davis",
      email: "carol@example.com",
      password_hash: "candidate123",
      role: "candidate",
    });
    const candidate4 = await User.create({
      name: "Ali Ahmed",
      email: "ali_ahmed123@gmail.com",
      password_hash: "candidate123",
      role: "candidate",
    });
    console.log("Candidates created");

    const job1 = await Job.create({
      recruiter_id: recruiter1.id,
      title: "Senior Frontend Developer",
      category: "Engineering",
      location: "San Francisco, CA",
      job_type: "Full-time",
      salary_min: 120000,
      salary_max: 160000,
      description:
        "We are looking for a senior frontend developer with expertise in React, TypeScript, and modern web technologies. You will lead the frontend team in building scalable web applications.",
      requirements: [
        "5+ years of frontend development experience",
        "Expert in React and TypeScript",
        "Experience with state management (Redux, Zustand)",
        "Strong understanding of web performance optimization",
        "Experience with CI/CD pipelines",
      ],
      status: "active",
    });

    const job2 = await Job.create({
      recruiter_id: recruiter1.id,
      title: "Backend Engineer",
      category: "Engineering",
      location: "Remote",
      job_type: "Full-time",
      salary_min: 100000,
      salary_max: 140000,
      description:
        "Join our backend team to design and implement scalable APIs and microservices using Node.js and PostgreSQL.",
      requirements: [
        "3+ years of backend development experience",
        "Proficiency in Node.js and Express",
        "Experience with PostgreSQL or similar RDBMS",
        "Knowledge of RESTful API design",
        "Familiarity with Docker and cloud services",
      ],
      status: "active",
    });

    const job3 = await Job.create({
      recruiter_id: recruiter2.id,
      title: "Data Scientist",
      category: "Data",
      location: "New York, NY",
      job_type: "Full-time",
      salary_min: 110000,
      salary_max: 150000,
      description:
        "We need a data scientist to build ML models and analyze large datasets to drive business decisions.",
      requirements: [
        "MS or PhD in Computer Science, Statistics, or related field",
        "Experience with Python, scikit-learn, TensorFlow",
        "Strong SQL and data manipulation skills",
        "Experience with NLP and recommendation systems",
      ],
      status: "active",
    });

    const job4 = await Job.create({
      recruiter_id: recruiter1.id,
      title: "MERN Stack Developer",
      category: "Engineering",
      location: "Remote",
      job_type: "Full-time",
      salary_min: 90000,
      salary_max: 130000,
      description:
        "We are looking for a skilled MERN Stack Developer to build full-stack web applications using MongoDB, Express.js, React, and Node.js. You will work on both frontend and backend, building RESTful APIs and responsive user interfaces.",
      requirements: [
        "3+ years of experience with MERN stack",
        "Proficiency in React, Node.js, Express.js, MongoDB",
        "Experience with Redux or similar state management",
        "Knowledge of RESTful API design",
        "Experience with Git version control",
        "Familiarity with deployment on AWS or similar cloud platforms",
      ],
      status: "active",
    });

    const job5 = await Job.create({
      recruiter_id: recruiter2.id,
      title: "DevOps Intern",
      category: "IT Operations",
      location: "Austin, TX",
      job_type: "Internship",
      salary_min: 25000,
      salary_max: 40000,
      description:
        "Great opportunity for students to learn cloud infrastructure, CI/CD, and system administration.",
      requirements: [
        "Currently pursuing CS or related degree",
        "Basic knowledge of Linux",
        "Interest in cloud platforms (AWS, GCP)",
        "Good communication skills",
      ],
      status: "active",
    });
    console.log("Jobs created");

    const app1 = await Application.create({
      candidate_id: candidate1.id,
      job_id: job1.id,
      status: "interview_scheduled",
      ai_score: 85,
      ai_analysis: {
        strengths: [
          "Strong React experience",
          "TypeScript proficiency",
          "Good communication skills",
        ],
        developmentAreas: [
          "Could improve system design knowledge",
          "Cloud experience is limited",
        ],
        recommendation: "Hire",
      },
    });

    const app2 = await Application.create({
      candidate_id: candidate4.id,
      job_id: job2.id,
      status: "under_review",
      ai_score: 72,
      ai_analysis: {
        strengths: [
          "Solid Node.js experience",
          "Database management skills",
        ],
        developmentAreas: [
          "Needs more microservices experience",
          "Cloud certifications would help",
        ],
        recommendation: "Maybe",
      },
    });

    const app3 = await Application.create({
      candidate_id: candidate3.id,
      job_id: job3.id,
      status: "new",
    });

    const app4 = await Application.create({
      candidate_id: candidate1.id,
      job_id: job3.id,
      status: "new",
    });

    const app5 = await Application.create({
      candidate_id: candidate2.id,
      job_id: job4.id,
      status: "new",
      ai_score: 78,
      ai_analysis: {
        strengths: [
          "Full-stack MERN experience",
          "Strong React and Node.js skills",
          "Good API design knowledge",
        ],
        developmentAreas: [
          "Could improve testing practices",
          "More cloud deployment experience needed",
        ],
        recommendation: "Maybe",
      },
    });

    console.log("Applications created");

    await Interview.create({
      application_id: app1.id,
      interviewer_id: recruiter1.id,
      date: "2025-04-15",
      time: "10:00:00",
      location: "Google Meet",
      type: "Video-Call",
      status: "scheduled",
    });
    console.log("Interviews created");
    console.log("\n--- Seed Complete ---");
    console.log("Login credentials:");
    console.log("Admin:     admin@recruiterai.com / admin123");
    console.log("Recruiter: sarah@techcorp.com / recruiter123");
    console.log("Recruiter: mike@startupxyz.com / recruiter123");
    console.log("Candidate: alice@example.com / candidate123");
    console.log("Candidate: bob@example.com / candidate123");
    console.log("Candidate: carol@example.com / candidate123");
    process.exit(0);
  } 
  catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};
seed();