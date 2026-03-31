import mongoose from "mongoose";

const studyTaskSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    deadline: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Chưa làm", "Đang làm", "Hoàn thành"],
      default: "Chưa làm"
    }
  },
  {
    timestamps: true
  }
);

const StudyTask = mongoose.model("StudyTask", studyTaskSchema);

export default StudyTask;
