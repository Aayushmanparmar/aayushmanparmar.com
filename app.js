let data;
let currentAudio = null;
let currentButton = null;

fetch("assets/data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    renderHome();
  });

/* =========================
   HOME
========================= */

function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="nav">
        <span onclick="renderHome()">Home</span>
        <span onclick="renderBlog()">Blog</span>
      </div>

      <div class="artist-header">
        <img src="assets/images/${data.artist.photo}" />
        <div>
          <h1>${data.artist.name}</h1>
          <p>${data.artist.bio}</p>
        </div>
      </div>

      <h2>Top Songs</h2>
      <div class="songs-scroll">
        <div class="songs-grid">
          ${data.topSongs.map(song => createSongHTML(song)).join("")}
        </div>
      </div>

      <h2>Albums</h2>
      <div class="album-grid">
        ${data.albums.map(album => `
          <div class="album-item" onclick="renderAlbum('${album.id}')">
            <img src="assets/images/${album.cover}" />
            <p>${album.title}</p>
          </div>
        `).join("")}
      </div>

      ${data.eps.length > 0 ? `
        <h2>EPs</h2>
        <div class="album-grid">
          ${data.eps.map(ep => `
            <div class="album-item" onclick="renderAlbum('${ep.id}')">
              <img src="assets/images/${ep.cover}" />
              <p>${ep.title}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

/* =========================
   ALBUM PAGE
========================= */

function renderAlbum(id) {
  const album =
    data.albums.find(a => a.id === id) ||
    data.eps.find(e => e.id === id);

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="back-button" onclick="renderHome()">← Back</div>

      <div class="album-header">
        <img src="assets/images/${album.cover}" />
        <div>
          <h1>${album.title}</h1>
          <p style="max-width: 700px; line-height: 1.6; margin-top: 15px;">
            ${album.albumBio}
          </p>
        </div>
      </div>

      <h2>Tracklist</h2>

      ${album.tracks.map((track, i) => {
        const matchingSong = data.topSongs.find(s => s.title === track);
        if (!matchingSong) return `
          <div class="track-row">${i + 1}. ${track}</div>
        `;

        return `
          <div class="track-row">
            ${i + 1}. ${track}
            ${createPlayerControls(matchingSong)}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* =========================
   BLOG
========================= */

function renderBlog() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="back-button" onclick="renderHome()">← Back</div>
      <h1>Blog</h1>

      ${data.blog.map(post => `
        <div class="blog-preview" onclick="renderPost('${post.id}')">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPost(id) {
  const post = data.blog.find(p => p.id === id);
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="back-button" onclick="renderBlog()">← Back</div>
      <h1>${post.title}</h1>
      <p style="line-height: 1.6;">${post.content}</p>
    </div>
  `;
}

/* =========================
   PLAYER SYSTEM
========================= */

function createSongHTML(song) {
  return `
    <div class="song-row">
      <img src="assets/images/${song.cover}" />
      <span>${song.title}</span>
      ${createPlayerControls(song)}
    </div>
  `;
}

function createPlayerControls(song) {
  const id = song.audio.replace(".mp3", "");

  return `
    <button onclick="togglePlay('${song.audio}', this)">Play</button>
    <div class="progress-container" onclick="seek(event, '${song.audio}')">
      <div class="progress-bar" id="progress-${id}"></div>
    </div>
    <span id="time-${id}">0:00</span>
  `;
}

function togglePlay(filename, button) {
  if (currentAudio && currentAudio.src.includes(filename)) {
    if (currentAudio.paused) {
      currentAudio.play();
      button.textContent = "Pause";
    } else {
      currentAudio.pause();
      button.textContent = "Play";
    }
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    if (currentButton) currentButton.textContent = "Play";
  }

  currentAudio = new Audio(`music/${filename}`);
  currentButton = button;

  currentAudio.play();
  button.textContent = "Pause";

  currentAudio.addEventListener("timeupdate", updateProgress);
  currentAudio.addEventListener("ended", () => {
    button.textContent = "Play";
  });
}

function updateProgress() {
  if (!currentAudio) return;

  const filename = currentAudio.src.split("/").pop();
  const id = filename.replace(".mp3", "");

  const progressBar = document.getElementById(`progress-${id}`);
  const timeDisplay = document.getElementById(`time-${id}`);

  if (!progressBar || !timeDisplay) return;

  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBar.style.width = percent + "%";

  const minutes = Math.floor(currentAudio.currentTime / 60);
  const seconds = Math.floor(currentAudio.currentTime % 60)
    .toString()
    .padStart(2, "0");

  timeDisplay.textContent = `${minutes}:${seconds}`;
}

function seek(event, filename) {
  if (!currentAudio || !currentAudio.src.includes(filename)) return;

  const container = event.currentTarget;
  const width = container.clientWidth;
  const clickX = event.offsetX;

  currentAudio.currentTime = (clickX / width) * currentAudio.duration;
}
