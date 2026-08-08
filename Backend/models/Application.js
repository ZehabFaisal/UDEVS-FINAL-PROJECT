const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "jobs", key: "id" },
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "under_review",
        "interview_scheduled",
        "rejected",
        "hired"
      ),
      allowNull: false,
      defaultValue: "new",
    },
    ai_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 100 },
    },
    ai_analysis: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "applications",
  }
);

module.exports = Application;
