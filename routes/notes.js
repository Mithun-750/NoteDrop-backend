const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Note = require('../models/Notes');
const FetchUser = require('../middleware/FetchUser');

// Validation middleware for creating a new note
const validateNote = [
    body('title', 'Enter a valid title between 3-25 characters').isLength({ min: 3, max: 25 }),
    body('description', 'Description is required').notEmpty()
];

// Route for creating a new note
router.post('/newnote', validateNote, FetchUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        const note = await new Note(req.body);
        note.user = req.user.id;
        note.save()
            .then(() => {
                res.send({
                    status: 200,
                    message: 'Note created successfully',
                    note,
                });
            })
            .catch((error) => {
                console.error("Error saving note:", error);
                res.status(500).json({ error: "Internal Server Error", message: error });
            });
    }
});

// Route for updating a note
router.put('/updatenote/:id', FetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Find the note by ID
        let note = await Note.findById(req.params.id);

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Check if the authenticated user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Update the note with the new data
        note.title = title;
        note.description = description;
        note.tag = tag;
        note.updated = Date.now();

        // Save the updated note
        note = await note.save();

        res.json({ status: 200, message: 'Note updated successfully', note });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Internal Server Error", message: error });
    }
});

// Route for deleting a note
router.delete('/deletenote/:id', FetchUser, async (req, res) => {
    try {
        // Find the note by ID
        const note = await Note.findById(req.params.id);

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Check if the authenticated user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Delete the note
        await Note.findByIdAndDelete(req.params.id);

        res.json({ status: 200, message: 'Note deleted successfully' });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Internal Server Error", message: error });
    }
});

// Route for fetching all notes
router.get('/getallnotes', FetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).select('-user');
        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes :", error);
        res.status(500).json({ error: "Internal Server Error", message: error });
    }
});

module.exports = router;
