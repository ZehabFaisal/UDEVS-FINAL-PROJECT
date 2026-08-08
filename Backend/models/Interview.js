const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "applications", key: "id" },
    },
    interviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM(
        "Google Meet",
        "Zoom",
        "Microsoft Teams",
        "Office",
        "Phone"
      ),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("In-Person", "Video-Call", "Voice-Call"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "scheduled",
    },
  },
  {
    tableName: "interviews",
  }
);

module.exports = Interview;
