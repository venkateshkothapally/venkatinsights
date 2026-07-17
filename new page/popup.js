/* ==========================================
   ELEMENTS
========================================== */

const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");

const popupTitle = document.getElementById("popupTitle");
const popupYear = document.getElementById("popupYear");
const popupDesc = document.getElementById("popupDesc");

const hallTicket = document.getElementById("hallTicket");
const admission = document.getElementById("admission");
const results = document.getElementById("results");
const bulletin = document.getElementById("bulletin");
const help = document.getElementById("help");
const official = document.getElementById("official");


/* ==========================================
   OPEN POPUP
========================================== */

function openPopup(card) {

    popupTitle.textContent =
        card.dataset.title || "";

    popupYear.textContent =
        card.dataset.year || "";

    popupDesc.textContent =
        card.dataset.description || "";

    hallTicket.href =
        card.dataset.hallticket || "#";

    admission.href =
        card.dataset.admission || "#";

    results.href =
        card.dataset.results || "#";

    bulletin.href =
        card.dataset.bulletin || "#";

    help.href =
        card.dataset.help || "#";

    official.href =
        card.dataset.website || "#";

    popup.classList.add("active");
    overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* ==========================================
   CLOSE POPUP
========================================== */

function closeSidePopup() {

    popup.classList.remove("active");
    overlay.classList.remove("active");

    document.body.style.overflow = "auto";
}


/* ==========================================
   CLICK CARD
========================================== */

document.querySelectorAll(".exam-card").forEach(card => {

    card.addEventListener("click", function () {

        openPopup(card);

    });

});


/* ==========================================
   OPEN BUTTON
========================================== */

document.querySelectorAll(".openBtn").forEach(btn => {

    btn.addEventListener("click", function (e) {

        e.stopPropagation();

        openPopup(this.closest(".exam-card"));

    });

});


/* ==========================================
   CLOSE EVENTS
========================================== */

closePopup.addEventListener("click", closeSidePopup);

overlay.addEventListener("click", closeSidePopup);


/* ==========================================
   ESC KEY
========================================== */

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeSidePopup();

    }

});


/* ==========================================
   PREVENT EMPTY LINKS
========================================== */

document.querySelectorAll(".popup-links a").forEach(link => {

    link.addEventListener("click", function (e) {

        if (
            this.getAttribute("href") === "#" ||
            this.getAttribute("href") === ""
        ) {

            e.preventDefault();

            alert("Link will be updated soon.");

        }

    });

});


/* ==========================================
   OPTIONAL RIPPLE EFFECT
========================================== */

document.querySelectorAll(".openBtn").forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        const rect = this.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = size + "px";
        ripple.style.height = size + "px";

        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255,255,255,.4)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple .6s linear";
        ripple.style.pointerEvents = "none";

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

    });

});


/* ==========================================
   RIPPLE KEYFRAME
========================================== */

const style = document.createElement("style");

style.innerHTML = `
@keyframes ripple{
    to{
        transform:scale(4);
        opacity:0;
    }
}
`;

document.head.appendChild(style);