// Main Application File
import { showSection } from './utils.js';
import { initializeJournalForm } from './journal-create.js';
import { initializeJournalViewer, loadDiaryEntries } from './journal-view.js';
import { initializeSearch } from './journal-search.js';
import { initializeWelcomeSection } from './welcome.js';
import { initializeAuth, isAuthenticated } from './auth.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const newDiaryBtn = document.getElementById('newDiaryBtn');
    const viewDiaryBtn = document.getElementById('viewDiaryBtn');
    const searchDiaryBtn = document.getElementById('searchDiaryBtn');
    const backBtn = document.getElementById('backBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // Section Elements
    const welcomeSection = document.getElementById('welcomeSection');
    const newDiarySection = document.getElementById('newDiarySection');
    const viewDiarySection = document.getElementById('viewDiarySection');
    const searchDiarySection = document.getElementById('searchDiarySection');
    const diaryViewer = document.getElementById('diaryViewer');

    // Form & Content Elements
    const entriesList = document.getElementById('entriesList');
    const searchDate = document.getElementById('searchDate');
    const searchDayType = document.getElementById('searchDayType');
    const searchResult = document.getElementById('searchResult');
    const viewerContent = document.getElementById('viewerContent');

    // Make these available globally
    window.welcomeSection = welcomeSection;
    window.newDiarySection = newDiarySection;
    window.viewDiarySection = viewDiarySection;
    window.searchDiarySection = searchDiarySection;
    window.diaryViewer = diaryViewer;

    // Initialize modules
    initializeJournalForm();
    initializeJournalViewer(entriesList, viewerContent, diaryViewer);
    initializeSearch(searchDate, searchDayType, searchResult, diaryViewer, clearSearchBtn);
    initializeWelcomeSection();
    initializeAuth();  // Initialize authentication

    // Set up event listeners for navigation
    newDiaryBtn.addEventListener('click', () => showSection(newDiarySection));
    viewDiaryBtn.addEventListener('click', () => {
        showSection(viewDiarySection);
        loadDiaryEntries();
    });
    searchDiaryBtn.addEventListener('click', () => showSection(searchDiarySection));
    backBtn.addEventListener('click', () => showSection(viewDiarySection));

    // Initially show the welcome section
    showSection(welcomeSection);
});
