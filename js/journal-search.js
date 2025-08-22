import { formatDate, formatDateForStorage, getDayTypeFromColor, showSection } from './utils.js';
import { displayDiaryEntry } from './journal-view.js';
import { isAuthenticated, authFetch } from './auth.js';

// API URL
const API_URL = '/api/journals';

// Reference to HTML elements
let searchDate;
let searchDayType;
let searchResult;
let diaryViewer;

function initializeSearch(searchDateElem, searchDayTypeElem, searchResultElem, diaryViewerElem, clearSearchBtn) {
    searchDate = searchDateElem;
    searchDayType = searchDayTypeElem;
    searchResult = searchResultElem;
    diaryViewer = diaryViewerElem;

    // Initialize date picker
    flatpickr(searchDate, {
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            searchDiaries(selectedDates[0], searchDayType.value);
        }
    });

    // Add event listener for day type search
    searchDayType.addEventListener('change', () => {
        const selectedDate = searchDate._flatpickr ? searchDate._flatpickr.selectedDates[0] : null;
        searchDiaries(selectedDate, searchDayType.value);
    });

    // Add event listener for clear search button
    clearSearchBtn.addEventListener('click', () => {
        searchDate._flatpickr.clear();
        searchDayType.value = '';
        searchResult.innerHTML = '';
    });
}

// Search for diary entries by date and/or day type
async function searchDiaries(date, dayType) {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        searchResult.innerHTML = '<p>Please sign in to search your journal entries.</p>';
        return;
    }
    
    if (!date && !dayType) {
        searchResult.innerHTML = '';
        return;
    }
    
    const dateStr = date ? formatDateForStorage(date) : null;
    
    try {
        // Clear previous results
        searchResult.innerHTML = '<p>Searching...</p>';
        
        // Build query parameters
        const params = new URLSearchParams();
        if (dateStr) params.append('date', dateStr);
        if (dayType) params.append('dayType', dayType);
        
        // Make API request
        const response = await authFetch(`${API_URL}/search?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to search journal entries');
        }
        
        const matchingEntries = await response.json();
        
        if (matchingEntries.length === 0) {
            const criteria = [];
            if (dateStr) criteria.push("date");
            if (dayType) criteria.push("day type");
            
            searchResult.innerHTML = `<p>No journal entries found matching the selected ${criteria.join(' and ')}.</p>`;
            return;
        }
        
        displaySearchResults(matchingEntries);
    } catch (error) {
        console.error('Error searching for journal entries:', error);
        searchResult.innerHTML = '<p>Failed to search for journal entries. Please try again later.</p>';
    }
}

// Display search results
function displaySearchResults(entries) {
    searchResult.innerHTML = '';
    
    // Add a header showing how many entries were found
    const foundMessage = document.createElement('p');
    foundMessage.className = 'success-message';
    foundMessage.textContent = `${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'} found!`;
    searchResult.appendChild(foundMessage);
    
    // Create a container for the entries
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results-container';
    
    // Add each entry to the container
    entries.forEach(entry => {
        const dayType = getDayTypeFromColor(entry.color);
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        entryCard.innerHTML = `
            <div class="entry-day-type">${dayType.icon} ${dayType.label}</div>
            <div class="entry-title">${entry.title}</div>
            <div class="entry-date">${formatDate(entry.date)}</div>
        `;
        
        entryCard.addEventListener('click', () => {
            displayDiaryEntry(entry);
            showSection(diaryViewer);
        });
        
        resultsContainer.appendChild(entryCard);
    });
    
    searchResult.appendChild(resultsContainer);
}

function displaySearchResult(entry) {
    displaySearchResults([entry]);
}

export {
    initializeSearch,
    searchDiaries,
    displaySearchResults,
    displaySearchResult
};
