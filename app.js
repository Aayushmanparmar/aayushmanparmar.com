const audio = new Audio();
let trackList = [];
let currentIdx = 0;

// 1. Initial Load: Fetch Metadata & Build UI
async function init() {
    try {
        const response = await fetch('./assets/data.json');
        const data = await response.json();
        
        // Fill Artist Info
        document.getElementById('artist-name').innerText = data.artist;
        document.getElementById('artist-bio').innerText = data.bio;
        document.getElementById('album-title').innerText = data.album.title;

        // Load Inspirations
        const inspoList = document.getElementById('inspiration-list');
        data.inspirations.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            inspoList.appendChild(li);
        });

        // Build Tracklist UI
        trackList = data.album.tracks;
        const container = document.getElementById('songs-container');
        
        trackList.forEach((track, index) => {
            const row = document.createElement('div');
            row.className = 'track-row';
            row.innerHTML = `
                <span class="track-num">${index + 1}</span>
                <span class="track-title">${track.title}</span>
            `;
            row.onclick = () => playTrack(index);
            container.appendChild(row);
        });

        setupOutputSelection();
    } catch (err) {
        console.error("Check your data.json path!", err);
    }
}

// 2. The Seamless Playback Logic
function playTrack(index) {
    currentIdx = index;
    const track = trackList[index];
    
    // UI Updates
    document.getElementById('track-name').innerText = `Playing: ${track.title}`;
    document.querySelectorAll('.track-row').forEach(r => r.classList.remove('active'));
    document.getElementById('songs-container').children[index].classList.add('active');

    // Audio Logic
    audio.src = track.file;
    audio.play();
    document.getElementById('play-pause-btn').innerText = '⏸';

    // SEAMLESS TRICK: Preload the next heavy .wav file
    if (index + 1 < trackList.length) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'audio';
        preloadLink.href = trackList[index + 1].file;
        document.head.appendChild(preloadLink);
    }
}

// 3. Audio Output Selection (Spotify-style)
async function setupOutputSelection() {
    const selector = document.getElementById('audio-output-select');
    if (!navigator.mediaDevices || !audio.setSinkId) return;

    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputs = devices.filter(device => device.kind === 'audiooutput');

    outputs.forEach(device => {
        const opt = document.createElement('option');
        opt.value = device.deviceId;
        opt.text = device.label || `Output Device ${selector.length + 1}`;
        selector.appendChild(opt);
    });

    selector.onchange = () => audio.setSinkId(selector.value);
}

// 4. Global Event Listeners
document.getElementById('play-pause-btn').onclick = () => {
    if (audio.paused) {
        audio.play();
        document.getElementById('play-pause-btn').innerText = '⏸';
    } else {
        audio.pause();
        document.getElementById('play-pause-btn').innerText = '▶';
    }
};

document.getElementById('volume-slider').oninput = (e) => {
    audio.volume = e.target.value;
};

// Auto-play next tracktrackList.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `
        <span class="col-num">${index + 1}</span>
        <span class="col-title">${track.title}</span>
        <span class="col-time">${track.duration}</span>
    `;
    row.onclick = () => playTrack(index);
    container.appendChild(row);
});
audio.onended = () => {
    if (currentIdx < trackList.length - 1) playTrack(currentIdx + 1);
};

init();
