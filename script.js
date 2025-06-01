
const SHEET_URL = 'https://api.sheetbest.com/sheets/1c8787ca-bc39-458a-9a7d-e71ae164779f'; // Sheet.best URL

let sheetData = [];
let selectedIndex = null;

function fetchData() {
  fetch(SHEET_URL)
    .then((res) => res.json())
    .then((data) => {
      sheetData = data;
      renderList();
    });
}

function renderList() {
  const container = document.getElementById("data-container");
  container.innerHTML = "";
  sheetData.forEach((row, index) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<button onclick="openDetail(${index})">${row["Batch ID"]} (${row["Date Bag Cut"]})</button>`;
    container.appendChild(div);
  });
}

function openDetail(index) {
  selectedIndex = index;
  const row = sheetData[index];
  document.getElementById("detail-batch-id").innerText = `Batch ID: ${row["Batch ID"]}`;
  document.getElementById("detail-date-bag-cut").innerText = row["Date Bag Cut"] || "N/A";

  const flushes = ["F1", "F2", "F3"];
  const nextFlush = flushes.find(flush => !row[`Date Harvested (${flush})`] && !row[`Yield (lbs) (${flush})`]) || "F1";

  document.getElementById("flush-select").value = nextFlush;
  document.getElementById("harvest-date").valueAsDate = new Date();
  document.getElementById("yield-lbs").value = "";
  document.getElementById("notes").value = row["Notes"] || "";
  document.getElementById("complete-checkbox").checked = row["Complete"] === "Y";

  document.getElementById("data-container").classList.add("hidden");
  document.getElementById("detail-view").classList.remove("hidden");
}

function backToList() {
  document.getElementById("data-container").classList.remove("hidden");
  document.getElementById("detail-view").classList.add("hidden");
}

function submitUpdate() {
  const flush = document.getElementById("flush-select").value;
  const harvestDate = document.getElementById("harvest-date").value;
  const yieldLbs = document.getElementById("yield-lbs").value;
  const notes = document.getElementById("notes").value;
  const complete = document.getElementById("complete-checkbox").checked ? "Y" : "";

  const updateData = {};
  updateData[`Date Harvested (${flush})`] = harvestDate;
  updateData[`Yield (lbs) (${flush})`] = yieldLbs;
  updateData["Notes"] = notes;
  updateData["Complete"] = complete;

  const batchId = sheetData[selectedIndex]["Batch ID"];

  fetch(`${SHEET_URL}/Batch ID/${encodeURIComponent(batchId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Update successful!");
      fetchData();
      backToList();
    });
}

document.addEventListener("DOMContentLoaded", fetchData);
