/* ==========================================================================
   WEDDING_CONFIG
   ----------------------------------------------------------------------
   Every piece of text, date, and link on the site is driven from this
   single object. To re-use this template for a new couple, this is the
   ONLY file you should need to edit.

   Replace placeholder values, save, and refresh — nothing else in the
   codebase references hard-coded names/dates.
   ========================================================================== */

const WEDDING_CONFIG = {

  // ---- Couple -------------------------------------------------------------
  couple: {
  partnerA: "Aasir",
  partnerB: "Sahra",
  monogram: "A & S",
  tagline: "Two hearts, one blessing",
},

  // ---- Hosts (the "invited by" line, optional — leave blank to hide) ------
  hosts: {
    line1: "Together with their families,",
    familyA: "Mr. & Mrs. Rashid Hassan",
    familyB: "Mr. & Mrs. Farouk Ahmed",
  },

  // ---- Opening verse (optional Qur'anic / poetic line, shown on hero) -----
  openingVerse: {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
    translation:
      "“And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them.”",
    reference: "— Surah Ar-Rum 30:21",
  },

  // ---- The big day ----------------------------------------------------------
  // ISO format, local time. Used by the countdown + "Add to Calendar".
  weddingDateISO: "2026-11-14T16:00:00",
  weddingDateDisplay: "Saturday, November 14th, 2026",

  // ---- Events (Nikah / Walima / any ceremony blocks) -----------------------
  events: [
    {
      name: "Nikah Ceremony",
      time: "4:00 PM",
      location: "The Emerald Hall",
      venueNote: "Crescent Gardens, Colombo",
    },
    {
      name: "Walima Reception",
      time: "7:30 PM",
      location: "The Grand Courtyard",
      venueNote: "Crescent Gardens, Colombo",
    },
  ],

  // ---- Venue (for the map + directions section) -----------------------------
  venue: {
    name: "Crescent Gardens",
    address: "142 Galle Road, Colombo 03, Sri Lanka",
    // Any standard Google Maps embed / share URL works here.
    mapEmbedUrl:
  "https://maps.google.com/maps?q=7.914577124930316,81.52199257874379&z=18&output=embed",

mapLinkUrl:
  "https://maps.app.goo.gl/GcAbZVYttypcwRim6",
  },

  // ---- Gallery ----------------------------------------------------------------
  // Replace `src` with real photo paths (e.g. "assets/gallery/01.jpg").
  // `caption` is optional and shown on tap in the lightbox.
  gallery: [
    { src: "assets/gallery/placeholder-1.svg", caption: "Engagement, Galle Fort" },
    { src: "assets/gallery/placeholder-2.svg", caption: "Sunset by the sea" },
    { src: "assets/gallery/placeholder-3.svg", caption: "Family gathering" },
    { src: "assets/gallery/placeholder-4.svg", caption: "The proposal" },
    { src: "assets/gallery/placeholder-5.svg", caption: "Henna evening" },
    { src: "assets/gallery/placeholder-6.svg", caption: "Together, always" },
  ],

  // ---- Background music ---------------------------------------------------
  music: {
    // Point this at a real audio file (mp3/ogg). Playback only starts
    // after the guest opens the envelope (browser autoplay policy +
    // it's a nicer reveal moment anyway).
    src: "assets/audio/wedding-nasheed.mp3",
    title: "Wedding Nasheed",
  },

  // ---- RSVP -----------------------------------------------------------------
rsvp: {
  // Where the form should submit.
  submitEndpoint: "",

  // Empty note field — only the placeholder will show.
  note: "",

  // Allow up to 10 guests.
  maxGuests: 10,
},

  // ---- Footer / contact -----------------------------------------------------
  contacts: [
    { label: "Aaliyah", phone: "+94770000001" },
    { label: "Zayd", phone: "+94770000002" },
  ],

  closingNote: "With love, gratitude, and full hearts.",
};