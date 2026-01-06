(function () {
  console.log("[TitanSelector] myscript.js loaded");

  const STORAGE_KEY = "player_titan_map";

  const titans = [
    "Dziewicza Orlica (51 lvl)",
    "Zabójczy Królik (70 lvl)",
    "Renegat Baulus (101 lvl)",
    "Piekielny Arcymag (131 lvl)",
    "Versus Zoons (154 lvl)",
    "Łowczyni Wspomnień (177 lvl)",
    "Przyzywacz Demonów (204 lvl)",
    "Maddok Magua (231 lvl)",
    "Tezcatlipoca (258 lvl)",
    "Barbatos Smoczy Strażnik (285 lvl)",
    "Tanroth (300 lvl)",
  ];

  function loadConfig() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  }

  function saveConfig(cfg) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }

  function waitForCharlist() {
    return new Promise((resolve) => {
      const i = setInterval(() => {
        if (
          window.Engine &&
          window.Engine.changePlayer &&
          window.Engine.changePlayer.charlist &&
          window.Engine.changePlayer.charlist.list &&
          Object.keys(window.Engine.changePlayer.charlist.list).length > 0
        ) {
          clearInterval(i);
          resolve(window.Engine.changePlayer.charlist.list);
        }
      }, 100);
    });
  }

  function createUI(players) {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.background = "#111";
    container.style.color = "#fff";
    container.style.padding = "10px";
    container.style.border = "1px solid #444";
    container.style.fontSize = "12px";
    container.style.width = "270px";

    const title = document.createElement("div");
    title.textContent = "Titan Selector";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";

    const playerSelect = document.createElement("select");
    playerSelect.style.width = "100%";
    playerSelect.style.marginBottom = "6px";

    Object.values(players).forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.nick;
      opt.textContent = `${p.nick} (${p.world}, ${p.lvl} lvl)`;
      playerSelect.appendChild(opt);
    });

    const titanSelect = document.createElement("select");
    titanSelect.style.width = "100%";
    titanSelect.style.marginBottom = "6px";

    titans.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      titanSelect.appendChild(opt);
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Zapisz przypisanie";
    saveBtn.style.width = "100%";

    const info = document.createElement("div");
    info.style.marginTop = "6px";
    info.style.fontSize = "11px";
    info.style.opacity = "0.85";

    const config = loadConfig();

    saveBtn.addEventListener("click", () => {
      config[playerSelect.value] = titanSelect.value;
      saveConfig(config);
      info.textContent = `Zapisano: ${playerSelect.value} → ${titanSelect.value}`;
    });

    container.appendChild(title);
    container.appendChild(playerSelect);
    container.appendChild(titanSelect);
    container.appendChild(saveBtn);
    container.appendChild(info);

    document.body.appendChild(container);
  }

  (async function start() {
    const players = await waitForCharlist();
    createUI(players);
    console.log("[TitanSelector] UI ready, players from Engine");
  })();
})();
