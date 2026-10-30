// ===== Mobile menu: makes the hamburger button open and close the links =====

const menuButton = document.querySelector('button[aria-label="Open menu"]');
const mainNav = document.querySelector('nav[aria-label="Main navigation"]');
const desktopLinks = mainNav ? mainNav.querySelector("ul") : null;

if (menuButton && mainNav && desktopLinks) {
    // Build a dropdown panel that reuses the same links as the desktop menu
    const panel = document.createElement("div");
    panel.className = "hidden md:hidden bg-white border-t border-slate-200";
    panel.innerHTML = `<ul class="flex flex-col gap-3 px-6 py-4 text-sm font-medium">${desktopLinks.innerHTML}</ul>`;
    mainNav.appendChild(panel);

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
        const isHidden = panel.classList.toggle("hidden");
        menuButton.setAttribute("aria-expanded", String(!isHidden));
    });
}
