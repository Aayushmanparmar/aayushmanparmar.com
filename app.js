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
// TOP SONGS RENDER
function renderTopSongs() {
  const top = document.getElementById("topSongs");
  const album = data.catalogue.albums[0];

  album.tracks.slice(0, 5).forEach((track, i) => {
    const row = document.createElement("div");
    row.className = "song-row";
    row.innerHTML = `<span>${track.title}</span><span>Manah Kalah</span>`;
    row.onclick = () => {
      currentAlbum = album;
      playTrack(i);
    };
    top.appendChild(row);
  });
}

// HORIZONTAL ALBUMS
function renderHorizontal() {
  const albumRow = document.getElementById("albumRow");
  const album = data.catalogue.albums[0];

  const card = document.createElement("div");
  card.className = "album-card";
  card.innerHTML = `
    <img src="${album.cover}">
    <h4>${album.title}</h4>
    <p>${album.runtime}</p>
  `;
  card.onclick = () => openAlbum(album);

  albumRow.appendChild(card);
}

// BLOG SYSTEM
function createPost() {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;

  if (!title || !content) return;

  const post = { title, content, comments: [] };

  let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  posts.push(post);
  localStorage.setItem("blogPosts", JSON.stringify(posts));

  renderPosts();
}

function renderPosts() {
  const container = document.getElementById("blogPosts");
  container.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];

  posts.forEach((post, index) => {
    const div = document.createElement("div");
    div.className = "blog-post";

    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <div class="comments"></div>
      <div class="comment-box">
        <input placeholder="Write a comment..."
        onkeypress="if(event.key==='Enter') addComment(${index}, this.value)">
      </div>
    `;

    const commentsDiv = div.querySelector(".comments");

    post.comments.forEach(c => {
      const p = document.createElement("p");
      p.textContent = c;
      commentsDiv.appendChild(p);
    });

    container.appendChild(div);
  });
}

function addComment(index, text) {
  if (!text) return;

  let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  posts[index].comments.push(text);
  localStorage.setItem("blogPosts", JSON.stringify(posts));

  renderPosts();
}

renderTopSongs();
renderHorizontal();
renderPosts();
