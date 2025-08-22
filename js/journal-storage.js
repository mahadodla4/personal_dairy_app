// Journal data handler for localStorage implementation
import { getCurrentUser } from './auth.js';

// Get user-specific journal key
function getUserJournalKey(userId) {
    return `journals_${userId}`;
}

// Get all journals for the current user
function getUserJournals() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return [];
    }
    
    const key = getUserJournalKey(currentUser.id);
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save a journal entry
function saveJournal(entry) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }
    
    const journals = getUserJournals();
    
    // Create a new entry with ID and user info
    const newEntry = {
        ...entry,
        _id: Date.now().toString(), // Create a unique ID
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    // Add to the beginning of the array for newest first
    journals.unshift(newEntry);
    
    // Save to localStorage
    const key = getUserJournalKey(currentUser.id);
    localStorage.setItem(key, JSON.stringify(journals));
    
    return newEntry;
}

// Delete a journal entry
function deleteJournal(id) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }
    
    const journals = getUserJournals();
    const updatedJournals = journals.filter(journal => journal._id !== id);
    
    // Save updated list to localStorage
    const key = getUserJournalKey(currentUser.id);
    localStorage.setItem(key, JSON.stringify(updatedJournals));
    
    return true;
}

// Find a journal entry by ID
function findJournalById(id) {
    const journals = getUserJournals();
    return journals.find(journal => journal._id === id);
}

// Find journal entries by date
function findJournalsByDate(date) {
    const journals = getUserJournals();
    return journals.filter(journal => journal.date === date);
}

// Find journal entries by criteria (date and/or day type)
function findJournalsByCriteria(dateStr, dayType) {
    const journals = getUserJournals();
    
    return journals.filter(entry => {
        const dateMatches = !dateStr || entry.date === dateStr;
        const typeMatches = !dayType || entry.color === dayType;
        
        return dateMatches && typeMatches;
    });
}

export {
    getUserJournals,
    saveJournal,
    deleteJournal,
    findJournalById,
    findJournalsByDate,
    findJournalsByCriteria
};
