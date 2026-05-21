// =========================
// generator.js
// =========================

let currentMode = "groups";

const groupsData = [];
const knockoutData = [];

const modeButtons =
  document.querySelectorAll(".mode-btn");

modeButtons.forEach(button => {

  button.addEventListener("click", () => {

    modeButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentMode =
      button.dataset.mode;

    updatePreview();

  });

});

function addMatch(){

  const match = {

    id:Number(
      document.getElementById("matchId").value
    ),

    round:
      document.getElementById("group").value,

    home:
      document.getElementById("home").value,

    away:
      document.getElementById("away").value || null,

    awayOptions:
      document.getElementById("awayOptions")
      .value
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== ""),

    homeScore:
      document.getElementById("homeScore").value
      === ""
      ? null
      : Number(
          document.getElementById("homeScore").value
        ),

    awayScore:
      document.getElementById("awayScore").value
      === ""
      ? null
      : Number(
          document.getElementById("awayScore").value
        ),

    stadium:
      document.getElementById("stadium").value,

    city:
      document.getElementById("city").value,

    date:
      document.getElementById("date").value,

    timeAR:
      document.getElementById("time").value,

    status:
      document.getElementById("status").value

  };

  if(currentMode === "groups"){

    groupsData.push(match);

  }

  else{

    knockoutData.push(match);

  }

  updatePreview();

}

function updatePreview(){

  const preview =
    document.getElementById("preview");

  if(currentMode === "groups"){

    preview.textContent =
`const matches = ${JSON.stringify(groupsData, null, 2)};`;

  }

  else{

    preview.textContent =
`const knockout = ${JSON.stringify(knockoutData, null, 2)};`;

  }

}

function downloadJS(){

  let content = "";
  let filename = "";

  if(currentMode === "groups"){

    content =
`const matches = ${JSON.stringify(groupsData, null, 2)};`;

    filename = "matches.js";

  }

  else{

    content =
`const knockout = ${JSON.stringify(knockoutData, null, 2)};`;

    filename = "knockout.js";

  }

  const blob = new Blob(
    [content],
    {
      type:"application/javascript"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = filename;

  a.click();

  URL.revokeObjectURL(url);

}