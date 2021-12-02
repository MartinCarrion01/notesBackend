const express = require("express");
const cors = require("cors");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/notes", (req, res) => {
  res.status(200).json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);
  note ? res.status(200).json(note) : res.status(404).end();
});

app.post("/notes", (req, res) => {
  const body = req.body;

  console.log("request received");

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  res.status(201).json(note);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
