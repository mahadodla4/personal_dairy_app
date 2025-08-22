import { formatDate, formatContent, getDayTypeFromColor, showSection } from './utils.js';
import { isAuthenticated, authFetch } from './auth.js';

// API URL
const API_URL = '/api/journals';

// Reference to HTML elements
let entriesList;
let viewerContent;
let diaryViewer;

function initializeJournalViewer(entriesListElem, viewerContentElem, diaryViewerElem) {
    entriesList = entriesListElem;
    viewerContent = viewerContentElem;
    diaryViewer = diaryViewerElem;
}

// Load all diary entries
async function loadDiaryEntries() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        entriesList.innerHTML = '<p>Please sign in to view your journal entries.</p>';
        return;
    }
    
    try {
        const response = await authFetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch journal entries');
        }
        
        const entries = await response.json();
        entriesList.innerHTML = '';
        
        if (entries.length === 0) {
            entriesList.innerHTML = '<p>No journal entries found.</p>';
            return;
        }
        
        entries.forEach(entry => {
            const dayType = getDayTypeFromColor(entry.color);
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card';
            entryCard.innerHTML = `
                <div class="entry-day-type">${dayType.icon} ${dayType.label}</div>
                <div class="entry-title">${entry.title}</div>
                <div class="entry-date">${formatDate(entry.date)}</div>
                <button class="delete-btn" data-id="${entry._id}">Delete</button>
            `;
            
            entryCard.addEventListener('click', (e) => {
                // If the delete button was clicked, don't display the entry
                if (e.target.classList.contains('delete-btn')) {
                    return;
                }
                displayDiaryEntry(entry);
            });
            
            const deleteBtn = entryCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the entry click event
                deleteEntry(entry._id);
            });
            
            entriesList.appendChild(entryCard);
        });
    } catch (error) {
        console.error('Error loading journal entries:', error);
        entriesList.innerHTML = '<p>Failed to load journal entries. Please try again later.</p>';
    }
}

// Display a single diary entry in full view
async function displayDiaryEntry(entry) {
    viewerContent.innerHTML = '';
    
    // Get day type based on color
    const dayType = getDayTypeFromColor(entry.color);
    
    const diaryPage = document.createElement('div');
    diaryPage.className = 'diary-page';
    diaryPage.style.backgroundColor = entry.color;
    
    diaryPage.innerHTML = `
        <div class="diary-header">
            <div class="day-type-badge">${dayType.icon} ${dayType.label}</div>
            <h2 class="diary-title">${entry.title}</h2>
            <div class="diary-date">${formatDate(entry.date)}</div>
        </div>
        <div class="diary-content">${formatContent(entry.content)}</div>
    `;
    
    viewerContent.appendChild(diaryPage);
    showSection(diaryViewer);
}

// Delete journal entry
async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
        return;
    }
    try {
        const response = await authFetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Journal entry deleted successfully!');
            loadDiaryEntries();
        } else {
            const data = await response.json();
            alert(`Error: ${data.message || 'Failed to delete journal entry'}`);
        }
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        alert('Failed to delete journal entry. Please try again later.');
    }
}

export {
    initializeJournalViewer,
    loadDiaryEntries,
    displayDiaryEntry,
    deleteEntry
};
