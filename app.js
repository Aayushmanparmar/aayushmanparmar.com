let data;
let currentAlbum;
let currentTrackIndex = 0;
let audio = new Audio();

fetch("assets/data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    init();
  });

function init() {
  document.getElementById("artistName").textContent = data.artist.name;
  document.getElementById("artistTagline").textContent = data.artist.tagline;
  document.getElementById("artistBio").textContent = data.artist.bio;

  renderAlbums();
}

function renderAlbums() {
  const grid = document.getElementById("albumGrid");

  data.catalogue.albums.forEach(album => {
    const card = document.createElement("div");
    card.className = "album-card";
    card.innerHTML = `
      <img src="${album.cover}">
      <h3>${album.title}</h3>
      <p>${album.tracks.length} Songs • ${album.runtime}</p>
    `;
    card.onclick = () => openAlbum(album);
    grid.appendChild(card);
  });
}

function openAlbum(album) {
  currentAlbum = album;
  showSection("albums");

  const view = document.getElementById("albumView");
  view.innerHTML = `
    <h1>${album.title}</h1>
    <p>${album.tracks.length} Songs • ${album.runtime}</p>
    <p><strong>Written, Sequenced & Produced by Aayushman Parmar</strong></p>
    <div id="trackList"></div>
  `;

  const trackList = document.getElementById("trackList");

  album.tracks.forEach((track, index) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.innerHTML = `<span>${index + 1}. ${track.title}</span>`;
    row.onclick = () => playTrack(index);
    trackList.appendChild(row);
  });
}

function playTrack(index) {
  currentTrackIndex = index;
  const track = currentAlbum.tracks[index];

  audio.src = `music/${track.file}`;
  audio.play();

  document.getElementById("playerTitle").textContent = track.title;
  document.getElementById("playerCover").src = currentAlbum.cover;
  document.getElementById("playBtn").textContent = "⏸";

  highlightTrack();
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    document.getElementById("playBtn").textContent = "⏸";
  } else {
    audio.pause();
    document.getElementById("playBtn").textContent = "▶";
  }
}

function nextTrack() {
  if (currentTrackIndex < currentAlbum.tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  }
}

function prevTrack() {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  }
}

audio.addEventListener("ended", nextTrack);

audio.addEventListener("timeupdate", () => {
  const progress = document.getElementById("progress");
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;

  document.getElementById("time").textContent =
    formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
});

document.getElementById("progress").addEventListener("input", e => {
  audio.currentTime = (e.target.value / 100) * audio.duration;
});

function highlightTrack() {
  document.querySelectorAll(".track-row").forEach((row, i) => {
    row.classList.toggle("active", i === currentTrackIndex);
  });
}

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}
