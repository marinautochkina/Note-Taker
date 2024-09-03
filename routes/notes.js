const express = require('express');
const notes = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

notes.use(express.json());

notes.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes' });
      }
      res.json(JSON.parse(data));
    });
  });

notes.post('/', (req, res) => {
    const { title, text } = req.body;
  const newNote = { id: uuidv4(), title: title, text: text };
  console.log("New note: ", newNote);

  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    const notes = JSON.parse(data);
    console.log(notes);
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

notes.delete('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes' });
      }
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== id);
      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete note' });
        }
        res.json({ message: 'Note deleted' });
      });
    });
  });
  
  // Catch-all route for HTML should be last to ensure API routes are not overridden
  notes.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });


  module.exports=notes;