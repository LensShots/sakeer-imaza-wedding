/* ==========================================================================
   MAIN ORCHESTRATOR
   ----------------------------------------------------------------------
   Boot order matters:
     1. Populate all DOM content from WEDDING_CONFIG (single source of truth)
     2. Init interactive modules (envelope, countdown, gallery, RSVP, music)
     3. Wire the scroll-reveal IntersectionObserver last, once real content
        heights exist, so reveal thresholds are calculated correctly.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- 1. Content population --------------------------------------------- */

  function populateContent() {
    const cfg = WEDDING_CONFIG;
    const coupleLine = `${cfg.couple.partnerA} &amp; ${cfg.couple.partnerB}`;
    const coupleLinePlain = `${cfg.couple.partnerA} & ${cfg.couple.partnerB}`;

    // Envelope


    // Hero
    setHTML("heroMonogramText", cfg.couple.monogram.replace("&", "&amp;"));
    setHTML("heroHosts", `${cfg.hosts.line1}<br>${cfg.hosts.familyA} and ${cfg.hosts.familyB}`);
    setHTML("heroNames", coupleLine);
    setText("heroDate", cfg.weddingDateDisplay);
    setText("verseArabic", cfg.openingVerse.arabic);
    setText("verseTranslation", cfg.openingVerse.translation);
    setText("verseRef", cfg.openingVerse.reference);

    // Countdown caption
    setText("countdownUntil", `Until ${cfg.weddingDateDisplay}`);

    // Events
    const eventsList = document.getElementById("eventsList");
    if (eventsList) {
      eventsList.innerHTML = "";
      cfg.events.forEach((ev) => {
        const card = document.createElement("div");
        card.className = "event-card corner-ornament";
        card.innerHTML = `
          <h3 class="event-card__name">${ev.name}</h3>
          <p class="event-card__meta">
            <span class="event-card__time">${ev.time}</span>
            <span>${ev.location}</span>
            <span>${ev.venueNote}</span>
          </p>`;
        eventsList.appendChild(card);
      });
    }

    // Add-to-calendar (generates a .ics data URI on the fly — no server needed)
    const calLink = document.getElementById("addToCalendar");
    if (calLink) calLink.href = buildCalendarLink(cfg);

    // Venue
    setText("venueName", cfg.venue.name);
    setText("venueAddress", cfg.venue.address);
    const mapFrame = document.getElementById("venueMapFrame");
    if (mapFrame) mapFrame.src = cfg.venue.mapEmbedUrl;
    const dirLink = document.getElementById("venueDirectionsLink");
    if (dirLink) dirLink.href = cfg.venue.mapLinkUrl;

    // RSVP
    setText("rsvpNote", cfg.rsvp.note);

    // Footer
    setHTML("footerNames", coupleLine);
    setText("footerDate", formatShortDate(cfg.weddingDateISO));
    setText("footerNote", cfg.closingNote);

    const contactsEl = document.getElementById("footerContacts");
    if (contactsEl) {
      contactsEl.innerHTML = "";
      cfg.contacts.forEach((c) => {
        const a = document.createElement("a");
        a.href = `tel:${c.phone}`;
        a.textContent = c.label;
        a.className = "footer__contact-link";
        contactsEl.appendChild(a);
      });
    }

    document.title = `${coupleLinePlain} — Wedding Invitation`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }
  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.innerHTML = value;
  }

  function formatShortDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd} · ${mm} · ${yy}`;
  }

  function buildCalendarLink(cfg) {
    const start = new Date(cfg.weddingDateISO);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // default 3hr block
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${cfg.couple.partnerA} & ${cfg.couple.partnerB}'s Wedding`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `LOCATION:${cfg.venue.name}, ${cfg.venue.address}`,
      `DESCRIPTION:${cfg.events.map((e) => `${e.name} — ${e.time}`).join("\\n")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return "data:text/calendar;charset=utf8," + encodeURIComponent(ics);
  }

  /* ---- 2. Scroll reveal ----------------------------------------------------- */

  function initScrollReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Small staggered delay for elements that reveal together within the
    // same section, so groups feel choreographed rather than simultaneous.
    const groups = new Map();
    targets.forEach((el) => {
      const parent = el.closest("section, footer");
      const list = groups.get(parent) || [];
      list.push(el);
      groups.set(parent, list);
    });
    groups.forEach((list) => {
      list.forEach((el, i) => {
        el.style.setProperty("--reveal-delay", `${Math.min(i * 90, 270)}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ---- 3. Boot ---------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
  populateContent();
  Envelope.init();
  Countdown.init();
  Gallery.init();
  RSVP.init();
  Music.init();
  initScrollReveal();

  /* ---------------------------------------------------------
     ENVELOPE → HERO
     Always reveal the invitation from the TOP.
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
   ENVELOPE → HERO
   Instant Hero — no fade, no delay
--------------------------------------------------------- */

window.addEventListener("envelope:opened", () => {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  const hero = document.getElementById("hero");

  if (hero) {
    hero.classList.remove("is-fading");
    hero.classList.add("is-visible");

    hero.style.cssText += `
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      transition: none !important;
    `;

    hero.querySelectorAll(".hero__layer").forEach(layer => {
      layer.style.cssText += `
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        filter: none !important;
        animation: none !important;
        transition: none !important;
      `;
    });
  }

});
});
})();

/* ==========================================================================
   VENUE VIDEO SCROLL CONTROL
   ========================================================================== */

(function () {
  "use strict";

  const venueSection = document.getElementById("venueSection");
  const venueVideo = document.getElementById("venueVideo");

  if (!venueSection || !venueVideo) return;

  let venueWasVisible = false;

  const venueObserver = new IntersectionObserver(
    function (entries) {
      const entry = entries[0];

      if (entry.isIntersecting) {
        if (!venueWasVisible) {
          venueVideo.currentTime = 0;

          const playPromise = venueVideo.play();

          if (playPromise !== undefined) {
            playPromise.catch(function () {
              /* Browser may require user interaction before playback */
            });
          }

          venueWasVisible = true;
        }
      } else {
        venueVideo.pause();
        venueVideo.currentTime = 0;
        venueWasVisible = false;
      }
    },
    {
      threshold: 0.6
    }
  );

  venueObserver.observe(venueSection);
})();

/* ==========================================================================
   LENSHOTS PHOTOGRAPHY CAROUSEL
   ========================================================================== */

(function () {
  "use strict";

  const gallery = document.querySelector(".lensshots-gallery");
  const photos = document.querySelectorAll(".lensshots-gallery__item");

  if (!gallery || !photos.length) return;

  let current = 0;
  let startX = 0;
  let isDragging = false;

  function updateCarousel() {
    const total = photos.length;

    photos.forEach((photo, index) => {

      photo.classList.remove(
        "is-center",
        "is-left",
        "is-right",
        "is-hidden-left",
        "is-hidden-right"
      );

      let difference = index - current;

      if (difference > total / 2) {
        difference -= total;
      }

      if (difference < -total / 2) {
        difference += total;
      }

      if (difference === 0) {
        photo.classList.add("is-center");

      } else if (difference === -1) {
        photo.classList.add("is-left");

      } else if (difference === 1) {
        photo.classList.add("is-right");

      } else if (difference < -1) {
        photo.classList.add("is-hidden-left");

      } else {
        photo.classList.add("is-hidden-right");
      }
    });
  }

  function nextPhoto() {
    current = (current + 1) % photos.length;
    updateCarousel();
  }

  function previousPhoto() {
    current = (current - 1 + photos.length) % photos.length;
    updateCarousel();
  }


  /* ============================================================
     TOUCH SWIPE — FAST RESPONSE
     ============================================================ */

  gallery.addEventListener(
    "touchstart",
    function (event) {
      startX = event.touches[0].clientX;
      isDragging = true;
    },
    { passive: true }
  );

  gallery.addEventListener(
    "touchmove",
    function (event) {

      if (!isDragging) return;

      const currentX = event.touches[0].clientX;
      const difference = currentX - startX;

      /* Respond as soon as swipe is obvious */
      if (Math.abs(difference) >= 25) {

        isDragging = false;

        if (difference < 0) {
          nextPhoto();
        } else {
          previousPhoto();
        }
      }

    },
    { passive: true }
  );

  gallery.addEventListener(
    "touchend",
    function () {
      isDragging = false;
    },
    { passive: true }
  );


  /* ============================================================
     MOUSE SWIPE — DESKTOP
     ============================================================ */

  gallery.addEventListener("mousedown", function (event) {
    startX = event.clientX;
    isDragging = true;
  });

  gallery.addEventListener("mousemove", function (event) {

    if (!isDragging) return;

    const difference = event.clientX - startX;

    if (Math.abs(difference) >= 25) {

      isDragging = false;

      if (difference < 0) {
        nextPhoto();
      } else {
        previousPhoto();
      }
    }
  });

  gallery.addEventListener("mouseup", function () {
    isDragging = false;
  });

  gallery.addEventListener("mouseleave", function () {
    isDragging = false;
  });


  updateCarousel();

})();

/* MUSIC CONTROL */
(function () {
  "use strict";

  const musicButton = document.getElementById("musicToggle");
  const music = document.getElementById("backgroundMusic");

  if (!musicButton || !music) return;

  musicButton.addEventListener("click", function () {
    if (music.paused) {
      music.play()
        .then(function () {
          musicButton.classList.add("is-playing");
          musicButton.textContent = "♫";
          musicButton.setAttribute("aria-label", "Pause background music");
          musicButton.setAttribute("aria-pressed", "true");
        })
        .catch(function (error) {
          console.warn("Music could not start:", error);
        });
    } else {
      music.pause();
      musicButton.classList.remove("is-playing");
      musicButton.textContent = "♫";
      musicButton.setAttribute("aria-label", "Play background music");
      musicButton.setAttribute("aria-pressed", "false");
    }
  });
})();

/* ==========================================================================
   NOTE: The Hero's visibility is handled once, permanently, by the
   `envelope:opened` handler above (it adds `.is-visible` and forces the
   layers to full opacity). A second IntersectionObserver used to live here,
   re-toggling `.is-fading` / `.is-visible` on every scroll past the Hero —
   that's what caused the Hero to blank out and re-render when scrolling
   back up. Removed; do not re-add a scroll/visibility watcher on #hero.
   ========================================================================== */