require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./errorHandler");
const mongoose = require("mongoose");
const Note = require("./models/note");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/notes", (req, res) => {
  Note.find({}).then((result) => {
    res.status(200).json(result);
  });
});

app.get("/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.status(200).json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/notes", (req, res) => {
  const body = req.body;

  console.log("request received");

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((result) => {
    res.status(201).json(result);
  });
});

app.delete("/notes/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  Note.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/notes/:id", (req, res, next) => {
  const body = req.body;

  console.log("updating", body);

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
