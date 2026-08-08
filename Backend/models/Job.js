const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recruiter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    job_type: {
      type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Internship"),
      allowNull: false,
    },
    salary_min: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    salary_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "draft"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "jobs",
  }
);

module.exports = Job;
