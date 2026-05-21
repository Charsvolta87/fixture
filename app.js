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

const knockoutContainer =
  document.getElementById(
    "knockout-container"
  );

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
renderKnockout();
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

  const getMatch = id =>
    knockout.find(match => match.id === id);

  // =========================
  // ORDEN FIFA REAL
  // =========================

  const left16 = [
    getMatch(74),
    getMatch(77),
    getMatch(73),
    getMatch(75),
    getMatch(83),
    getMatch(84),
    getMatch(81),
    getMatch(82)
  ];

  const left8 = [
    getMatch(89),
    getMatch(90),
    getMatch(93),
    getMatch(94)
  ];

  const left4 = [
    getMatch(97),
    getMatch(98)
  ];

  const leftSemi = [
    getMatch(101)
  ];

  // =========================

  const right16 = [
    getMatch(76),
    getMatch(78),
    getMatch(79),
    getMatch(80),
    getMatch(86),
    getMatch(88),
    getMatch(85),
    getMatch(87)
  ];

  const right8 = [
    getMatch(91),
    getMatch(92),
    getMatch(95),
    getMatch(96)
  ];

  const right4 = [
    getMatch(99),
    getMatch(100)
  ];

  const rightSemi = [
    getMatch(102)
  ];

  // =========================

  const finalMatch = getMatch(104);

  // =========================
  // CARD
  // =========================

  function createMatchHTML(match){

    if(!match) return "";

    let awayTeam = match.away;

    if(
      !awayTeam &&
      match.awayOptions &&
      match.awayOptions.length
    ){

      awayTeam =
        `3º ${match.awayOptions
          .map(team =>
            team.replace("3","")
          )
          .join("/")}`;

    }

    const score =
      match.homeScore !== null
      ? `${match.homeScore} - ${match.awayScore}`
      : "VS";

    return `

      <div class="bracket-match">

        <div class="match-id">
          PARTIDO ${match.id}
        </div>

        <div class="bracket-team">
          ${match.home}
        </div>

        <div class="bracket-score">
          ${score}
        </div>

        <div class="bracket-team">
          ${awayTeam}
        </div>

        <div class="bracket-info">

          🏟 ${match.stadium}<br>

          📅 ${match.date}<br>

          🕒 ${match.timeAR}

        </div>

      </div>

    `;

  }

  // =========================
  // HTML
  // =========================

  knockoutContainer.innerHTML = `

    <div class="fifa-bracket">

      <!-- LEFT -->

      <div class="bracket-side left-side">

        <div class="round round-16">
          ${left16.map(createMatchHTML).join("")}
        </div>

        <div class="round round-8">
          ${left8.map(createMatchHTML).join("")}
        </div>

        <div class="round round-4">
          ${left4.map(createMatchHTML).join("")}
        </div>

        <div class="round round-2">
          ${leftSemi.map(createMatchHTML).join("")}
        </div>

      </div>

      <!-- FINAL -->

      <div class="final-column">

        <div class="final-title">
          FINAL
        </div>

        ${createMatchHTML(finalMatch)}

      </div>

      <!-- RIGHT -->

      <div class="bracket-side right-side">

        <div class="round round-2">
          ${rightSemi.map(createMatchHTML).join("")}
        </div>

        <div class="round round-4">
          ${right4.map(createMatchHTML).join("")}
        </div>

        <div class="round round-8">
          ${right8.map(createMatchHTML).join("")}
        </div>

        <div class="round round-16">
          ${right16.map(createMatchHTML).join("")}
        </div>

      </div>

    </div>

  `;

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