
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

const form = document.getElementById("transaction-form");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");

let expenseChart;

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateDashboard() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    balanceElement.textContent =
        `Rs. ${(income - expense).toFixed(2)}`;

    incomeElement.textContent =
        `Rs. ${income.toFixed(2)}`;

    expenseElement.textContent =
        `Rs. ${expense.toFixed(2)}`;

    displayTransactions();
    updateChart();
}

function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    transactions.slice().reverse().forEach(transaction => {

        const div = document.createElement("div");
        div.className = "transaction";

        const details = document.createElement("div");
        const name = document.createElement("strong");
        const category = document.createElement("small");

        name.textContent = transaction.description;
        category.textContent = transaction.category;

        details.append(name, category);

        const amount = document.createElement("strong");
        amount.className = transaction.type === "income"
            ? "income-text"
            : "expense-text";

        amount.textContent =
            `${transaction.type === "income" ? "+" : "-"} Rs. ${transaction.amount.toFixed(2)}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            transactions = transactions.filter(
                item => item.id !== transaction.id
            );

            saveTransactions();
            updateDashboard();
        });

        div.append(details, amount, deleteButton);
        transactionList.appendChild(div);
    });
}

function updateChart() {

    const categories = {};

    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            categories[transaction.category] =
                (categories[transaction.category] || 0)
                + transaction.amount;

        }
    });

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(
        document.getElementById("expenseChart"),
        {
            type: "doughnut",

            data: {
                labels: Object.keys(categories),

                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        "#38bdf8",
                        "#818cf8",
                        "#4ade80",
                        "#fb7185",
                        "#facc15"
                    ],
                    borderWidth: 0
                }]
            },

            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: "#ffffff"
                        }
                    }
                }
            }
        }
    );
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description =
        document.getElementById("description").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const type =
        document.getElementById("type").value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        description,
        amount,
        category,
        type
    };

    transactions.push(transaction);

    saveTransactions();
    updateDashboard();

    form.reset();
});

updateDashboard();
