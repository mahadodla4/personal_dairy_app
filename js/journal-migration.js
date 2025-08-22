// This script will migrate existing journals from the API to the localStorage format
import { isAuthenticated, getCurrentUser } from './auth.js';
import { saveJournal } from './journal-storage.js';

async function migrateJournalsToLocalStorage() {
    // Only run if user is authenticated
    if (!isAuthenticated()) {
        return;
    }

    const currentUser = getCurrentUser();
    const key = `journals_migrated_${currentUser.id}`;
    
    // Check if we've already migrated for this user
    if (localStorage.getItem(key)) {
        return;
    }
    
    try {
        // Attempt to fetch journals from the API
        const response = await fetch('/api/journals');
        
        if (!response.ok) {
            throw new Error('Failed to fetch journals from API');
        }
        
        const journals = await response.json();
        
        if (journals.length === 0) {
            // No journals to migrate
            localStorage.setItem(key, 'true');
            return;
        }
        
        // Migrate each journal to localStorage
        journals.forEach(journal => {
            try {
                saveJournal({
                    date: journal.date,
                    title: journal.title,
                    color: journal.color,
                    content: journal.content
                });
            } catch (error) {
                console.error('Error migrating journal:', error);
            }
        });
        
        // Mark migration as complete
        localStorage.setItem(key, 'true');
        
        console.log(`Successfully migrated ${journals.length} journals to localStorage`);
    } catch (error) {
        console.error('Error during journal migration:', error);
    }
}

export { migrateJournalsToLocalStorage };
