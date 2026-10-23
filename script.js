/* ==========================================================
   TRAVELORA — COMPLETE JAVASCRIPT
   Dark Mode | RTL/LTR | Mobile Menu | Home Dropdown
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    /* --------------------------------------------------
       1. ELEMENTS
    -------------------------------------------------- */

    const html = document.documentElement;
    const body = document.body;

    const rtlBtn = document.getElementById("rtlBtn");
    const themeBtn = document.getElementById("themeBtn");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");

    const homeDropdownToggle =
        document.getElementById("homeDropdownToggle");

    const homeDropdown = document.querySelector(".home-dropdown");


    /* --------------------------------------------------
       2. DARK MODE / LIGHT MODE
    -------------------------------------------------- */

    function applyTheme(theme) {
        body.classList.toggle("dark-mode", theme === "dark");

        if (themeBtn) {
            themeBtn.setAttribute(
                "aria-pressed",
                String(theme === "dark")
            );

            themeBtn.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("travelora-theme") || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDark = body.classList.contains("dark-mode");
            const newTheme = isDark ? "light" : "dark";

            applyTheme(newTheme);

            try {
                localStorage.setItem("travelora-theme", newTheme);
            } catch (error) {
                // Theme still works for the current page.
            }
        });
    }


    /* --------------------------------------------------
       3. RTL / LTR DIRECTION
    -------------------------------------------------- */

    function applyDirection(direction) {
        html.setAttribute("dir", direction);

        if (rtlBtn) {
            rtlBtn.setAttribute(
                "aria-pressed",
                String(direction === "rtl")
            );

            rtlBtn.setAttribute(
                "aria-label",
                direction === "rtl"
                    ? "Switch to left-to-right layout"
                    : "Switch to right-to-left layout"
            );
        }
    }

    let savedDirection = "ltr";

    try {
        savedDirection =
            localStorage.getItem("travelora-direction") || "ltr";
    } catch (error) {
        savedDirection = "ltr";
    }

    applyDirection(savedDirection);

    if (rtlBtn) {
        rtlBtn.addEventListener("click", () => {
            const currentDirection = html.getAttribute("dir") || "ltr";
            const newDirection =
                currentDirection === "ltr" ? "rtl" : "ltr";

            applyDirection(newDirection);

            try {
                localStorage.setItem(
                    "travelora-direction",
                    newDirection
                );
            } catch (error) {
                // Direction still works for the current page.
            }
        });
    }


    /* --------------------------------------------------
       4. MOBILE NAVIGATION
    -------------------------------------------------- */

    function closeMobileMenu() {
        if (!mobileMenuBtn || !mainNav) return;

        mainNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");

        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function openMobileMenu() {
        if (!mobileMenuBtn || !mainNav) return;

        mainNav.classList.add("active");
        mobileMenuBtn.classList.add("active");

        mobileMenuBtn.setAttribute("aria-expanded", "true");
        mobileMenuBtn.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    }

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.setAttribute("aria-expanded", "false");

        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mainNav.classList.contains("active");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        /* Close the mobile menu after selecting a link.
           Keep it open when the Home dropdown toggle is tapped. */

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (
                    window.innerWidth <= 900 &&
                    link !== homeDropdownToggle
                ) {
                    closeMobileMenu();
                }
            });
        });

        /* Close the menu when clicking outside */

        document.addEventListener("click", (event) => {
            if (
                window.innerWidth <= 900 &&
                mainNav.classList.contains("active") &&
                !mainNav.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        /* Reset mobile menu when returning to desktop */

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


    /* --------------------------------------------------
       5. HOME DROPDOWN — HOME 1 / HOME 2
    -------------------------------------------------- */

    function closeHomeDropdown() {
        if (!homeDropdown || !homeDropdownToggle) return;

        homeDropdown.classList.remove("open");

        homeDropdownToggle.setAttribute("aria-expanded", "false");
    }

    if (homeDropdownToggle && homeDropdown) {
        homeDropdownToggle.setAttribute("aria-haspopup", "true");
        homeDropdownToggle.setAttribute("aria-expanded", "false");

        homeDropdownToggle.addEventListener("click", (event) => {
            /* On mobile, tap Home to open or close the submenu.
               On desktop, the CSS hover behavior remains available. */

            if (window.innerWidth <= 900) {
                event.preventDefault();

                const isOpen = homeDropdown.classList.contains("open");

                if (isOpen) {
                    closeHomeDropdown();
                } else {
                    homeDropdown.classList.add("open");

                    homeDropdownToggle.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                }
            }
        });

        /* Close dropdown when clicking outside */

        document.addEventListener("click", (event) => {
            if (!homeDropdown.contains(event.target)) {
                closeHomeDropdown();
            }
        });

        /* Close dropdown after resizing to desktop */

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeHomeDropdown();
            }
        });
    }


    /* --------------------------------------------------
       6. ESCAPE KEY — CLOSE OPEN MENUS
    -------------------------------------------------- */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeHomeDropdown();
            closeMobileMenu();
        }
    });

});