(() => {
  'use strict';

  /* =========================================================================
     CONFIGURAÇÃO — edite aqui para adicionar páginas, textos e fotos.
     ========================================================================= */
  const CONFIG = {

    // Música que aparece no pop-up estilo Spotify.
    music: {
      title: 'Menina',
      artist: 'ZeVitor',
      cover: 'assets/capa-musica.jpg',
      src: 'assets/menina.mp3',
      startAtSeconds: 0
    },

    pages: [
      {
        text:
          'Pra menina chata\n' +
          'Oi fofa, então tenho esse projetinho há um tempo. Era pra ter mandado pra você no seu aniversário, porém não tava gostando do texto, aí passou sem receber a cartinha. Vou reutilizar hoje, porque sim, não tem motivo específico pra isso.\n' +
          'Como é uma carta de um ano de amizade, se for pra ter acompanhamento de música, eu vou colocar nosso match do Spotify, Menina de ZeVitor, escuta se quiser. Resuminho de como funciona: algumas páginas têm fotos.'+
          'No ícone embaixo, só clicar que mostra algumas fotos. Se enjoar da música, na parte de cima mostra o player de música e esconde ele.\nEspero que goste…',
        typewriter: true,
        showMusicAfter: true,
        photos: ["assets/IMG-20251006-WA0020.jpg"],
        openGalleryOnEntry: false
      },
      {
        text:`Não era pra eu gostar de você. Nos conhecemos em um momento em que eu queria companhia, chamava de carência. Queria uma pessoa pra sentar do meu lado em um banco para passar o tempo.
Mudou quando olhei pro lado e vi quem estava lá. Acho que isso foi em dezembro, olhei pra uma estrelinha brilhando, uma luz que me trouxe algo que eu já tinha deixado pra trás: inspiração pra desenhar, música e escrever.
Obrigado por isso. Teve uma vez que eu guardo na memória: estávamos sentados em um banco na praça do shopping Estação. Eu tinha falado que te amava — tava naquela época que você não acreditava e falava que era mentira.
`,
        typewriter: false,
        showMusicAfter: false,
        photos: ["assets/20260209_164344.jpg"],
        openGalleryOnEntry: false
      },
      {
        text:`Então tive que explicar o porquê disso: conheci uma artista, onde me identifiquei com seus poemas, podia chamar pra desenhar e tinha um gosto de música igual (o seu é melhor), e só isso já significava muito pra mim.
Você é maluca, veio pra uma cidade sozinha tendo apenas uma amiga aqui, tudo por causa de um sonho. Já disse que tenho inveja dessa sua coragem. Você comentou como foi o começo aqui, como foi difícil passar algumas noites sozinha.
E é compreensível. Na situação que você tava, ter com quem contar pra se apoiar era muito importante, e você tentou. Lembro de quando contava dos seus amigos do trabalho, e toda a bagunça que deu com eles.
`,
        typewriter: false,
        showMusicAfter: false,
        photos: ['assets/Screenshot_20251001_152019_Instagram.jpg'],
        openGalleryOnEntry: false
      },
      {
        text:`Você ama churrasco, por isso no seu aniversário queria ir numa churrascaria onde o aniversariante não paga. Tinha convidado eles pra ir, nem lembro o motivo, mas não deu certo e ficou de passar o aniversário sozinha em casa.
Sei como amizade é importante pra você, então sei como ficou mal com toda essa situação. Pra não ficar mal, fui no seu aniversário, porque não posso deixar minha estrelinha perder o brilho.
Por isso tava sempre tentando te agradar, comprando os presentes que você queria, porque sei que você não podia, e se não tinha outro amigo pra isso, assumo o posto pra ajudar.
`,
        typewriter: false,
        showMusicAfter: false,
        photos: ["assets/20260225_162030.jpg","assets/WhatsApp Image 2026-09-26 at 23.14.34.jpeg"],
        openGalleryOnEntry: false
      },
      {
        text:`Engraçado, quando comentava que ia fazer teatro pra ser dubladora, eu ficava brincando que isso não ia dar dinheiro. Isso pode ocorrer pra outras pessoas, mas pra você isso não se enquadra.
Você é a pessoa mais dedicada que eu conheço. Fiquei muito feliz quando fiquei sabendo que tava na faculdade. Sabia que ia encontrar amigos com a mesma vibe que você.
Adorei ter conhecido eles, porque ficar nessa cidade chata ia ficar muito mais fácil.
`,
        typewriter: false,
        showMusicAfter: false,
        photos: ["assets/WhatsApp Image 2026-09-26 at 23.02.47.jpeg"],
        openGalleryOnEntry: false
      },
      {
        text:`Quero agradecer por esse ano de amizade com você, por cada passeio, cada filme que assistimos, cada momento que estava ruim.
Mas por estar com você já melhorar. Tô renovando nosso contrato de amizade por mais um ano. Não pode quebrar, se não jogo maldição na sua carreira de dubladora. Te amo, fofa.
`,
        typewriter: false,
        showMusicAfter: false,
        photos: [],
        openGalleryOnEntry: false
      },
    ]
  };
  /* ========================================================================= */


  /* ---------- Elements ---------- */
  const envelopeScreen = document.getElementById('screen-envelope');
  const letterScreen = document.getElementById('screen-letter');
  const envelope = document.getElementById('envelope');

  const letterPageEl = document.getElementById('letterPage');
  const pageTextEl = document.getElementById('pageText');
  const caretEl = document.getElementById('caret');
  const pageCountEl = document.getElementById('pageCount');

  const spotifyCard = document.getElementById('spotifyCard');
  const spotifyCover = document.getElementById('spotifyCover');
  const spotifyTitle = document.getElementById('spotifyTitle');
  const spotifyArtist = document.getElementById('spotifyArtist');
  const spotifyFill = document.getElementById('spotifyFill');
  const spotifyElapsed = document.getElementById('spotifyElapsed');
  const spotifyDuration = document.getElementById('spotifyDuration');
  const playPauseBtn = document.getElementById('playPause');

  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  const photoFab = document.getElementById('photoFab');
  const photoDot = document.getElementById('photoDot');

  const galleryModal = document.getElementById('galleryModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const galleryClose = document.getElementById('galleryClose');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const polaroidTrack = document.getElementById('polaroidTrack');
  const modalDotsWrap = document.getElementById('modalDots');

  /* ---------- State ---------- */
  let currentPageIndex = 0;
  let typewriterStartedFor = new Set();
  let galleryOpenedFor = new Set();
  let galleryIndex = 0;

  /* ---------- Spotify card setup (com áudio real) ---------- */
  const ICON_PAUSE = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
  const ICON_PLAY  = '<svg viewBox="0 0 24 24"><path d="M7 5l13 7-13 7V5z" fill="currentColor"/></svg>';

  const audio = document.getElementById('spotifyAudio');

  // Só define audio.src se o HTML não tiver <source> — assim não sobrescreve nada
  if (audio && !audio.querySelector('source') && CONFIG.music.src) {
    audio.src = CONFIG.music.src;
  }

  function formatTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  if (spotifyCover) spotifyCover.src = CONFIG.music.cover;
  if (spotifyTitle) spotifyTitle.textContent = CONFIG.music.title;
  if (spotifyArtist) spotifyArtist.textContent = CONFIG.music.artist;

  function updateProgressUI() {
    if (!spotifyFill || !spotifyElapsed) return;
    const dur = (audio && audio.duration) || 0;
    const cur = (audio && audio.currentTime) || 0;
    spotifyFill.style.width = dur ? `${(cur / dur) * 100}%` : '0%';
    spotifyElapsed.textContent = formatTime(cur);
    if (dur && spotifyDuration) spotifyDuration.textContent = formatTime(dur);
  }

  function playSpotify() {
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        if (playPauseBtn) playPauseBtn.innerHTML = ICON_PLAY;
      });
    }
  }

  function pauseSpotify() {
    if (audio) audio.pause();
  }

  if (audio) {
    audio.preload = 'metadata';

    audio.addEventListener('loadedmetadata', () => {
      if (spotifyDuration) spotifyDuration.textContent = formatTime(audio.duration);
      if (CONFIG.music.startAtSeconds > 0 && CONFIG.music.startAtSeconds < audio.duration) {
        audio.currentTime = CONFIG.music.startAtSeconds;
      }
      updateProgressUI();
    });

    audio.addEventListener('timeupdate', updateProgressUI);

    audio.addEventListener('ended', () => {
      audio.pause();
      audio.currentTime = 0;
      updateProgressUI();
    });

    audio.addEventListener('pause', () => {
      if (playPauseBtn) playPauseBtn.innerHTML = ICON_PLAY;
    });
    audio.addEventListener('play', () => {
      if (playPauseBtn) playPauseBtn.innerHTML = ICON_PAUSE;
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (!audio) return;
      audio.paused ? playSpotify() : pauseSpotify();
    });
  }

  // seek — protegido contra progressWrap nulo
  const progressWrap = spotifyFill ? spotifyFill.parentElement : null;
  if (progressWrap) {
    progressWrap.style.cursor = 'pointer';
    progressWrap.addEventListener('click', (e) => {
      if (!audio || !audio.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      audio.currentTime = ratio * audio.duration;
      updateProgressUI();
    });
  }

  function showSpotifyCard() {
    if (!spotifyCard) return;
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
/* ---------- Botão de música: mostra/esconde o card (sem pausar) ---------- */
const musicToggle = document.getElementById('musicToggle');

function toggleSpotifyCard() {
  if (!spotifyCard) return;
  const willShow = !spotifyCard.classList.contains('spotify-card--show');

  if (willShow) {
    spotifyCard.classList.add('spotify-card--show');
  } else {
    spotifyCard.classList.remove('spotify-card--show');
    // NÃO chama pauseSpotify() — a música continua tocando normalmente
  }

  if (musicToggle) {
    musicToggle.setAttribute('aria-pressed', String(willShow));
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', toggleSpotifyCard);
}
})();