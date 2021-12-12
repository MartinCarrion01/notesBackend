const notesRouter = require("express").Router();
const User = require("../models/user");
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.status(200).json(notes);
});

notesRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(404).end();
  }
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndDelete(id);
  res.status(204).end();
});

notesRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
  });

  res.json(updatedNote);
});

module.exports = notesRouter;
