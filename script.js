const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');


const bioText = document.getElementById('bio-text');
const bioToggle = document.getElementById('bio-toggle');

bioToggle?.addEventListener('click', () => {
  const isCollapsed = bioText?.classList.toggle('collapsed');
  bioToggle.textContent = isCollapsed ? 'Read more' : 'Show less';
});

const switchView = (viewId) => {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });
  views.forEach((view) => view.classList.toggle('active', view.id === viewId));
};

navLinks.forEach((button) => {
  button.addEventListener('click', () => switchView(button.dataset.view));
});

document.querySelectorAll('[data-album-target="album"]').forEach((el) => {
  el.addEventListener('click', () => switchView('album'));
});

document.querySelectorAll('.song-jump').forEach((button) => {
  button.addEventListener('click', () => {
    switchView('album');
    const trackName = button.dataset.track;
    const track = [...document.querySelectorAll('#tracklist li')].find(
      (li) => li.querySelector('span')?.textContent === trackName,
    );
    if (track) selectTrack(track);
  });
});

const player = document.getElementById('album-player');
const playerStatus = document.getElementById('player-status');
const playPauseBtn = document.getElementById('play-pause-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');
const volumeSlider = document.getElementById('volume-slider');
const tracks = [...document.querySelectorAll('#tracklist li')];
let selectedTrack = null;
let shuffleOn = false;

const setPlayPauseLabel = () => {
  if (!playPauseBtn) return;
  playPauseBtn.textContent = player.paused ? '▶' : '⏸';
};

async function selectTrack(trackEl) {
  tracks.forEach((t) => t.classList.remove('active-track'));
  selectedTrack = trackEl;
  selectedTrack.classList.add('active-track');

  const file = selectedTrack.dataset.file;
  player.src = file;

  try {
    await player.play();
    setPlayPauseLabel();
    playerStatus.textContent = `Now playing: ${selectedTrack.querySelector('span').textContent}`;
  } catch {
    setPlayPauseLabel();
    playerStatus.textContent = `Could not play ${file}. Add the matching file in /audio.`;
  }
}

const playNextTrack = () => {
  if (!tracks.length) return;
  const currentIndex = selectedTrack ? tracks.indexOf(selectedTrack) : -1;

  let nextIndex = 0;
  if (shuffleOn && tracks.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } while (nextIndex === currentIndex);
  } else {
    nextIndex = currentIndex >= 0 ? (currentIndex + 1) % tracks.length : 0;
  }

  selectTrack(tracks[nextIndex]);
};

tracks.forEach((track) => {
  track.addEventListener('click', () => {
    selectTrack(track);
  });
});

playPauseBtn?.addEventListener('click', async () => {
  if (!selectedTrack && tracks.length) {
    await selectTrack(tracks[0]);
    return;
  }

  if (player.paused) {
    try {
      await player.play();
      if (selectedTrack) {
        playerStatus.textContent = `Now playing: ${selectedTrack.querySelector('span').textContent}`;
      }
    } catch {
      playerStatus.textContent = 'Unable to start playback.';
    }
  } else {
    player.pause();
    if (selectedTrack) {
      playerStatus.textContent = `Paused: ${selectedTrack.querySelector('span').textContent}`;
    }
  }

  setPlayPauseLabel();
});

shuffleBtn?.addEventListener('click', () => {
  shuffleOn = !shuffleOn;
  shuffleBtn.classList.toggle('active', shuffleOn);
});

loopBtn?.addEventListener('click', () => {
  player.loop = !player.loop;
  loopBtn.classList.toggle('active', player.loop);
});

volumeSlider?.addEventListener('input', () => {
  player.volume = Number(volumeSlider.value);
});

player.addEventListener('play', setPlayPauseLabel);
player.addEventListener('pause', setPlayPauseLabel);
player.addEventListener('ended', () => {
  if (!player.loop) {
    playNextTrack();
  }
});

setPlayPauseLabel();

const STORAGE_KEY = 'aayushman-mini-dsp-blog';
const postsContainer = document.getElementById('posts');
const postForm = document.getElementById('post-form');
const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const commentTemplate = document.getElementById('comment-template');

const loadPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

let posts = loadPosts();
const uid = () => Math.random().toString(36).slice(2, 10);

const render = () => {
  postsContainer.innerHTML = '';

  if (!posts.length) {
    postsContainer.innerHTML = '<article class="panel">No posts yet. Publish your first blog.</article>';
    return;
  }

  posts.slice().reverse().forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';

    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content.replace(/\n/g, '<br>')}</p>
      <div class="post-actions">
        <button type="button" class="like-post">❤️ <span>${post.likes}</span></button>
        <button type="button" class="delete-post">Delete</button>
      </div>
      <form class="comment-form">
        <input type="text" required maxlength="500" placeholder="Write a comment..." />
        <button type="submit">Comment</button>
      </form>
      <div class="comments"></div>
    `;

    card.querySelector('.like-post').addEventListener('click', () => {
      post.likes += 1;
      savePosts(posts);
      render();
    });

    card.querySelector('.delete-post').addEventListener('click', () => {
      posts = posts.filter((item) => item.id !== post.id);
      savePosts(posts);
      render();
    });

    const commentForm = card.querySelector('.comment-form');
    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = commentForm.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      post.comments.push({ id: uid(), text, likes: 0, replies: [] });
      input.value = '';
      savePosts(posts);
      render();
    });

    const commentsEl = card.querySelector('.comments');
    post.comments.forEach((comment) => {
      const commentNode = commentTemplate.content.firstElementChild.cloneNode(true);
      commentNode.querySelector('.comment-text').textContent = comment.text;

      const likeCommentBtn = commentNode.querySelector('.like-comment');
      likeCommentBtn.querySelector('span').textContent = String(comment.likes);
      likeCommentBtn.addEventListener('click', () => {
        comment.likes += 1;
        savePosts(posts);
        render();
      });

      const replyForm = commentNode.querySelector('.reply-form');
      commentNode.querySelector('.reply-toggle').addEventListener('click', () => {
        replyForm.classList.toggle('hidden');
      });

      replyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = replyForm.querySelector('.reply-input');
        const replyText = input.value.trim();
        if (!replyText) return;
        comment.replies.push(replyText);
        input.value = '';
        savePosts(posts);
        render();
      });

      const repliesEl = commentNode.querySelector('.replies');
      comment.replies.forEach((reply) => {
        const replyEl = document.createElement('div');
        replyEl.className = 'reply';
        replyEl.textContent = `↳ ${reply}`;
        repliesEl.appendChild(replyEl);
      });

      commentsEl.appendChild(commentNode);
    });

    postsContainer.appendChild(card);
  });
};

postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = postTitle.value.trim();
  const content = postContent.value.trim();
  if (!title || !content) return;

  posts.push({ id: uid(), title, content, likes: 0, comments: [] });
  postForm.reset();
  savePosts(posts);
  render();
});

render();
