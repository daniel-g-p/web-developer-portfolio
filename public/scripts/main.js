// FOUC REMOVAL AND CACHING

const splashScreen = document.querySelector("#splashScreen");

window.addEventListener("load", () => {
    if (splashScreen) {
        splashScreen.style.display = "flex";
        splashScreen.classList.add("loaded");
        setTimeout(() => splashScreen.style.display = "none", 5000);
    }
    document.body.style.visibility = "visible";
    document.body.style.opacity = 1;
});

// MOBILE NAVIGATION MENU

const navToggles = document.querySelectorAll(".navToggle");
const mobileNav = document.querySelector(".mobileNav");

navToggles.forEach(t => t.addEventListener("click", () => mobileNav.classList.toggle("active")));


// FADE ANIMATIONS ON SCROLL

const fadeFromRight = document.querySelectorAll(".rightFade");
fadeFromRight.forEach(e => {
    if (e) { e.classList.add("fadeFromRight") }
});

const fadeFromLeft = document.querySelectorAll(".leftFade");
fadeFromLeft.forEach(e => {
    if (e) { e.classList.add("fadeFromLeft") }
});

const fadeFromBottom = document.querySelectorAll(".bottomFade");
fadeFromBottom.forEach(e => {
    if (e) { e.classList.add("fadeFromBottom") }
});

const options = {
    root: null,
    threshold: 0.125
};

const intersectObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("visible");
        } else
            e.target.classList.remove("visible");
    });
}, options);

fadeFromRight.forEach(e => intersectObserver.observe(e));
fadeFromLeft.forEach(e => intersectObserver.observe(e));
fadeFromBottom.forEach(e => intersectObserver.observe(e));


// SKILLS SLIDER - HOME PAGE

const sliderButtons = document.querySelectorAll(".slider h3");
const skillBlock = document.querySelector(".skillBlock");

if (sliderButtons) {
    sliderButtons.forEach(b => b.addEventListener("click", async() => {
        if (b.classList.contains("active")) {
            return
        } else {
            sliderButtons.forEach(btn => btn.style.pointerEvents = "none");
            const category = b.className;
            document.querySelector(".slider h3.active").classList.remove("active");
            b.parentElement.className = `slider ${category}`;
            b.classList.add("active");
            await removeCurrentSkills();
            setTimeout(() => addNewSkills(category), 100);
        }
    }));
};

const removeCurrentSkills = async() => {
    const currentSkills = document.querySelectorAll(".skillCard.show");
    for (let s of currentSkills) {
        await removeSkillsPromise(s);
    };
    currentSkills.forEach(s => {
        setTimeout(() => {
            s.classList.remove("show");
            s.classList.replace("fadeOut", "fadeIn");
        }, 100);
    });
};

const addNewSkills = async(category) => {
    const newSkills = document.getElementsByClassName(`skillCard ${category}`);
    for (let s of newSkills) {
        s.classList.add("show");
    }
    for (let s of newSkills) {
        await addSkillsPromise(s);
    };
    sliderButtons.forEach(btn => btn.style.pointerEvents = "all");
};

const removeSkillsPromise = s => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            s.classList.add("fadeOut");
            resolve();
        }, 100)
    });
};

const addSkillsPromise = s => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            s.classList.remove("fadeIn");
            resolve();
        }, 100)
    });
};


// FORM VALIDATION ON CONTACT PAGE

const form = document.querySelector("form");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const subjectInput = document.querySelector("#subjectInput");
const messageInput = document.querySelector("#messageInput");
const inputs = [nameInput, emailInput, subjectInput, messageInput];
const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        inputs.forEach(i => {
            if (!i.lastElementChild.value) {
                i.classList.add("error");
                scrollToFirstError();
            } else {
                i.classList.remove("error");
            };
        });
        if (!emailInput.lastElementChild.value.match(emailFormat)) {
            emailInput.classList.add("error");
            scrollToFirstError();
            return;
        };
        if (inputs.every(isValid)) {
            sendForm();
            return;
        };
    });
    inputs.forEach(i => i.addEventListener("input", () => i.classList.remove("error")));
};

const sendForm = () => {
    const data = JSON.stringify({
        name: nameInput.lastElementChild.value,
        email: emailInput.lastElementChild.value,
        subject: subjectInput.lastElementChild.value,
        message: messageInput.lastElementChild.value
    });
    console.log(data);
    fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        .then(async response => {
            const res = await response.json();
            if (res.status === "success") {
                openModal("success");
                inputs.forEach(i => i.lastElementChild.value = "");
            } else {
                openModal("error");
            };
            return;
        })
        .catch(error => {
            console.log(error);
        });
};

const scrollToFirstError = () => {
    const err = document.querySelector(".error");
    setTimeout(() => err.scrollIntoView({ behavior: "smooth" }), 250);
};

const isValid = (el) => {
    return !el.classList.contains("error");
}


// MODALS FOR CONTACT PAGE

const modalButtons = document.querySelectorAll(".closeModal");
const overlay = document.querySelectorAll(".overlay");

if (overlay) {
    modalButtons.forEach(b => b.addEventListener("click", () => {
        closeModal(b.parentElement.parentElement);
    }));
}

const openModal = (type) => {
    const modal = document.querySelector(`.overlay.${type}`);
    modal.style.visibility = "visible";
    modal.classList.add("active");
};

const closeModal = (overlay) => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.style.visibility = "hidden", 500);
};