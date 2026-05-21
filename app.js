// =========================
// app.js
// =========================

const groupsContainer = document.getElementById("groups-container");
const matchesContainer = document.getElementById("matches-container");

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

    card.innerHTML = `
      <div class="group-title">
        Grupo ${groupName}
      </div>

      <table class="standings">

        <thead>
          <tr>
            <th>Equipo</th>
            <th>PTS</th>
            <th>DIF</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>

      </table>
    `;

    groupsContainer.appendChild(card);

  

function renderMatches(){

  matches.forEach(match => {

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
          ${match.home}
        </div>

        <div class="score">
          ${score}
        </div>

        <div class="team">
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