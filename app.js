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

    let rows = "";

    group.standings.forEach(team => {

      const diff = team.gf - team.ga;

      rows += `
        <tr>
          <td>${team.team}</td>
          <td>${team.pts}</td>
          <td>${diff}</td>
        </tr>
      `;
    });

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

  });

}

function renderMatches(){

  Object.values(groupsData).forEach(group => {

    group.matches.forEach(match => {

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

      card.innerHTML = `
        <div class="match-status ${statusClass}">
          ${statusText}
        </div>

        <div class="teams">

          <div class="team">
            ${match.home}
          </div>

          <div class="score">
            ${match.homeScore} - ${match.awayScore}
          </div>

          <div class="team">
            ${match.away}
          </div>

        </div>

        <div class="match-info">
          🏟 ${match.stadium}<br>
          📅 ${match.date} - ${match.time}
        </div>
      `;

      matchesContainer.appendChild(card);

    });

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