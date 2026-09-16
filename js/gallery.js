/* ==========================================================================
   GALLERY MODULE
   ----------------------------------------------------------------------
   Renders WEDDING_CONFIG.gallery into the grid, and wires a simple,
   dependency-free lightbox for tapping a photo to view it larger.
   ========================================================================== */

const Gallery = {
  init() {
    this.grid = document.getElementById("gallery");
    this.lightbox = document.getElementById("lightbox");
    this.lightboxImage = document.getElementById("lightboxImage");
    this.lightboxCaption = document.getElementById("lightboxCaption");
    this.lightboxClose = document.getElementById("lightboxClose");

    if (!this.grid) return;

    this.render();
    this.bindLightbox();
  },

  render() {
    const items = WEDDING_CONFIG.gallery || [];
    const frag = document.createDocumentFragment();

    items.forEach((item, i) => {
      const fig = document.createElement("figure");
      fig.className = "gallery__item";
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", `View photo: ${item.caption || "wedding photo"}`);
      fig.dataset.index = i;

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "";
      img.loading = "lazy";

      fig.appendChild(img);
      frag.appendChild(fig);
    });

    this.grid.appendChild(frag);

    this.grid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (item) this.openLightbox(Number(item.dataset.index));
    });

    this.grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest(".gallery__item");
      if (item) {
        e.preventDefault();
        this.openLightbox(Number(item.dataset.index));
      }
    });
  },

  openLightbox(index) {
    const item = WEDDING_CONFIG.gallery[index];
    if (!item || !this.lightbox) return;

    this.lightboxImage.src = item.src;
    this.lightboxImage.alt = item.caption || "";
    this.lightboxCaption.textContent = item.caption || "";
    this.lightbox.classList.add("is-open");
    this.lightboxClose.focus();
    document.addEventListener("keydown", this._escHandler = (e) => {
      if (e.key === "Escape") this.closeLightbox();
    });
  },

  closeLightbox() {
    this.lightbox.classList.remove("is-open");
    document.removeEventListener("keydown", this._escHandler);
  },

  bindLightbox() {
    this.lightboxClose.addEventListener("click", () => this.closeLightbox());
    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });
  },
};