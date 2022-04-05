const express = require("express");
const path = require("path");
const fs = require("fs");

// set up express app
const app = express();
// set up port
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let notes = require("./db/db.json");
const { stringify } = require("querystring");
const { json } = require("express");

// app routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// display notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
  });
});

// server listen
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

// new note
app.post("/api/notes", (req, res) => {
  let newNote = {
    id: id,
    title: req.body.title,
    text: req.body.text,
  };
  console.log(typeof notes);
  notes.push(newNote);
  const stringNote = JSON.stringify(notes);
  res.json(notes);
  fs.writeFile("./db/db.json", stringNote, (err) => {
      if (err) console.log(err);
      else {
          console.log("Note saved");
      }
  });
});

// delete note
app.delete("/api/notes/:id", (req, res) => {
    let noteID = req.params.id;
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        let updatedNotes = JSON.parse(data).filter((note) => {
            console.log("note.id", note.id);
            console.log("noteID", noteID);
            return note.id !== noteID;
        });

        notes = updatedNotes;
        const stringNote = JSON.stringify(updatedNotes);
        fs.writeFile("./db/db.json", stringNote, (err) => {
            if (err) console.log(err);
            else {
                console.log("Note deleted");
            }
        });
        res.json(stringNote);
    });
});

app.get("*", (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});