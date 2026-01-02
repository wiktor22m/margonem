(function () {
  const Engine = window.Engine;

  function waitFor(getter, interval = 50) {
    return new Promise((resolve) => {
      const t = setInterval(() => {
        const v = getter();
        if (v) {
          clearInterval(t);
          resolve(v);
        }
      }, interval);
    });
  }

  (async () => {
    console.log("[myscript] start");

    const changePlayer = await waitFor(() =>
      Engine &&
      Engine.changePlayer &&
      typeof Engine.changePlayer.changePlayerRequest === "function"
        ? Engine.changePlayer
        : null
    );

    console.log("[myscript] changePlayer gotowy");

    // 🔥 IDENTYCZNE JAK W DEVTOOLS
    changePlayer.changePlayerRequest(180566);

    // === TU MOŻESZ DODAWAĆ WIĘCEJ LOGIKI ===
    // np. automatyczne kliknięcia, eventy itd.
  })();
})();
