(function () {
  "use strict";

  console.log("[Addon] start");

  const WS_URL = "wss://margonem-backend-production.up.railway.app";
  const STORAGE_KEY = "player_titan_map";
  const alreadyCalled = [];

  /* ================= ENGINE WAIT ================= */

  function waitForEngine() {
    return new Promise((resolve) => {
      const i = setInterval(() => {
        if (
          window.Engine &&
          Engine.hero &&
          Engine.changePlayer &&
          Engine.changePlayer.charlist?.list &&
          window.API
        ) {
          clearInterval(i);
          resolve();
        }
      }, 100);
    });
  }

  /* ================= WEBSOCKET ================= */

  function connectWS() {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "register",
          nick: Engine.hero.nick,
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "titan-alert") {
        handleTitanAlert(data);
      }
    };

    return ws;
  }

  function handleTitanAlert(data) {
    const cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    for (const [charNick, titanName] of Object.entries(cfg)) {
      if (titanName === data.titan) {
        const char = Object.values(Engine.changePlayer.charlist.list).find(
          (c) => c.nick === charNick
        );

        if (char) {
          console.log("[Addon] switching to", char.nick);
          Engine.changePlayer.changePlayerRequest(char.id);
        }
      }
    }
  }

  /* ================= NPC DETECTION ================= */

  function setupNpcListener(ws) {
    API.addCallbackToEvent("newNpc", (npc) => {
      if (npc.d.wt > 79 && !alreadyCalled.includes(npc.d.nick)) {
        const tip = npc.tip?.[0] || "";

        if (tip.includes("tytan")) {
          alreadyCalled.push(npc.d.nick);

          ws.send(
            JSON.stringify({
              type: "titan-alert",
              from: Engine.hero.nick,
              titan: npc.d.nick,
              map: Engine.map.d.name,
            })
          );

          console.log("[Addon] titan detected:", npc.d.nick);
        }
      }
    });
  }

  /* ================= UI ================= */

  const TITANS = [
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

  function createUI() {
    const box = document.createElement("div");
    box.style = `
          position:fixed;
          top:80px;
          right:20px;
          background:#111;
          color:#fff;
          padding:10px;
          z-index:9999;
          font-size:12px;
      `;

    const charSelect = document.createElement("select");
    Object.values(Engine.changePlayer.charlist.list).forEach((p) => {
      const o = document.createElement("option");
      o.value = p.nick;
      o.textContent = `${p.nick} (${p.world}, ${p.lvl} lvl)`;
      charSelect.appendChild(o);
    });

    const titanSelect = document.createElement("select");
    TITANS.forEach((t) => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      titanSelect.appendChild(o);
    });

    const save = document.createElement("button");
    save.textContent = "Zapisz";
    save.onclick = () => {
      const cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      cfg[charSelect.value] = titanSelect.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      console.log("[Addon] saved", cfg);
    };

    box.append(charSelect, titanSelect, save);
    document.body.appendChild(box);
  }

  /* ================= START ================= */

  (async function () {
    await waitForEngine();
    const ws = connectWS();
    setupNpcListener(ws);
    createUI();
    console.log("[Addon] ready");
  })();
})();
