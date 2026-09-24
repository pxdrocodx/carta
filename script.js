(() => {
  'use strict';

  /* =========================================================================
     CONFIGURAÇÃO — edite aqui para adicionar páginas, textos e fotos.
     Não precisa mexer em mais nada no arquivo para isso.
     ========================================================================= */
  const CONFIG = {

    // Música que aparece no pop-up estilo Spotify (simulado, sem API).
    music: {
      title: 'Moonlight',
      artist: 'Kali Uchis',
      cover: 'assets/album-cover.svg',
      durationSeconds: 188,   // 3:08
      startAtSeconds: 102     // 1:42 — posição inicial só de enfeite
    },

    // Uma entrada em "pages" = uma página da carta.
    // Adicione, remova ou reordene quantas quiser.
    //
    //   text              → texto da página (use \n\n para parágrafo em branco)
    //   typewriter        → true só deve ser usado na 1ª página (efeito digitação)
    //   showMusicAfter    → true faz o player do Spotify surgir ao fim da digitação
    //   photos            → array de imagens da galeria PARA ESSA página específica
    //                        (deixe [] se essa página não tiver galeria)
    //   openGalleryOnEntry→ true abre a galeria automaticamente ao chegar nessa página
    //                        (só na primeira vez que a pessoa visita a página)
    pages: [
      {
        text:
          'Querida Jeni,\n\n' +
          'Bem-vinda a este cantinho especial feito só para ti.\n\n' +
          'Espero que gostes do que preparei...',
        typewriter: true,
        showMusicAfter: true,
        photos: [],
        openGalleryOnEntry: false
      },
      {
        text:
          '…cada dia que passa, o meu amor por ti cresce. Lembro-me de quando nos ' +
          'conhecemos, era um dia de sol como hoje. Fiquei tão nervoso! Eram tantas ' +
          'coisas para te dizer…',
        typewriter: false,
        showMusicAfter: false,
        photos: [
          'assets/polaroid1.svg',
          'assets/polaroid2.svg',
          'assets/polaroid3.svg'
        ],
        openGalleryOnEntry: true
      }

      // Exemplo de como adicionar uma 3ª página com fotos diferentes:
      // {
      //   text: 'Mais uma página só nossa...',
      //   typewriter: false,
      //   showMusicAfter: false,
      //   photos: ['assets/polaroid1.svg'],
      //   openGalleryOnEntry: false
      // },
    ]
  };
  /* ========================================================================= */


  /* ---------- Elements ---------- */
  const envelopeScreen = document.getElementById('screen-envelope');
  const letterScreen   = document.getElementById('screen-letter');
  const envelope       = document.getElementById('envelope');

  const letterPageEl = document.getElementById('letterPage');
  const pageTextEl   = document.getElementById('pageText');
  const caretEl      = document.getElementById('caret');
  const pageCountEl  = document.getElementById('pageCount');

  const spotifyCard    = document.getElementById('spotifyCard');
  const spotifyCover   = document.getElementById('spotifyCover');
  const spotifyTitle   = document.getElementById('spotifyTitle');
  const spotifyArtist  = document.getElementById('spotifyArtist');
  const spotifyFill    = document.getElementById('spotifyFill');
  const spotifyElapsed = document.getElementById('spotifyElapsed');
  const spotifyDuration= document.getElementById('spotifyDuration');
  const playPauseBtn   = document.getElementById('playPause');

  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  const photoFab = document.getElementById('photoFab');
  const photoDot = document.getElementById('photoDot');

  const galleryModal   = document.getElementById('galleryModal');
  const modalBackdrop  = document.getElementById('modalBackdrop');
  const galleryClose   = document.getElementById('galleryClose');
  const galleryPrev    = document.getElementById('galleryPrev');
  const galleryNext    = document.getElementById('galleryNext');
  const polaroidTrack  = document.getElementById('polaroidTrack');
  const modalDotsWrap  = document.getElementById('modalDots');

  /* ---------- State ---------- */
  let currentPageIndex = 0;
  let typewriterStartedFor = new Set();
  let galleryOpenedFor = new Set();
  let galleryIndex = 0;

  /* ---------- Spotify card setup ---------- */
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  spotifyCover.src = CONFIG.music.cover;
  spotifyTitle.textContent = CONFIG.music.title;
  spotifyArtist.textContent = CONFIG.music.artist;
  spotifyDuration.textContent = formatTime(CONFIG.music.durationSeconds);

  let elapsedSeconds = CONFIG.music.startAtSeconds;
  let spotifyPlaying = false;
  let spotifyTimer = null;
  const ICON_PAUSE = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
  const ICON_PLAY  = '<svg viewBox="0 0 24 24"><path d="M7 5l13 7-13 7V5z" fill="currentColor"/></svg>';

  function updateProgressUI() {
    spotifyFill.style.width = `${(elapsedSeconds / CONFIG.music.durationSeconds) * 100}%`;
    spotifyElapsed.textContent = formatTime(elapsedSeconds);
  }

  function tickProgress() {
    elapsedSeconds += 1;
    if (elapsedSeconds >= CONFIG.music.durationSeconds) elapsedSeconds = 0;
    updateProgressUI();
  }

  function playSpotify() {
    spotifyPlaying = true;
    playPauseBtn.innerHTML = ICON_PAUSE;
    if (spotifyTimer) clearInterval(spotifyTimer);
    spotifyTimer = setInterval(tickProgress, 1000);
  }

  function pauseSpotify() {
    spotifyPlaying = false;
    playPauseBtn.innerHTML = ICON_PLAY;
    if (spotifyTimer) clearInterval(spotifyTimer);
  }

  playPauseBtn.addEventListener('click', () => {
    spotifyPlaying ? pauseSpotify() : playSpotify();
  });

  function showSpotifyCard() {
    updateProgressUI();
    spotifyCard.classList.add('spotify-card--show');
    playSpotify();
  }

  /* ---------- Envelope → Letter transition ---------- */
  function openEnvelope() {
    envelope.classList.add('envelope--opening');
    setTimeout(() => {
      envelopeScreen.classList.remove('screen--active');
      letterScreen.classList.add('screen--active');
      renderPage(0, { instant: true });
    }, 550);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* ---------- Typewriter ---------- */
  function typeWriter(text, el, speed, onDone) {
    let i = 0;
    (function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      } else if (onDone) {
        onDone();
      }
    })();
  }

  /* ---------- Page rendering ---------- */
  function renderPage(index, opts = {}) {
    const page = CONFIG.pages[index];
    if (!page) return;
    currentPageIndex = index;

    prevPageBtn.disabled = index === 0;
    nextPageBtn.disabled = index === CONFIG.pages.length - 1;
    pageCountEl.textContent = CONFIG.pages.length > 1
      ? `${index + 1} / ${CONFIG.pages.length}`
      : '';

    const draw = () => {
      pageTextEl.textContent = '';
      caretEl.classList.remove('caret--hide');

      if (page.typewriter && !typewriterStartedFor.has(index)) {
        typewriterStartedFor.add(index);
        typeWriter(page.text, pageTextEl, 38, () => {
          caretEl.classList.add('caret--hide');
          if (page.showMusicAfter) setTimeout(showSpotifyCard, 300);
        });
      } else {
        caretEl.classList.add('caret--hide');
        pageTextEl.textContent = page.text;
        if (page.typewriter && page.showMusicAfter && !spotifyCard.classList.contains('spotify-card--show')) {
          showSpotifyCard();
        }
      }

      updatePhotoFab(page);
      letterPageEl.classList.remove('letter__page--fading');

      if (page.openGalleryOnEntry && page.photos.length && !galleryOpenedFor.has(index)) {
        setTimeout(() => openGallery(index), 350);
      }
    };

    if (opts.instant) {
      draw();
    } else {
      letterPageEl.classList.add('letter__page--fading');
      setTimeout(draw, 250);
    }
  }

  function updatePhotoFab(page) {
    const hasPhotos = page.photos && page.photos.length > 0;
    photoFab.hidden = !hasPhotos;
    if (!hasPhotos) return;
    const alreadyOpened = galleryOpenedFor.has(currentPageIndex);
    photoDot.classList.toggle('photo-fab__dot--hidden', alreadyOpened);
  }

  function goNext() {
    if (currentPageIndex < CONFIG.pages.length - 1) renderPage(currentPageIndex + 1);
  }
  function goPrev() {
    if (currentPageIndex > 0) renderPage(currentPageIndex - 1);
  }

  nextPageBtn.addEventListener('click', goNext);
  prevPageBtn.addEventListener('click', goPrev);
  photoFab.addEventListener('click', () => openGallery(currentPageIndex));

  /* ---------- Gallery modal (per-page photos) ---------- */
  function buildPolaroidTrack(photos) {
    polaroidTrack.innerHTML = '';
    photos.forEach((src, i) => {
      const fig = document.createElement('figure');
      fig.className = 'polaroid';
      fig.dataset.index = i;
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Memória ${i + 1}`;
      fig.appendChild(img);
      polaroidTrack.appendChild(fig);
    });
  }

  function buildDots(total) {
    modalDotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      if (i === galleryIndex) dot.classList.add('active');
      modalDotsWrap.appendChild(dot);
    }
  }

  function renderGallery() {
    const polaroids = Array.from(polaroidTrack.querySelectorAll('.polaroid'));
    const total = polaroids.length;
    polaroids.forEach((p, i) => {
      p.dataset.state =
        i === galleryIndex ? 'active' :
        i === (galleryIndex - 1 + total) % total ? 'prev' :
        i === (galleryIndex + 1) % total ? 'next' : 'hidden';
    });
    buildDots(total);
  }

  function openGallery(pageIndex) {
    const page = CONFIG.pages[pageIndex];
    if (!page || !page.photos.length) return;
    galleryIndex = 0;
    galleryOpenedFor.add(pageIndex);
    buildPolaroidTrack(page.photos);
    renderGallery();
    updatePhotoFab(page);

    galleryModal.classList.add('modal--open');
    galleryModal.setAttribute('aria-hidden', 'false');
  }

  function closeGallery() {
    galleryModal.classList.remove('modal--open');
    galleryModal.setAttribute('aria-hidden', 'true');
  }

  function nextPhoto() {
    const total = polaroidTrack.children.length;
    galleryIndex = (galleryIndex + 1) % total;
    renderGallery();
  }
  function prevPhoto() {
    const total = polaroidTrack.children.length;
    galleryIndex = (galleryIndex - 1 + total) % total;
    renderGallery();
  }

  galleryClose.addEventListener('click', closeGallery);
  modalBackdrop.addEventListener('click', closeGallery);
  galleryNext.addEventListener('click', nextPhoto);
  galleryPrev.addEventListener('click', prevPhoto);

  document.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('modal--open')) {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      return;
    }
    if (letterScreen.classList.contains('screen--active')) {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
  });

})();
