document.addEventListener('DOMContentLoaded', () => {
    const makeGuessForm = document.getElementById('makeGuessForm');
    const feedbackDiv = document.getElementById('feedback');


    makeGuessForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const guess = document.getElementById('guess').value;
        const playerName = document.getElementById('playerName').value;
        const response = await fetch('/makeGuess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `guess=${guess}&playerName=${playerName}`,
        });
        const result = await response.text();
        feedbackDiv.innerHTML= result;
        });
});
