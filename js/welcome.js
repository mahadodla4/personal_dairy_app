// Update the quote randomly
function updateRandomQuote() {
    const quotes = [
        { text: "The diary is an art form just as much as the novel or the play. The diary simply requires a greater canvas.", author: "Henry Miller" },
        { text: "Write what should not be forgotten.", author: "Isabel Allende" },
        { text: "Journal writing is a voyage to the interior.", author: "Christina Baldwin" },
        { text: "People who keep journals have life twice.", author: "Jessamyn West" },
        { text: "A personal journal is an ideal environment in which to become.", author: "Jim Rohn" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const quoteElement = document.querySelector('.quote');
    const quoteAuthorElement = document.querySelector('.quote-author');
    
    if (quoteElement && quoteAuthorElement) {
        quoteElement.textContent = `"${randomQuote.text}"`;
        quoteAuthorElement.textContent = `— ${randomQuote.author}`;
    }
}

// Update welcome image
function updateWelcomeImage() {
    const welcomeImages = [
        '/static/images/p1.jpg',
        '/static/images/p2.jpg',
        '/static/images/p3.jpg',
        '/static/images/p4.jpg',
        '/static/images/p5.jpg',
        '/static/images/p6.jpg'
    ];
    
    const randomImage = welcomeImages[Math.floor(Math.random() * welcomeImages.length)];
    const welcomeImage = document.getElementById('welcomeImage');
    
    if (welcomeImage) {
        // Set a loading class
        welcomeImage.classList.add('loading');
        
        // Create a new image to test loading
        const testImg = new Image();
        
        // Handle successful load
        testImg.onload = function() {
            welcomeImage.src = randomImage;
            welcomeImage.classList.remove('loading');
        };
        
        testImg.src = randomImage;
    }
}

// Initialize welcome section
function initializeWelcomeSection() {
    updateRandomQuote();
    updateWelcomeImage();

    // Change image every 70 seconds
    setInterval(updateWelcomeImage, 70000);
}

export {
    initializeWelcomeSection,
    updateRandomQuote,
    updateWelcomeImage
};
