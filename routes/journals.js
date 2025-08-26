const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const authenticate = require('../middleware/auth');

// Get all journal entries for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one journal entry by date for the logged-in user
router.get('/date/:date', authenticate, async (req, res) => {
  try {
    const entry = await Journal.findOne({ 
      date: req.params.date,
      user: req.userId 
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'No journal entry found for this date' });
    }
    
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create a new journal entry
router.post('/', authenticate, async (req, res) => {
  const originalContent = req.body.content;
  const entry = new Journal({
    date: req.body.date,
    title: req.body.title,
    color: req.body.color,
    content: originalContent,
    user: req.userId
  });

  try {
    const newEntry = await entry.save();
    // Return the entry with the original content
    const entryObj = newEntry.toObject();
    entryObj.content = originalContent;
    res.status(201).json(entryObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a journal entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found or you do not have permission to delete it' });
    }

    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search journal entries by date and/or day type
router.get('/search', authenticate, async (req, res) => {
  try {
    const query = { user: req.userId };
    
    // Add date filter if provided
    if (req.query.date) {
      query.date = req.query.date;
    }
    
    // Add day type (color) filter if provided
    if (req.query.dayType) {
      query.color = req.query.dayType;
    }
    
    const entries = await Journal.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
