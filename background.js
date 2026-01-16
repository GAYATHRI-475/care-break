let postureAudio = null;
let waterAudio = null;

const postureAudios = [
    "audio/posture/maapu_appu.mp3",
    "audio/posture/santhanam.mp3",
    "audio/posture/Tamil Comedy Notification.mp3",
    "audio/posture/vadivelu (1).mp3",
    "audio/posture/vadivelu_angry.mp3",
    "audio/posture/vadivelu.mp3",
    "audio/posture/vijay_comedy.mp3"
];

const waterAudios = [
    "audio/water/96_bgm_tamil.mp3.mp3",
    "audio/water/dude_bgm.mp3",
    "audio/water/moonu_bgm.mp3",
    "audio/water/petta_bgm.mp3",
    "audio/water/thalapathy_65_bgm.mp3",
    "audio/water/thupakki.mp3",
    "audio/water/vada_chennai_bgm.mp3",
    "audio/water/yanji.mp3"
];

chrome.runtime.onMessage.addListener((message) => {
    const {action, type, interval} = message;

    if(action === "START_REMINDER") {
        startReminder(type, interval);
    }

    if(action === "STOP_REMINDER") {
        stopReminder(type);
    }

    if(action === "STOP_AUDIO") {
        stopAudio(type);
    }
});

function startReminder(type, minutes) {
    chrome.alarms.create(type, {
        delayInMinutes: minutes,
        periodInMinutes: minutes
    });
}

function stopReminder(type) {
    chrome.alarms.clear(type);
}

chrome.alarms.onAlarm.addListener((alarm) => {
    playAudio(alarm.name);
    showNotification(alarm.name);
});

function playAudio(type) {
    stopAudio(type);

    let audioFiles = type === "posture" ? postureAudios : waterAudios;
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomFile = audioFiles[randomIndex];

    const audio = new Audio(randomFile);
    audio.play();

    if(type === "posture") postureAudio = audio;
    if(type === "water") waterAudio = audio;

}

function stopAudio(type) {
    if(type === "posture" && postureAudio) {
        postureAudio.pause();
        postureAudio.currentTime = 0;
        postureAudio = null;
    }

    if(type === "water" && waterAudio) {
        waterAudio.pause();
        waterAudio.currentTime = 0;
        waterAudio = null;
    }
}

function showNotification(type) {
    chrome.notifications.create(type, {
        type: "basic",
        iconUrl: "icon.png",
        title: type === "posture" ? "Posture Reminder" : "Water Reminder",
        message: type === "posture" ? "Time to check your posture!" : "Time to drink some water!",
        buttons: [{title: "Stop Audio"}],
        priority: 2
    });
}

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
    if(btnIdx === 0) {
        stopAudio(notifId);
    }
});
