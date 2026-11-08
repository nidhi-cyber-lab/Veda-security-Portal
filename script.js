
console.log("Veda Security Portal Loaded!");

alert("Welcome to Veda Technology Security Portal");

function checkPhishing(answer) {

    let result = document.getElementById("quizResult");

    if (answer === "phishing") {

        result.innerHTML =
        "Correct! This email shows phishing warning signs.";

    } else {

        result.innerHTML =
        "Incorrect! This could be a phishing email.";

    }
}


// Store all calculated risks
let risks = [];

// Calculate security risk
async function calculateRisk() {
    let name = document.getElementById("riskName").value;
    let likelihood = parseInt(document.getElementById("likelihood").value);
    let impact = parseInt(document.getElementById("impact").value);

    let score = likelihood * impact;
    let level = "";

    if (score <= 5) {
        level = "Low";
    } else if (score <= 12) {
        level = "Medium";
    } else {
        level = "High";
    }

    try {
        let response = await fetch("/api/risks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                likelihood: likelihood,
                impact: impact,
                score: score,
                level: level
            })
        });

        let data = await response.json();

        document.getElementById("riskResult").textContent =
            "Risk Score: " + score + " - " + level +
            ". " + data.message;

    } catch (error) {
        document.getElementById("riskResult").textContent =
            "Could not save risk. Check backend.";
    }
}

// Update dashboard numbers
async function updateDashboard() {
    try {
        const response = await fetch("/api/risks");
        const risks = await response.json();

        let total = risks.length;
        let high = risks.filter(r => r.level === "High").length;
        let medium = risks.filter(r => r.level === "Medium").length;
        let low = risks.filter(r => r.level === "Low").length;

        document.getElementById("totalRisks").textContent = total;
        document.getElementById("highRisks").textContent = high;
        document.getElementById("mediumRisks").textContent = medium;
        document.getElementById("lowRisks").textContent = low;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateDashboard);
let riskChartInstance = null;

async function loadRiskChart() {
    try {
        const response = await fetch("/api/risks");
        const risks = await response.json();

        const high = risks.filter(r => r.level === "High").length;
        const medium = risks.filter(r => r.level === "Medium").length;
        const low = risks.filter(r => r.level === "Low").length;

        const canvas = document.getElementById("riskChart");

        if (!canvas || typeof Chart === "undefined") {
            console.log("Chart or canvas not found");
            return;
        }

        if (riskChartInstance) {
            riskChartInstance.destroy();
        }

        riskChartInstance = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: ["High Risk", "Medium Risk", "Low Risk"],
                datasets: [{
                    data: [high, medium, low],
                    backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

    } catch (error) {
        console.error("Chart error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadRiskChart);

function addAsset() {

    let name = document.getElementById("assetName").value.trim();
    let type = document.getElementById("assetType").value;
    let owner = document.getElementById("assetOwner").value.trim();
    let criticality = document.getElementById("criticality").value;

    if (name === "" || owner === "") {
        document.getElementById("assetMessage").textContent =
            "Please enter asset name and owner.";
        return;
    }

    let table = document.getElementById("assetTable");

    let row = document.createElement("tr");

    let values = [name, type, owner, criticality];

    values.forEach(function(value) {
        let cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    table.appendChild(row);

    document.getElementById("assetMessage").textContent =
        "Asset added successfully!";

    document.getElementById("assetName").value = "";
    document.getElementById("assetOwner").value = "";
}
function reportIncident(event) {
    event.preventDefault();

    let title = document.getElementById("incidentTitle").value;
    let type = document.getElementById("incidentType").value;
    let severity = document.getElementById("incidentSeverity").value;
    let description = document.getElementById("incidentDescription").value;

    let table = document.getElementById("incidentTable");
    let row = table.insertRow();

    [title, type, severity, description].forEach(function(value) {
        let cell = row.insertCell();
        cell.textContent = value;
    });

    document.getElementById("incidentMessage").textContent =
        "Incident reported successfully!";

    document.querySelector("#incident form").reset();
}
function checkBackend() {
    fetch("/api/status")
        .then(response => response.json())
        .then(data => {
            document.getElementById("backendResult").textContent =
                data.message;
        })
        .catch(error => {
            document.getElementById("backendResult").textContent =
                "Backend connection failed!";
        });
}
function checkBackend() {
    fetch("/api/status")
        .then(response => response.json())
        .then(data => {
            document.getElementById("backendResult").textContent =
                data.message;
        })
        .catch(error => {
            document.getElementById("backendResult").textContent =
                "Backend connection failed!";
        });
}