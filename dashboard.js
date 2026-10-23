document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ----------------------------------
    // 1. SAFE LOCAL STORAGE HELPERS
    // ----------------------------------

    const readStorage = (key, fallback = []) => {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return Array.isArray(value) ? value : fallback;
        } catch {
            return fallback;
        }
    };

    const writeStorage = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            alert("Your browser could not save this information.");
            return false;
        }
    };

    // ----------------------------------
    // 2. SAVE AND UNSAVE DESTINATIONS
    // ----------------------------------

    const savedKey = "travelora-saved-destinations";
    let savedDestinations = readStorage(savedKey);

    const savedCount = document.getElementById("savedPlacesCount");
    const destinationCards = [
        ...document.querySelectorAll(".saved-destination-card")
    ];

    function updateSavedCount() {
        if (savedCount) {
            savedCount.textContent = savedDestinations.length;
        }
    }

    function updateSaveButtons() {
        document.querySelectorAll(".save-destination-btn")
            .forEach(button => {
                const destination = button.dataset.destination;
                const isSaved = savedDestinations.includes(destination);

                button.setAttribute("aria-pressed", String(isSaved));
                button.setAttribute(
                    "aria-label",
                    `${isSaved ? "Unsave" : "Save"} ${destination}`
                );

                const label = button.querySelector("span");
                if (label) {
                    label.textContent = isSaved ? "Saved" : "Save";
                }

                button.classList.toggle("is-saved", isSaved);
            });
    }

    document.querySelectorAll(".save-destination-btn")
        .forEach(button => {
            button.addEventListener("click", () => {
                const destination = button.dataset.destination;
                const wasSaved = savedDestinations.includes(destination);

                const updated = wasSaved
                    ? savedDestinations.filter(item => item !== destination)
                    : [...savedDestinations, destination];

                if (writeStorage(savedKey, updated)) {
                    savedDestinations = updated;
                    updateSaveButtons();
                    updateSavedCount();
                }
            });
        });

    updateSaveButtons();
    updateSavedCount();

    // ----------------------------------
    // 3. SEARCH DESTINATIONS
    // ----------------------------------

    const searchInput = document.getElementById("destinationSearch");
    const searchMessage = document.getElementById(
        "destinationSearchMessage"
    );

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            destinationCards.forEach(card => {
                const matches = card.textContent
                    .toLowerCase()
                    .includes(query);

                card.hidden = !matches;

                if (matches) visibleCount++;
            });

            if (searchMessage) {
                searchMessage.textContent =
                    visibleCount === 0
                        ? "No destinations found. Try another search."
                        : `${visibleCount} destination${
                            visibleCount === 1 ? "" : "s"
                        } found.`;
            }
        });
    }

    // ----------------------------------
    // 4. TRIP PLANNER
    // ----------------------------------

    const plannerButtons = document.querySelectorAll(
        '.dashboard-hero-outline, .travel-planner-content .btn'
    );

    plannerButtons.forEach(button => {
        button.addEventListener("click", event => {
            const destination = document.getElementById("tripDestination");
            const travelDate = document.getElementById("tripDate");
            const travelers = document.getElementById("tripTravelers");

            // The form is optional. Without it, the normal contact link works.
            if (destination && travelDate && travelers) {
                event.preventDefault();

                const params = new URLSearchParams({
                    destination: destination.value.trim(),
                    date: travelDate.value,
                    travelers: travelers.value
                });

                window.location.href = `contact.html?${params.toString()}`;
            }
        });
    });

    // ----------------------------------
    // 5. DEMO ITINERARY CREATION
    // ----------------------------------

    const itineraryKey = "travelora-demo-itineraries";
    let itineraries = readStorage(itineraryKey);
    const itinerarySection = document.getElementById("myItineraries");

    if (itinerarySection) {
        const emptyPanel = itinerarySection.querySelector(
            ".itinerary-empty-panel"
        );

        const itineraryList = document.createElement("div");
        itineraryList.className = "dashboard-itinerary-list";
        itineraryList.id = "dashboardItineraryList";

        if (emptyPanel) {
            emptyPanel.insertAdjacentElement("afterend", itineraryList);
        }

        function renderItineraries() {
            if (!itineraryList) return;

            itineraryList.replaceChildren();

            if (emptyPanel) {
                emptyPanel.hidden = itineraries.length > 0;
            }

            itineraries.forEach((trip, index) => {
                const card = document.createElement("article");
                card.className = "dashboard-itinerary-card";

                const title = document.createElement("h3");
                title.textContent = trip.destination;

                const details = document.createElement("p");
                details.textContent =
                    `Travel date: ${trip.date || "Not selected"} · ` +
                    `Travelers: ${trip.travelers || "Not specified"}`;

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "remove-itinerary-btn";
                remove.textContent = "Delete itinerary";
                remove.addEventListener("click", () => {
                    const updated = itineraries.filter(
                        (_, i) => i !== index
                    );

                    if (writeStorage(itineraryKey, updated)) {
                        itineraries = updated;
                        renderItineraries();
                    }
                });

                card.append(title, details, remove);
                itineraryList.appendChild(card);
            });
        }

        renderItineraries();
    }

    // ----------------------------------
    // 6. CREATE AN OPTIONAL TRIP FORM
    // ----------------------------------

    const plannerSection = document.querySelector(
        ".travel-planner-section"
    );

    if (plannerSection && itinerarySection) {
        const plannerContent = plannerSection.querySelector(
            ".travel-planner-content"
        );

        if (plannerContent) {
            const form = document.createElement("form");
            form.id = "dashboardTripForm";
            form.className = "dashboard-trip-form";

            form.innerHTML = `
                <h3>Plan a trip</h3>

                <label for="tripDestination">Destination</label>
                <input id="tripDestination" name="destination"
                       type="text" required maxlength="100"
                       placeholder="e.g. Bali">

                <label for="tripDate">Travel date</label>
                <input id="tripDate" name="date" type="date">

                <label for="tripTravelers">Number of travelers</label>
                <input id="tripTravelers" name="travelers"
                       type="number" min="1" max="50" value="2" required>

                <button class="btn btn-primary" type="submit">
                    Save Demo Itinerary
                </button>

                <p id="tripFormMessage" role="status"></p>
            `;

            plannerContent.appendChild(form);

            const dateInput = form.querySelector("#tripDate");
            const today = new Date();
            const localToday = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            dateInput.min = localToday;

            form.addEventListener("submit", event => {
                event.preventDefault();

                const destination = form.querySelector(
                    "#tripDestination"
                ).value.trim();
                const date = dateInput.value;
                const travelers = form.querySelector(
                    "#tripTravelers"
                ).value;
                const message = form.querySelector("#tripFormMessage");

                if (!destination) return;

                if (date && date < localToday) {
                    message.textContent =
                        "Please choose today or a future date.";
                    return;
                }

                const updated = [
                    ...readStorage(itineraryKey),
                    {
                        destination,
                        date,
                        travelers,
                        createdAt: new Date().toISOString()
                    }
                ];

                if (writeStorage(itineraryKey, updated)) {
                    itineraries = updated;

                    const list = document.getElementById(
                        "dashboardItineraryList"
                    );

                    if (list) {
                        list.replaceChildren();

                        const section = document.getElementById(
                            "myItineraries"
                        );
                        const empty = section.querySelector(
                            ".itinerary-empty-panel"
                        );

                        if (empty) empty.hidden = true;

                        itineraries.forEach((trip, index) => {
                            const card = document.createElement("article");
                            card.className = "dashboard-itinerary-card";

                            const heading = document.createElement("h3");
                            heading.textContent = trip.destination;

                            const details = document.createElement("p");
                            details.textContent =
                                `Travel date: ${trip.date || "Not selected"} · ` +
                                `Travelers: ${trip.travelers}`;

                            const remove = document.createElement("button");
                            remove.type = "button";
                            remove.className = "remove-itinerary-btn";
                            remove.textContent = "Delete itinerary";

                            remove.addEventListener("click", () => {
                                const next = itineraries.filter(
                                    (_, i) => i !== index
                                );

                                if (writeStorage(itineraryKey, next)) {
                                    itineraries = next;
                                    location.reload();
                                }
                            });

                            card.append(heading, details, remove);
                            list.appendChild(card);
                        });
                    }

                    message.textContent =
                        "Demo itinerary saved in this browser.";

                    form.reset();
                    dateInput.min = localToday;
                    form.querySelector("#tripTravelers").value = "2";
                }
            });
        }
    }

    // ----------------------------------
    // 7. DATE AND ICON REFRESH
    // ----------------------------------

    const dateElement = document.getElementById("dashboardDate");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});