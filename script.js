const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDaj-NudCmuJlOub-SyUs9KSFap7kw7YulE1guALEkEwpxuChaHh5dGF7pBGlAuQf76waLTK6cFgFj/pub?gid=252872015&single=true&output=csv';

let batches = [];
let selectedBatch = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    batches = parseCSV(csvText);
    renderBatchList();
  } catch (error) {
    console.error("Failed to fetch CSV data:", error);
    document.getElementById('batchList').innerText = 'Error loading data.';
  }
});

function parseCSV(text) {
  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows[0];
  return rows.slice(1).map(row =>
    Object.fromEntries(row.map((val, i) => [headers[i], val]))
  );
}

function renderBatchList() {
  const list = document.getElementById('batchList');
  list.innerHTML = '';
  batches.forEach((batch, index) => {
    const div = document.createElement('div');
    div.className = 'batch';
    div.innerHTML = `
      <strong>${batch["Batch ID"]}</strong>: ${batch["Mushroom Type"]} (${batch["Auto Status"]})
      <br><small>📅 Date Bag Cut: ${batch["Date Bag Cut"]}</small>
      <br><small>🌱 Projected Next Harvest: ${batch["Projected Next Harvest"]}</small>
    `;

    div.onclick = () => showDetail(index);
    list.appendChild(div);
  });
}

function showDetail(index) {
  selectedBatch = batches[index];
  document.getElementById('batchList').classList.add('hidden');
  document.getElementById('detailView').classList.remove('hidden');

  document.getElementById('detailBatchID').innerText = selectedBatch["Batch ID"];
  document.getElementById('detailType').innerText = selectedBatch["Mushroom Type"];
  document.getElementById('detailDateCut').innerText = selectedBatch["Date Bag Cut"];
  document.getElementById('detailFlush1').innerText = `${selectedBatch["Date Harvested (F1)"] || ''} | ${selectedBatch["Yield (lbs) (F1)"] || ''} lbs`;
  document.getElementById('detailFlush2').innerText = `${selectedBatch["Date Harvested (F2)"] || ''} | ${selectedBatch["Yield (lbs) (F2)"] || ''} lbs`;
  document.getElementById('detailFlush3').innerText = `${selectedBatch["Date Harvested (F3)"] || ''} | ${selectedBatch["Yield (lbs) (F3)"] || ''} lbs`;
  document.getElementById('detailNotes').innerText = selectedBatch["Notes"];
  document.getElementById('detailComplete').innerText = selectedBatch["Complete"] === 'Y' ? '✅ Complete' : '⬜ Incomplete';
}

function backToList() {
  document.getElementById('detailView').classList.add('hidden');
  document.getElementById('batchList').classList.remove('hidden');
}
