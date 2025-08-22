import { formatDateForStorage, showSection } from './utils.js';
import { isAuthenticated, authFetch } from './auth.js';

// API URL
const API_URL = '/api/journals';

function initializeJournalForm() {
    document.getElementById('diaryDate').valueAsDate = new Date();
    
    // Get the form element
    const diaryForm = document.getElementById('diaryForm');
    
    // Add event listener to form
    diaryForm.addEventListener('submit', saveDiaryEntry);
}

// Save a new diary entry
async function saveDiaryEntry(event) {
    event.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
        alert('Please sign in to save a journal entry.');
        return;
    }
    
    const date = document.getElementById('diaryDate').value;
    const title = document.getElementById('diaryTitle').value;
    const color = document.getElementById('pageColor').value;
    const content = document.getElementById('diaryContent').value;
    
    const entry = {
        date,
        title,
        color,
        content
    };
    
    try {
        const response = await authFetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });
        
        if (response.ok) {
            diaryForm.reset();
            document.getElementById('diaryDate').valueAsDate = new Date();
            alert('Journal entry saved successfully!');
        } else {
            const data = await response.json();
            alert(`Error: ${data.message || 'Failed to save journal entry'}`);
        }
    } catch (error) {
        console.error('Error saving journal entry:', error);
        alert('Failed to save journal entry. Please try again later.');
    }
}

export {
    initializeJournalForm,
    saveDiaryEntry
};
