let audio = new Audio();
let currentAlbum = null;
let currentIndex = 0;

const album = {
  title: "Manah Kalah",
  cover: "assets/manah-kalah.jpg",
  credit: "Written, Sequenced & Produced by Aayushman Parmar",
  tracks: [
    { title: "Song 1", file: "music/track1.mp3" },
    { title: "Song 2", file: "music/track2.mp3" },
    { title: "Song 3", file: "music/track3.mp3" },
    { title: "Song 4", file: "music/track4.mp3" },
    { title: "Song 5", file: "music/track5.mp3" },
    { title: "Song 6", file: "music/track6.mp3" },
    { title: "Song 7", file: "music/track7.mp3" },
    { title: "Song 8", file: "music/track8.mp3" }
  ]
};

function showHome() {
  setActive("home");
}

function showBlog() {
  setActive("blog");
}

function setActive(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderSongs() {
  const grid = document.getElementById("songGrid");
  grid.innerHTML = "";

  album.tracks.forEach((track, index) => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerText = track.title;
    card.onclick = () => {
      currentAlbum = album;
      playTrack(index);
    };
    grid.appendChild(card);
  });
}

function renderAlbum() {
  const section = document.getElementById("albumSection");
  section.innerHTML = `
    <div class="album-card" onclick="openAlbum()">
      <img src="${album.cover}">
      <p>${album.title}</p>
    </div>
  `;
}

function openAlbum() {
  setActive("albumPage");

  const container = document.getElementById("albumContent");
  container.innerHTML = `
    <div style="padding:60px 40px;">
      <h1>${album.title}</h1>
    </div>
  `;

  album.tracks.forEach((track, index) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.innerHTML = `
      <span>${index + 1}. ${track.title}</span>
      <span>▶</span>
    `;
    row.onclick = () => {
      currentAlbum = album;
      playTrack(index);
    };
    container.appendChild(row);
  });

  const credit = document.createElement("div");
  credit.className = "album-credit";
  credit.innerText = album.credit;
  container.appendChild(credit);
}

function playTrack(index) {
  currentIndex = index;
  audio.src = currentAlbum.tracks[index].file;
  audio.play();

  document.getElementById("playerTitle").innerText =
    currentAlbum.tracks[index].title;

  document.getElementById("playerCover").src =
    currentAlbum.cover;

  document.getElementById("playBtn").innerText = "⏸";
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    document.getElementById("playBtn").innerText = "⏸";
  } else {
    audio.pause();
    document.getElementById("playBtn").innerText = "▶";
  }
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % currentAlbum.tracks.length;
  playTrack(currentIndex);
}

function prevTrack() {
  currentIndex =
    (currentIndex - 1 + currentAlbum.tracks.length) %
    currentAlbum.tracks.length;
  playTrack(currentIndex);
}

audio.addEventListener("timeupdate", () => {
  const current = Math.floor(audio.currentTime);
  const duration = Math.floor(audio.duration || 0);

  const format = s => `${Math.floor(s / 60)}:${(s % 60)
    .toString()
    .padStart(2, "0")}`;

  document.getElementById("time").innerText =
    `${format(current)} / ${format(duration)}`;
});

renderSongs();
renderAlbum();
showHome();
