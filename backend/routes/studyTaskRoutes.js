import express from "express";
import StudyTask from "../models/StudyTask.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const studyTasks = await StudyTask.find().sort({ createdAt: -1 });
    res.json(studyTasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch study tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { subject, title, deadline } = req.body;

    if (!subject || !subject.trim() || !title || !title.trim() || !deadline) {
      return res
        .status(400)
        .json({ message: "Subject, title and deadline are required" });
    }

    const studyTask = await StudyTask.create({
      subject: subject.trim(),
      title: title.trim(),
      deadline,
      status: "Chưa làm"
    });

    res.status(201).json(studyTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to create study task" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTask = await StudyTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Study task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update study task" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await StudyTask.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Study task not found" });
    }

    res.json({ message: "Study task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete study task" });
  }
});
export default router;
