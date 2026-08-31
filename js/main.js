(() => {
  const services = [
    {
      title: "Diagnosticare & reparații injectoare Common Rail",
      lead: "Orice injector Common Rail, orice marcă populară: demontare, curățare cu ultrasunete, măsurători pe banc și înlocuirea pieselor uzate.",
      price: "Diagnosticare: 200 lei (preț standard). Reparația se cotează după diagnosticare și o comunicăm telefonic înainte de lucrare.",
      bullets: [
        "Verificare debit, retur și pulverizare pe bancul de probă",
        "Curățare cu ultrasunete și înlocuire duze, ace, garnituri",
        "Codare/calibrare după reparație, acolo unde e necesară",
        "Raport clar cu ce s-a înlocuit și de ce",
        "Garanție 12 luni la lucrare"
      ]
    },
    {
      title: "Diagnosticare & reparații pompe de înaltă presiune",
      lead: "Pompe de injecție de înaltă presiune pentru majoritatea motorizărilor diesel — verificăm presiunea, regulatorul și uzura internă.",
      price: "Preț stabilit după diagnosticare, comunicat telefonic înainte de lucrare.",
      bullets: [
        "Test de presiune și debit pe stand",
        "Verificare regulator de presiune și supapă de dozare",
        "Înlocuire piese de uzură cu componente de calitate",
        "Testare finală în sarcină, ca pe mașină",
        "Garanție 12 luni la lucrare"
      ]
    },
    {
      title: "Testare pe bancul de probă",
      lead: "Nu ghicim: fiecare injector și fiecare pompă trece prin banc înainte și după reparație, cu valori măsurate.",
      price: "200 lei — preț standard pentru diagnosticarea setului de injectoare pe bancul de probă.",
      bullets: [
        "Aparatură de ultimă generație, calibrată",
        "Valori măsurate comparate cu specificația producătorului",
        "Îți arătăm rezultatul înainte și după reparație",
        "Verdict corect: se repară sau nu merită",
        "Rezultat în aceeași zi în majoritatea cazurilor"
      ]
    }
  ];

  const gallery = [
    {
      title: "Injectoare Common Rail — set de 4",
      beforeLabel: "[ FOTO ÎNAINTE<br>injector cocsat / duză înfundată<br>1600×1200px ]",
      afterLabel: "[ FOTO DUPĂ<br>același injector recondiționat<br>1600×1200px ]",
      caption: "Depuneri de calamină și pulverizare neuniformă la intrare. După curățare, înlocuirea pieselor de uzură și testarea pe banc, valorile au revenit în specificația producătorului."
    },
    {
      title: "Pompă de înaltă presiune",
      beforeLabel: "[ FOTO ÎNAINTE<br>pompă cu uzură internă<br>1600×1200px ]",
      afterLabel: "[ FOTO DUPĂ<br>pompă recondiționată și testată<br>1600×1200px ]",
      caption: "Presiune insuficientă din cauza uzurii interne. Recondiționată complet și testată în sarcină pe stand înainte de livrare."
    }
  ];

  // ── Modal open/close helpers ─────────────────────────────────────────
  // Reținem elementul care a deschis modalul ca să-i redăm focusul la închidere.
  let lastFocused = null;

  function showModal(overlay) {
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    document.body.classList.add("has-modal");
    const closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  // ── Service modal ────────────────────────────────────────────────────
  const serviceModal = document.getElementById("serviceModal");
  const serviceTitle = document.getElementById("serviceModalTitle");
  const serviceLead = document.getElementById("serviceModalLead");
  const serviceBullets = document.getElementById("serviceModalBullets");
  const servicePrice = document.getElementById("serviceModalPrice");

  function openServiceModal(index) {
    const s = services[index];
    if (!s || !serviceModal) return;
    serviceTitle.textContent = s.title;
    serviceLead.textContent = s.lead;
    servicePrice.textContent = s.price;
    serviceBullets.innerHTML = "";
    s.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.innerHTML = '<span class="modal-check">✓</span>' + b;
      serviceBullets.appendChild(li);
    });
    showModal(serviceModal);
  }

  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => openServiceModal(Number(btn.dataset.service)));
  });

  // ── Gallery modal ─────────────────────────────────────────────────────
  const galleryModal = document.getElementById("galleryModal");
  const galleryBefore = document.getElementById("galleryModalBefore");
  const galleryAfter = document.getElementById("galleryModalAfter");
  const galleryTitle = document.getElementById("galleryModalTitle");
  const galleryCaption = document.getElementById("galleryModalCaption");

  function openGalleryModal(index) {
    const g = gallery[index];
    if (!g || !galleryModal) return;
    galleryBefore.innerHTML = g.beforeLabel;
    galleryAfter.innerHTML = g.afterLabel;
    galleryTitle.textContent = g.title;
    galleryCaption.textContent = g.caption;
    showModal(galleryModal);
  }

  document.querySelectorAll("[data-gallery]").forEach((btn) => {
    btn.addEventListener("click", () => openGalleryModal(Number(btn.dataset.gallery)));
  });

  // ── Shared modal close (backdrop click, × button, Escape) ────────────
  const modals = [serviceModal, galleryModal].filter(Boolean);

  function closeAllModals() {
    if (!modals.some((m) => m.classList.contains("is-open"))) return;
    modals.forEach((m) => m.classList.remove("is-open"));
    document.body.classList.remove("has-modal");
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  modals.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Escape închide; Tab rămâne prins în interiorul modalului deschis.
  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
      return;
    }
    if (e.key !== "Tab") return;

    const open = modals.find((m) => m.classList.contains("is-open"));
    if (!open) return;

    const items = Array.from(open.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ── FAQ accordion (single item open at a time) ────────────────────────
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      faqItems.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq-sign").textContent = "+";
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        item.querySelector(".faq-sign").textContent = "−";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
