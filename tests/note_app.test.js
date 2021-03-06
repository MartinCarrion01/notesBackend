const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Note = require("../models/note");

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

test("notes are returned as json", async () => {
  await api
    .get("/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/notes");

  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/notes");

  const contents = response.body.map((r) => r.content);
  expect(contents).toContain("Browser can execute only Javascript");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain("async/await simplifies making async calls");
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/notes").send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDb();

  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test("a note can be updated", async () => {
  const notesAtStart = await helper.notesInDb();

  const noteToUpdate = notesAtStart[0];

  const updatedNote = {
    ...noteToUpdate,
    important: !noteToUpdate.important,
  };

  const resultNote = await api
    .put(`/notes/${noteToUpdate.id}`)
    .send(updatedNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);

  const processedNoteToView = JSON.parse(JSON.stringify(updatedNote));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test("fails with statuscode 404 if note does not exist", async () => {
  const validNonexistingId = await helper.nonExistingId();

  console.log(validNonexistingId);

  await api.get(`/notes/${validNonexistingId}`).expect(404);
});

test("fails with statuscode 400 id is invalid", async () => {
  const invalidId = "5a3d5da59070081a82a3445";

  await api.get(`/notes/${invalidId}`).expect(400);
});

test("a note can be deleted", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

afterAll(() => {
  mongoose.connection.close();
});
