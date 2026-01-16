const postureBtn = document.getElementById("postureBtn");
const waterBtn = document.getElementById("waterBtn");

const postureSection = document.getElementById("postureSection");
const waterSection = document.getElementById("waterSection");

const startPosture = document.getElementById("startPosture");
const stopPosture = document.getElementById("stopPosture");

const startWater = document.getElementById("startWater");
const stopWater = document.getElementById("stopWater");

const postureTime = document.getElementById("postureTime");
const waterTime = document.getElementById("waterTime");

postureBtn.addEventListener("click", () => {
    postureBtn.classList.add("active");
    waterBtn.classList.remove("active");

    postureSection.classList.remove("hidden");
    waterSection.classList.add("hidden");
});

waterBtn.addEventListener("click" , () => {
    waterBtn.classList.add("active");
    postureBtn.classList.remove("active");

    waterSection.classList.remove("hidden");
    postureSection.classList.add("hidden");
});

startPosture.addEventListener("click", () => {
    const minutes = Number(postureTime.value);

    chrome.runtime.sendMessage({
        action: "START_REMINDER",
        type: "posture",
        interval: minutes
    });
});

stopPosture.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: "STOP_REMINDER",
        type: "posture"
    });
});

startWater.addEventListener("click", () => {
    const minutes = Number(waterTime.value);
    chrome.runtime.sendMessage({
        action: "START_REMINDER",
        type: "water",
        interval: minutes
    });
});

stopWater.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: "STOP_REMINDER",
        type: "water"
    });
});