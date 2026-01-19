let decks = {};
let activeDeck = null;
let currentIndex = 0;
let showingFront = true;

const deckSelect = document.getElementById("deckSelect");
const reviewSelect = document.getElementById("reviewSelect");
const deckGrid = document.getElementById("deckGrid");
const cardText = document.getElementById("cardText");
const reviewArea = document.getElementById("reviewArea");

function openTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(`tab-${name}`).classList.remove("hidden");
}

function save() {
  localStorage.setItem("flashDecks", JSON.stringify(decks));
}

function load() {
  const data = localStorage.getItem("flashDecks");
  if (data) decks = JSON.parse(data);
  updateUI();
}

function updateUI() {
  deckSelect.innerHTML = "";
  reviewSelect.innerHTML = "";
  deckGrid.innerHTML = "";

  Object.keys(decks).forEach(name => {
    deckSelect.add(new Option(name, name));
    reviewSelect.add(new Option(name, name));

    const card = document.createElement("div");
    card.className = "deck-card";
    card.innerHTML = `
      <div class="deck-content">
        <div class="deck-name">${name}</div>
        <div class="deck-actions">
          <button onclick="renameDeck('${name}')">Edit</button>
          <button onclick="deleteDeck('${name}')">Delete</button>
        </div>
      </div>
    `;
    deckGrid.appendChild(card);
  });
}

function createDeck() {
  const name = document.getElementById("deckName").value.trim();
  if (!name || decks[name]) return;
  decks[name] = [];
  save();
  updateUI();
  document.getElementById("deckName").value = "";
}

function deleteDeck(name) {
  if (confirm(`Delete deck "${name}"?`)) {
    delete decks[name];
    save();
    updateUI();
  }
}

function renameDeck(oldName) {
  const newName = prompt("New deck name:", oldName);
  if (!newName || decks[newName]) return;
  decks[newName] = decks[oldName];
  delete decks[oldName];
  save();
  updateUI();
}

function addCard() {
  const deck = deckSelect.value;
  const front = document.getElementById("frontText").value.trim();
  const back = document.getElementById("backText").value.trim();
  if (!deck || !front || !back) return;
  decks[deck].push({ front, back });
  save();
  document.getElementById("frontText").value = "";
  document.getElementById("backText").value = "";
}

function startReview() {
  activeDeck = reviewSelect.value;
  if (!activeDeck || decks[activeDeck].length === 0) return;
  currentIndex = 0;
  showingFront = true;
  reviewArea.classList.remove("hidden");
  updateCard();
}

function updateCard() {
  const card = decks[activeDeck][currentIndex];
  const text = showingFront ? card.front : card.back;
  cardText.textContent = text;
}

function flipCard() {
  showingFront = !showingFront;
  updateCard();
}

function nextCard() {
  currentIndex = (currentIndex + 1) % decks[activeDeck].length;
  showingFront = true;
  updateCard();
}

function prevCard() {
  currentIndex =
    (currentIndex - 1 + decks[activeDeck].length) % decks[activeDeck].length;
  showingFront = true;
  updateCard();
}

function exportData() {
  const blob = new Blob([JSON.stringify(decks, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "flashcards.json";
  link.click();
}

function importData(e) {
  const reader = new FileReader();
  reader.onload = () => {
    decks = JSON.parse(reader.result);
    save();
    updateUI();
  };
  reader.readAsText(e.target.files[0]);
}

document.getElementById("card").addEventListener("click", flipCard);

openTab("review");
load();
