let postureAudio = null;
let waterAudio = null;

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

    const audio = new Audio(
        type === "posture" ? "audio/posture.mp3" : "audio/water.mp3"
    );

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
