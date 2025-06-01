
const SHEET_URL = 'https://api.sheetbest.com/sheets/1c8787ca-bc39-458a-9a7d-e71ae164779f'; // Sheet.best URL
let batches = [];
let selectedBatch = null;
let selectedIndex = -1;

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch(SHEET_URL);
  batches = await response.json();
  renderBatchList();
});

function renderBatchList() {
  const list = document.getElementById('batchList');
  list.innerHTML = '';
  batches.forEach((batch, index) => {
    const div = document.createElement('div');
    div.className = 'batch';
    div.innerHTML = `<strong>${batch["Batch ID"]}</strong>: ${batch["Mushroom Type"]} (${batch["Auto Status"]})`;
    div.onclick = () => showDetail(index);
    list.appendChild(div);
  });
}

function showDetail(index) {
  selectedBatch = batches[index];
  selectedIndex = index;
  document.getElementById('batchList').classList.add('hidden');
  document.getElementById('detailView').classList.remove('hidden');

  document.getElementById('harvestDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('yieldLbs').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('completeCheck').checked = selectedBatch["Complete"] === 'Y';

  const flushSelector = document.getElementById('flushSelector');
  if (!selectedBatch["Date Harvested (F1)"]) flushSelector.value = "F1";
  else if (!selectedBatch["Date Harvested (F2)"]) flushSelector.value = "F2";
  else flushSelector.value = "F3";
}

function backToList() {
  document.getElementById('detailView').classList.add('hidden');
  document.getElementById('batchList').classList.remove('hidden');
}

async function submitUpdate() {
  const flush = document.getElementById('flushSelector').value;
  const date = document.getElementById('harvestDate').value;
  const weight = document.getElementById('yieldLbs').value;
  const notes = document.getElementById('notes').value;
  const complete = document.getElementById('completeCheck').checked ? 'Y' : '';

  const update = {};
  update[`Date Harvested (${flush})`] = date;
  update[`Yield (lbs) (${flush})`] = weight;
  update["Notes"] = notes;
  update["Complete"] = complete;

  const id = selectedBatch["Batch ID"];
  const updateUrl = `${SHEET_URL}/Batch ID/${encodeURIComponent(id)}`;

  await fetch(updateUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  });

  alert('Update saved!');
  location.reload();
}
