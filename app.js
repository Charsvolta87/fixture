// =========================
// app.js
// =========================
const flags = {

  "Argentina":"ar",
  "Brasil":"br",
  "Francia":"fr",
  "España":"es",
  "Portugal":"pt",
  "Alemania":"de",
  "México":"mx",
  "Uruguay":"uy",
  "Inglaterra":"gb",
  "Estados Unidos":"us",
  "Canadá":"ca",
  "Japón":"jp",
  "Corea del Sur":"kr",
  "Australia":"au",
  "Marruecos":"ma",
  "Arabia Saudita":"sa",
  "Croacia":"hr",
  "Colombia":"co",
  "Bélgica":"be",
  "Países Bajos":"nl",
  "Suiza":"ch",
  "Austria":"at",
  "Suecia":"se",
  "Noruega":"no",
  "Paraguay":"py",
  "Ecuador":"ec",
  "Ghana":"gh",
  "Panamá":"pa",
  "Senegal":"sn",
  "Egipto":"eg",
  "Irán":"ir",
  "Qatar":"qa",
  "Sudáfrica":"za",
  "Túnez":"tn",
  "Argelia":"dz",
  "Irak":"iq",
  "Jordania":"jo",
  "Nueva Zelanda":"nz",
  "Uzbekistán":"uz",
  "Turquía":"tr",
  "Escocia":"gb-sct",
  "República Checa":"cz",
  "Bosnia y Herzegovina":"ba",
  "Costa de Marfil":"ci",
  "Cabo Verde":"cv",
  "Curazao":"cw",
  "Haití":"ht",
  "República Democrática del Congo":"cd"

};
function getFlag(team){

  const code = flags[team];

  return `
    <img
      src="imagenes/flags/${code}.svg"
      class="flag"
      alt="${team}"
    >
  `;

}

const groupsContainer = document.getElementById("groups-container");
const matchesContainer = document.getElementById("matches-container");
let currentGroup = "ALL";

renderGroups();
renderMatches();
startCountdown();

function renderGroups(){

  Object.entries(groupsData).forEach(([groupName, group]) => {

    const card = document.createElement("div");
    card.className = "group-card";

    let teamsHTML = "";

    group.teams.forEach(team => {

      teamsHTML += `
        <div class="group-team">
          ${team}
        </div>
      `;

    });

    card.innerHTML = `
      <div class="group-title">
        Grupo ${groupName}
      </div>

      <div class="group-teams">
        ${teamsHTML}
      </div>
    `;

    groupsContainer.appendChild(card);

  });

}

   
function renderMatches(){

  matchesContainer.innerHTML = "";

  let filteredMatches = matches;

  if(currentGroup !== "ALL"){

    filteredMatches = matches.filter(
      match => match.group === currentGroup
    );

  }

  filteredMatches.forEach(match => {

    const card = document.createElement("div");

    card.className = "match-card";

    const statusClass =
      match.status === "finished"
      ? "status-finished"
      : "status-upcoming";

    const statusText =
      match.status === "finished"
      ? "FINALIZADO"
      : "PRÓXIMO";

    const score =
      match.homeScore !== null
      ? `${match.homeScore} - ${match.awayScore}`
      : "VS";

    card.innerHTML = `
      <div class="match-status ${statusClass}">
        ${statusText}
      </div>

      <div class="group-badge">
        GRUPO ${match.group}
      </div>

      <div class="teams">

        <div class="team">
          ${getFlag(match.home)}
          ${match.home}
        </div>

        <div class="score">
          ${score}
        </div>

        <div class="team">
          ${getFlag(match.away)}
          ${match.away}
        </div>

      </div>

      <div class="match-info">
        🏟 ${match.stadium}<br>
        🌎 ${match.city}<br>
        📅 ${match.date}<br>
        🕒 ${match.timeAR} (ARG)
      </div>
    `;

    matchesContainer.appendChild(card);

  });

}

function startCountdown(){

  const targetDate = new Date("2026-06-11T00:00:00");

  const countdown = document.getElementById("countdown");

  function update(){

    const now = new Date();

    const diff = targetDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (diff / (1000 * 60)) % 60
    );

    countdown.innerHTML = `
      ${days} DÍAS
      •
      ${hours} HS
      •
      ${minutes} MIN
    `;
  }

  update();

  setInterval(update, 60000);

}

const tabButtons =
  document.querySelectorAll(".tab-btn");

tabButtons.forEach(button => {

  button.addEventListener("click", () => {

    tabButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentGroup =
      button.dataset.group;

    renderMatches();

  });

});