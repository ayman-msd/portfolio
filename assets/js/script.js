'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  sidebarBtn.setAttribute("aria-expanded", sidebar.classList.toggle("active"));
});



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// Page navigation
const navigation = document.querySelector(".navbar");
const mainContent = navigation.parentElement;
const sidebarDetails = sidebar.querySelector(".sidebar-info_more");
const desktopLayout = window.matchMedia("(min-width: 900px)");
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function placeNavigation() {
  const focusedLink = navigation.contains(document.activeElement) ? document.activeElement : null;
  if (desktopLayout.matches) sidebarDetails.before(navigation);
  else mainContent.prepend(navigation);
  focusedLink?.focus({ preventScroll: true });
}

placeNavigation();
desktopLayout.addEventListener("change", placeNavigation);

function showPage(pageName) {
  const target = [...pages].find(page => page.dataset.page === pageName);
  if (!target) return;

  pages.forEach(page => page.classList.toggle("active", page === target));
  navigationLinks.forEach(link => {
    const isCurrent = link.dataset.navLink === pageName;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const heading = target.querySelector("h2");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

navigationLinks.forEach(link => {
  link.addEventListener("click", () => showPage(link.dataset.navLink || link.textContent.trim().toLowerCase()));
});

document.querySelectorAll("[data-go-to]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.goTo));
});

// Certificate and education details
const detailDialog = document.querySelector(".detail-dialog");
const detailTitle = detailDialog.querySelector("#detail-title");
const detailMeta = detailDialog.querySelector(".detail-meta");
const detailDescription = detailDialog.querySelector(".detail-description");
const detailPreview = detailDialog.querySelector(".detail-preview");
const detailOriginal = detailDialog.querySelector(".detail-original");

function showDetails({ title, meta, description, image, original }) {
  detailTitle.textContent = title;
  detailMeta.textContent = meta;
  detailDescription.textContent = description;
  detailPreview.alt = original ? `Certificat : ${title}` : "";
  detailPreview.src = image;
  detailPreview.classList.toggle("detail-logo", !original);
  if (original) detailOriginal.href = original;
  else detailOriginal.removeAttribute("href");
  detailOriginal.hidden = !original;
  detailDialog.showModal();
  detailDialog.scrollTop = 0;
}

document.querySelectorAll(".blog-post-item > a").forEach(link => {
  link.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        typeof detailDialog.showModal !== "function") return;

    event.preventDefault();
    const title = link.querySelector(".blog-item-title").textContent.trim().replace(/\s+/g, " ");
    const issuer = link.querySelector(".blog-category").textContent;
    const date = link.querySelector("time").textContent;
    showDetails({
      title,
      meta: `${issuer} · Coursera · ${date}`,
      description: link.querySelector(".blog-text").textContent.trim().replace(/\s+/g, " "),
      image: link.href,
      original: link.href
    });
  });
});

document.querySelectorAll(".formation-trigger").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".content-card");
    showDetails({
      title: button.textContent,
      meta: card.querySelector(".formation-meta").textContent,
      description: card.querySelector(".formation-description").textContent,
      image: card.querySelector(".testimonials-avatar-box img").src
    });
  });
});

detailDialog.addEventListener("click", event => {
  if (event.target !== detailDialog) return;
  const { left, right, top, bottom } = detailDialog.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
    detailDialog.close();
  }
});

// The market-inspired graphic follows fine pointers within the hero.
const hero = document.querySelector("[data-hero]");
const reactiveMotion = window.matchMedia("(min-width: 641px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
let pointerFrame = 0;

function resetHeroMotion() {
  cancelAnimationFrame(pointerFrame);
  hero.style.removeProperty("--hero-x");
  hero.style.removeProperty("--hero-y");
}

hero.addEventListener("pointermove", event => {
  if (!reactiveMotion.matches || event.pointerType === "touch") return;

  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--hero-x", ((event.clientX - bounds.left) / bounds.width - .5) * 26 + "px");
    hero.style.setProperty("--hero-y", ((event.clientY - bounds.top) / bounds.height - .5) * 26 + "px");
  });
});

hero.addEventListener("pointerleave", resetHeroMotion);
reactiveMotion.addEventListener("change", resetHeroMotion);
