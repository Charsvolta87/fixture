// =========================
// admin/generator.js
// =========================

const data = {};

function addMatch(){

  const group = document.getElementById("group").value;
  const home = document.getElementById("home").value;
  const away = document.getElementById("away").value;
  const homeScore = Number(document.getElementById("homeScore").value);
  const awayScore = Number(document.getElementById("awayScore").value);
  const stadium = document.getElementById("stadium").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const status = document.getElementById("status").value;

  if(!data[group]){

    data[group] = {
      standings: [],
      matches: []
    };

  }

  data[group].matches.push({
    home,
    away,
    homeScore,
    awayScore,
    stadium,
    date,
    time,
    status
  });

  updatePreview();

}

function updatePreview(){

  const preview = document.getElementById("preview");

  preview.textContent =
`const groupsData = ${JSON.stringify(data, null, 2)};`;

}

function downloadJS(){

  const content =
`const groupsData = ${JSON.stringify(data, null, 2)};`;

  const blob = new Blob([content], {
    type:"application/javascript"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "groups.js";

  a.click();

  URL.revokeObjectURL(url);

}