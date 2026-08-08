const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RecruiterProfile = sequelize.define(
  "RecruiterProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "users", key: "id" },
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("verified", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "recruiter_profiles",
  }
);

module.exports = RecruiterProfile;