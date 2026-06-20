// contacts.js

document.addEventListener("DOMContentLoaded", () => {
    
    // Select all interactive cards (Portal Cards & Social Cards)
    const interactiveCards = document.querySelectorAll('.portal-card, .social-card');

    // Accessibility: Allow keyboard users to trigger links using Spacebar 
    // (Enter works natively on <a> tags, but Spacebar sometimes scrolls the page).
    interactiveCards.forEach(card => {
        card.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault(); // Prevent page scroll
                card.click(); // Trigger the native link behavior
            }
        });
    });

    // NOTE: 
    // - No "Expand" logic is included.
    // - No "Collapse" logic is included.
    // - No "Open Buttons" or "Details Toggles" are included.
    // The entire card acts natively as a standard <a> tag.
});