// Format date for display
function formatDate(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// Format date for storage in consistent format
function formatDateForStorage(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return '';
    }
    
    // Format to YYYY-MM-DD ensuring consistent timezone handling
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Format content for HTML display
function formatContent(text) {
    // Replace line breaks with <br> tags for proper display
    return text.replace(/\n/g, '<br>');
}

// Determine day type from color
function getDayTypeFromColor(color) {
    switch(color) {
        case '#FFFFFF':
            return { label: 'Regular Day', icon: '📝' };
        case '#E3F2FD':
            return { label: 'Happy Day', icon: '😊' };
        case '#FFEBEE':
            return { label: 'Sad Day', icon: '😢' };
        case '#FFF8E1':
            return { label: 'Important Day', icon: '⭐' };
        case '#E8F5E9':
            return { label: 'Productive Day', icon: '✅' };
        case '#F3E5F5':
            return { label: 'Creative Day', icon: '🎨' };
        default:
            return { label: 'Regular Day', icon: '📝' };
    }
}

// Show or hide a section of the app
function showSection(section) {
    const sections = [
        welcomeSection, 
        newDiarySection, 
        viewDiarySection, 
        searchDiarySection, 
        diaryViewer
    ];

    // Hide all sections
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // Show selected section
    section.classList.add('active');
    section.style.display = 'block';
}

// Export functions
export {
    formatDate,
    formatDateForStorage,
    formatContent,
    getDayTypeFromColor,
    showSection
};
