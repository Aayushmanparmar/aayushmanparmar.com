let data;

fetch("assets/data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    renderHome();
  });

function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="nav">
        <span onclick="renderHome()">Home</span>
        <span onclick="renderBlog()">Blog</span>
      </div>

      <div class="artist-header">
        <img src="assets/${data.artist.photo}" />
        <div>
          <h1>${data.artist.name}</h1>
          <p>${data.artist.bio}</p>
        </div>
      </div>

      <h2>Top Songs</h2>
      <div class="songs-scroll">
        <div class="songs-grid">
          ${data.topSongs.map(song => `
            <div class="song-row">
              <img src="assets/${song.cover}" />
              <span>${song.title}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <h2>Albums</h2>
      <div class="album-grid">
        ${data.albums.map(album => `
          <div class="album-item" onclick="renderAlbum('${album.id}')">
            <img src="assets/${album.cover}" />
            <p>${album.title}</p>
          </div>
        `).join("")}
      </div>

      <h2>EPs</h2>
      <div class="album-grid">
        ${data.eps.map(ep => `
          <div class="album-item" onclick="renderAlbum('${ep.id}')">
            <img src="assets/${ep.cover}" />
            <p>${ep.title}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderAlbum(id) {
  const album =
    data.albums.find(a => a.id === id) ||
    data.eps.find(e => e.id === id);

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">
      <div class="back-button" onclick="renderHome()">← Back</div>

      <div class="album-header">
        <img src="assets/${album.cover}" />
        <div>
          <h1>${album.title}</h1>
          <p>${album.tracks.length} Tracks</p>
        </div>
      </div>

      ${album.tracks.map((track, i) => `
        <div class="track-row">${i + 1}. ${track}</div>
      `).join("")}
    </div>
  `;
}

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
      <p>${post.content}</p>
    </div>
  `;
}
