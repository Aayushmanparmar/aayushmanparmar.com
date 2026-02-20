let data;

fetch("assets/data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    loadArtist();
    loadAlbums();
  });

function loadArtist() {
  document.getElementById("artistName").textContent = data.artist.name;
  document.getElementById("artistTagline").textContent = data.artist.tagline;
  document.getElementById("artistBio").textContent = data.artist.bio;

  const preview = document.getElementById("albumPreview");

  data.catalogue.albums.forEach(album => {
    const card = document.createElement("div");
    card.className = "album-card";
    card.innerHTML = `
      <h3>${album.title}</h3>
      <p>${album.year}</p>
      <p>${album.tracks.length} Songs • ${album.runtime}</p>
    `;
    card.onclick = () => showAlbum(album.id);
    preview.appendChild(card);
  });
}

function loadAlbums() {
  const container = document.getElementById("albumsContainer");

  data.catalogue.albums.forEach(album => {
    const div = document.createElement("div");
    div.id = album.id;
    div.style.display = "none";

    let tracksHTML = "";

    album.tracks.forEach((track, index) => {
      tracksHTML += `
        <div class="track">
          <span>${index + 1}. ${track.title}</span>
        </div>
        <audio controls src="music/${track.file}"></audio>
      `;
    });

    div.innerHTML = `
      <h2>${album.title}</h2>
      <p>${album.tracks.length} Songs • ${album.runtime}</p>
      <p><strong>Written, Sequenced & Produced by Aayushman Parmar</strong></p>
      <div class="tracklist">${tracksHTML}</div>
    `;

    container.appendChild(div);
  });
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

function showAlbum(albumId) {
  showSection("albums");

  document.querySelectorAll("#albumsContainer > div").forEach(div => {
    div.style.display = "none";
  });

  document.getElementById(albumId).style.display = "block";
}
