const Music = {
  init() {
    const button = document.getElementById("musicToggle");
    const audio = document.getElementById("bgAudio");

    if (!button || !audio) return;

    audio.loop = true;

    // Music starts when envelope opens
    window.addEventListener("envelope:opened", () => {
      audio.play()
        .then(() => {
          button.classList.add("is-playing");
          button.textContent = "Ⅱ";
        })
        .catch(() => {
          console.log("Browser blocked automatic music.");
        });
    });

    // Music button = pause / play
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (audio.paused) {
        audio.play()
          .then(() => {
            button.classList.add("is-playing");
            button.textContent = "Ⅱ";
          });
      } else {
        audio.pause();
        button.classList.remove("is-playing");
        button.textContent = "♫";
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Music.init();
});