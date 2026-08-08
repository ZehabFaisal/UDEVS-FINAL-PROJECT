const User = require("./User");
const RecruiterProfile = require("./RecruiterProfile");
const Job = require("./Job");
const Application = require("./Application");
const Interview = require("./Interview");

User.hasOne(RecruiterProfile, { foreignKey: "user_id", as: "recruiterProfile" });
RecruiterProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(Job, { foreignKey: "recruiter_id", as: "jobs" });
Job.belongsTo(User, { foreignKey: "recruiter_id", as: "recruiter" });

User.hasMany(Application, { foreignKey: "candidate_id", as: "applications" });
Application.belongsTo(User, { foreignKey: "candidate_id", as: "candidate" });

Job.hasMany(Application, { foreignKey: "job_id", as: "applications" });
Application.belongsTo(Job, { foreignKey: "job_id", as: "job" });

Application.hasOne(Interview, { foreignKey: "application_id", as: "interview" });
Interview.belongsTo(Application, { foreignKey: "application_id", as: "application" });

User.hasMany(Interview, { foreignKey: "interviewer_id", as: "interviews" });
Interview.belongsTo(User, { foreignKey: "interviewer_id", as: "interviewer" });

module.exports = { User, RecruiterProfile, Job, Application, Interview };