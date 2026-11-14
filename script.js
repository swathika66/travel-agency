

document.addEventListener("DOMContentLoaded", () => {

    

    const html = document.documentElement;
    const body = document.body;

    const rtlBtn = document.getElementById("rtlBtn");
    const themeBtn = document.getElementById("themeBtn");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");

    const homeDropdownToggle =
        document.getElementById("homeDropdownToggle");

    const homeDropdown = document.querySelector(".home-dropdown");


    

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
        savedTheme =
            localStorage.getItem("travelora-theme") || "light";
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
            }
        });
    }


    

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

            const currentDirection =
                html.getAttribute("dir") || "ltr";

            const newDirection =
                currentDirection === "ltr" ? "rtl" : "ltr";

            applyDirection(newDirection);

            try {
                localStorage.setItem(
                    "travelora-direction",
                    newDirection
                );
            } catch (error) {
            }
        });
    }


    

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


        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


   

    function closeHomeDropdown() {

        if (!homeDropdown || !homeDropdownToggle) return;

        homeDropdown.classList.remove("open");

        homeDropdownToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (homeDropdownToggle && homeDropdown) {

        homeDropdownToggle.setAttribute(
            "aria-haspopup",
            "true"
        );

        homeDropdownToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        homeDropdownToggle.addEventListener("click", (event) => {

            if (window.innerWidth <= 1100) {

                event.preventDefault();

                const isOpen =
                    homeDropdown.classList.contains("open");

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


        document.addEventListener("click", (event) => {

            if (!homeDropdown.contains(event.target)) {
                closeHomeDropdown();
            }
        });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 1100) {
                closeHomeDropdown();
            }
        });
    }


    

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeHomeDropdown();
            closeMobileMenu();
        }
    });

});