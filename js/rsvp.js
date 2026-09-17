/* ==========================================================================
   RSVP MODULE
   ----------------------------------------------------------------------
   Handles the guest-count stepper, basic validation, and submission.
   If WEDDING_CONFIG.rsvp.submitEndpoint is set, posts there (works with
   Formspree-style endpoints out of the box). Otherwise shows a local
   "thank you" confirmation only — swap in your own backend call inside
   submit() if you need one.
   ========================================================================== */

const RSVP = {
  guestCount: 1,

  init() {
    this.form = document.getElementById("rsvpForm");
    if (!this.form) return;

    this.guestField = document.getElementById("guestField");
    this.guestValue = document.getElementById("guestValue");
    this.guestHidden = document.getElementById("rsvpGuests");
    this.minusBtn = document.getElementById("guestMinus");
    this.plusBtn = document.getElementById("guestPlus");
    this.statusEl = document.getElementById("rsvpStatus");
    this.submitBtn = document.getElementById("rsvpSubmit");

    this.maxGuests = (WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.maxGuests) || 6;

    this.bindAttendToggle();
    this.bindStepper();
    this.bindSubmit();
    this.updateGuestUI();
  },

  bindAttendToggle() {
    const radios = this.form.querySelectorAll('input[name="attending"]');
    radios.forEach((r) =>
      r.addEventListener("change", () => {
        const declining = this.form.querySelector('input[name="attending"]:checked').value === "no";
        this.guestField.style.display = declining ? "none" : "";
      })
    );
  },

  bindStepper() {
    this.minusBtn.addEventListener("click", () => {
      this.guestCount = Math.max(1, this.guestCount - 1);
      this.updateGuestUI();
    });
    this.plusBtn.addEventListener("click", () => {
      this.guestCount = Math.min(this.maxGuests, this.guestCount + 1);
      this.updateGuestUI();
    });
  },

  updateGuestUI() {
    this.guestValue.textContent = this.guestCount;
    this.guestHidden.value = this.guestCount;
    this.minusBtn.disabled = this.guestCount <= 1;
    this.plusBtn.disabled = this.guestCount >= this.maxGuests;
  },

  bindSubmit() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const nameInput = document.getElementById("rsvpName");
    const name = nameInput.value.trim();

    if (!name) {
      this.showStatus("Please share your name so we know who's joining us.", true);
      nameInput.focus();
      return;
    }

    const payload = {
      name,
      attending: this.form.querySelector('input[name="attending"]:checked').value,
      guests: this.guestHidden.value,
    };

    const endpoint = WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.submitEndpoint;

    this.submitBtn.disabled = true;
    this.submitBtn.textContent = "Sending…";

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Network response was not ok");
      }

      const isAttending = payload.attending === "yes";
      this.showStatus(
        isAttending
          ? `Thank you, ${name}! We can't wait to celebrate with you.`
          : `Thank you for letting us know, ${name}. You'll be in our hearts.`,
        false
      );
      this.form.reset();
      this.guestCount = 1;
      this.updateGuestUI();
    } catch (err) {
      this.showStatus("Something went wrong sending your RSVP — please try again, or reach us directly.", true);
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = "Send our RSVP";
    }
  },

  showStatus(message, isError) {
    this.statusEl.textContent = message;
    this.statusEl.classList.add("is-visible");
    this.statusEl.classList.toggle("is-error", !!isError);
  },
};

/* =========================================================
   RSVP — PREMIUM WHATSAPP MESSAGE
========================================================= */

(function () {
  "use strict";

  const rsvpForm = document.getElementById("rsvpForm");

  if (!rsvpForm) return;

  rsvpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const whatsappNumber = "94714195974";

    const name = document.getElementById("rsvpName").value.trim();

    const attending = document.querySelector(
      'input[name="attending"]:checked'
    );

    const guests = document.getElementById("rsvpGuests").value;

    const note = document.getElementById("rsvpNote").value.trim();

    const status = document.getElementById("rsvpStatus");

    if (!name) {
      status.textContent = "Please enter your full name.";
      return;
    }

    if (!attending) {
      status.textContent = "Please select your attendance.";
      return;
    }

    const isAttending = attending.value === "yes";

    const attendanceText = isAttending
      ? "Joyfully Accept"
      : "Regretfully Decline";

    const guestText = isAttending
      ? guests + (guests === "1" ? " Guest" : " Guests")
      : "Not attending";

    const message =
  "💍✨ WEDDING RSVP ✨💍\n\n" +
  "Dear Aasir & Sahra 🤍\n\n" +
  "👤 Name: " + name + "\n" +
  "💌 Attendance: " + attendanceText + "\n" +
  "👥 Guests: " + guestText + "\n" +
  "📝 Note: " + (note || "No additional note") + "\n\n" +
  "🌸 Thank you for your response.\n" +
  "We look forward to celebrating with you! 🥂✨";

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    status.textContent = "Opening WhatsApp...";

    window.open(whatsappURL, "_blank");
  });
})();