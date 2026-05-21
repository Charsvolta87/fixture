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

  const knockoutContainer =
  document.getElementById(
    "knockout-container"
  );

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

  groupsContainer.innerHTML = "";

  Object.entries(groupsData).forEach(([groupName, group]) => {

    const standings = {};

    // =========================
    // Crear estructura inicial
    // =========================

    group.teams.forEach(team => {

      standings[team] = {
        team,
        pts:0,
        pj:0,
        g:0,
        e:0,
        p:0,
        gf:0,
        gc:0,
        dif:0
      };

    });

    // =========================
    // Procesar partidos
    // =========================

    matches
      .filter(match => match.group === groupName)
      .forEach(match => {

        if(
          match.homeScore === null ||
          match.awayScore === null
        ) return;

        const home =
          standings[match.home];

        const away =
          standings[match.away];

        // PJ
        home.pj++;
        away.pj++;

        // GOLES
        home.gf += match.homeScore;
        home.gc += match.awayScore;

        away.gf += match.awayScore;
        away.gc += match.homeScore;

        // DIF
        home.dif = home.gf - home.gc;
        away.dif = away.gf - away.gc;

        // RESULTADO

        if(match.homeScore > match.awayScore){

          home.g++;
          away.p++;

          home.pts += 3;

        }

        else if(match.homeScore < match.awayScore){

          away.g++;
          home.p++;

          away.pts += 3;

        }

        else{

          home.e++;
          away.e++;

          home.pts += 1;
          away.pts += 1;

        }

      });

    // =========================
    // Ordenar tabla
    // =========================

    const sorted =
      Object.values(standings)
      .sort((a,b) => {

        if(b.pts !== a.pts)
          return b.pts - a.pts;

        return b.dif - a.dif;

      });

    // =========================
    // Render filas
    // =========================

    let rows = "";

    sorted.forEach((team,index) => {

      const qualified =
        index < 2
        ? "qualified"
        : "";

      rows += `
        <tr class="${qualified}">

          <td class="team-cell">
            ${getFlag(team.team)}
            ${team.team}
          </td>

          <td>${team.pts}</td>
          <td>${team.pj}</td>
          <td>${team.g}</td>
          <td>${team.e}</td>
          <td>${team.p}</td>
          <td>${team.gf}</td>
          <td>${team.gc}</td>
          <td>${team.dif}</td>

        </tr>
      `;

    });

    // =========================
    // CARD
    // =========================

    const card =
      document.createElement("div");

    card.className = "group-card";

    card.innerHTML = `
      <div class="group-title">
        Grupo ${groupName}
      </div>

      <div class="group-table-wrapper">

        <table class="standings">

        <thead>
          <tr>
            <th>Equipo</th>
            <th>PTS</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DIF</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>

      </table>
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

function renderKnockout(){

  knockoutContainer.innerHTML = "";

  const rounds = {};

  // =========================
  // AGRUPAR POR RONDA
  // =========================

  knockout.forEach(match => {

    if(!rounds[match.round]){

      rounds[match.round] = [];

    }

    rounds[match.round].push(match);

  });

  // =========================
  // RENDER
  // =========================

  Object.entries(rounds)
    .forEach(([roundName,matches]) => {

      const round =
        document.createElement("div");

      round.className =
        "knockout-round";

      let matchesHTML = "";

      matches.forEach(match => {

        let awayTeam =
          match.away;

        // =========================
        // VARIABLES FIFA
        // =========================

        if(
          !awayTeam &&
          match.awayOptions.length
        ){

          awayTeam =
            `3º(${match.awayOptions
              .map(team =>
                team.replace("3","")
              )
              .join("/")})`;

        }

        const score =
          match.homeScore !== null
          ? `${match.homeScore} - ${match.awayScore}`
          : "VS";

        matchesHTML += `

          <div class="knockout-card">

            <div class="match-status
              ${match.status === "finished"
                ? "status-finished"
                : "status-upcoming"
              }">

              ${
                match.status === "finished"
                ? "FINALIZADO"
                : "PRÓXIMO"
              }

            </div>

            <div class="group-badge">
              PARTIDO ${match.id}
            </div>

            <div class="teams">

              <div class="team">
                ${match.home}
              </div>

              <div class="score">
                ${score}
              </div>

              <div class="team">
                ${awayTeam}
              </div>

            </div>

            <div class="match-info">

              🏟 ${match.stadium}<br>

              🌎 ${match.city}<br>

              📅 ${match.date}<br>

              🕒 ${match.timeAR} (ARG)

            </div>

          </div>

        `;

      });

      round.innerHTML = `

        <div class="knockout-title">
          ${roundName}
        </div>

        <div class="knockout-grid">
          ${matchesHTML}
        </div>

      `;

      knockoutContainer.appendChild(round);

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

    renderGroups();
    renderMatches();
    renderKnockout();
    

  });

});