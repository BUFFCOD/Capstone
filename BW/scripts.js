// Placeholder for sync functionality
document.querySelector('.sync-button').addEventListener('click', () => {
    alert("Syncing data...");
});

// Chat button function
document.querySelector('.chat-button').addEventListener('click', () => {
    alert("Chat support is currently unavailable.");
});

// Get App button function
document.querySelector('.get-app-button').addEventListener('click', () => {
    alert("Redirecting to app download page...");
});


// Helper function to calculate payoff time
function calculatePayoffTime(balance, monthlyPayment, apr) {
    let monthlyInterestRate = apr / 12 / 100;
    let months = 0;
    let currentBalance = balance;

    while (currentBalance > 0) {
        let interest = currentBalance * monthlyInterestRate;
        currentBalance = currentBalance + interest - monthlyPayment;
        months++;
        if (currentBalance < 0) {
            currentBalance = 0; // No negative balance
        }
    }
    return months;
}

// Event listener for the calculate button
document.getElementById('calculatePayoff').addEventListener('click', () => {
    const balance = parseFloat(document.getElementById('balance').value);
    const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value);
    const apr = parseFloat(document.getElementById('apr').value);

    // Collect all subscriptions that are checked
    const subscriptions = Array.from(document.querySelectorAll('.subscription:checked')).map(sub => {
        return parseFloat(sub.getAttribute('data-amount'));
    });

    // Calculate the current payoff time
    const originalPayoffTime = calculatePayoffTime(balance, monthlyPayment, apr);

    // Simulate subscription cancellation: Add the savings to the monthly payment
    const totalSubscriptionSavings = subscriptions.reduce((sum, amount) => sum + amount, 0);
    const newMonthlyPayment = monthlyPayment + totalSubscriptionSavings;
    const newPayoffTime = calculatePayoffTime(balance, newMonthlyPayment, apr);

    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Original Payoff Time: ${originalPayoffTime} months</p>
        <p>New Payoff Time (after cancelling subscriptions): ${newPayoffTime} months</p>
    `;
});