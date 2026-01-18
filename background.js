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
    "audio/water/96_bgm_tamil.mp3",
    "audio/water/dude_bgm.mp3",
    "audio/water/moonu_bgm.mp3",
    "audio/water/petta_bgm.mp3",
    "audio/water/thalapathy_65_bgm.mp3",
    "audio/water/thupakki.mp3",
    "audio/water/vada_chennai_bgm.mp3",
    "audio/water/yanji.mp3"
];

async function ensureOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;

    await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play posture and water reminder audio"
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START_REMINDER") {
        chrome.alarms.create(msg.type, {
            delayInMinutes: msg.interval,
            periodInMinutes: msg.interval
        });
    }

    if (msg.action === "STOP_REMINDER") {
        chrome.alarms.clear(msg.type);
        chrome.runtime.sendMessage({ action: "STOP_AUDIO" });
    }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    await ensureOffscreen();

    const audioList =
        alarm.name === "posture" ? postureAudios : waterAudios;

    const randomFile =
        audioList[Math.floor(Math.random() * audioList.length)];

    chrome.runtime.sendMessage({
        action: "PLAY_AUDIO",
        file: randomFile,
        type: alarm.name
    });

    showNotification(alarm.name);
});

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
    chrome.runtime.sendMessage({ action: "STOP_AUDIO" });
});

