let audioTabId = null;

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

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START_REMINDER") {
        chrome.alarms.create(msg.type, {
            delayInMinutes: msg.interval,
            periodInMinutes: msg.interval
        });
    }

    if (msg.action === "STOP_REMINDER") {
        chrome.alarms.clear(msg.type);
        stopAudio();
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    playAudio(alarm.name);
    showNotification(alarm.name);
});

function playAudio(type) {
    const audioList = type === "posture" ? postureAudios : waterAudios;
    const randomFile = audioList[Math.floor(Math.random() * audioList.length)];

    openAudioTab(() => {
        chrome.tabs.sendMessage(audioTabId, {
            action: "PLAY_AUDIO",
            file: randomFile
        });
    });
}

function stopAudio() {
    if (audioTabId) {
        chrome.tabs.sendMessage(audioTabId, {
            action: "STOP_AUDIO"
        });
    }
}

function openAudioTab(callback) {
    if (audioTabId) {
        callback();
        return;
    }

    chrome.tabs.create(
        {
            url: "audio.html",
            active: false
        },
        (tab) => {
            audioTabId = tab.id;
            callback();
        }
    );
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

chrome.notifications.onButtonClicked.addListener(() => {
    stopAudio();
});
