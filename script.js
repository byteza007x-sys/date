const PASSWORD = "260769";
const MAX_ATTEMPTS = 6;
const LOCK_DURATION = 24 * 60 * 60 * 1000;
const ATTEMPTS_KEY = "imDiaryFailedAttempts";
const LOCK_KEY = "imDiaryLockUntil";
const SPECIAL_DIARY_PASSWORD = "byteza007x";
const FALLBACK_IMAGE = "assets/diary-hero.png";
const INTRO_MESSAGE = "สวัสดีจ้าน้องอิมถ้าอิมได้เห็นเว็บนี้แสดงว่าอิมรู้รหัสผ่านของพี่แล้วอึ้งใช่มั้ยเจ้าเด็กเพราะรหัสมันสุดเทพ พี่นี่เก่งจริงๆหุหุหุ เว็บนี้เป็นเว็บที่เอาไว้เก็บไดอารี่ของพี่ที่เคยจดมาทั้งหมดเลยให้น้องเลื่อนลงละเปิดอ่านแต่ละวันได้เลยนะขอให้สนุกกับไดอารี่เรานะมันอาจเขียนไม่สวยงามมากแต่เป็นไดอารี่ที่ตั้งใจเขียนสุดๆ";
const SPECIAL_NOTES = [
  "พี่เป็นคนแรกที่พาน้องนั่งมอไซค์จากบ้านไปถึงวิลัยได้",
  "อิมไม่ค่อยชอบกินหมูสับแต่ก็พอกินได้ถ้าจำเป็น",
  "อิมใช้ของมีคมไม่เก่ง",
  "อิมว่ายน้ำไม่เป็น",
  "น้องขับจักรยานได้นิดหน่อยขับรถไม่ได้เลย",
  "น้องชอบกินช็อคโกแลต",
  "วันเกิดน้องอิม 22 ก.ย.",
  "วันเกิดแม่น้องอิม 14 เม.ย.",
  "ของขวัญชิ้นแรกที่น้องอิมให้คือ คิตแคทท",
  "น้องอิมทักมาหาครั้งแรกเรื่องเอาต้นไม้ไปวิลัย"
];
const PLAYLISTS = {
  diary: [
    { title: "Those Eyes", src: "audio/New West - Those Eyes (Home Session).mp3" },
    { title: "About You", src: "audio/The 1975 - About You (Official).mp3" },
    { title: "Taylor Swift - Style", src: "audio/Taylor Swift - Style.mp3" },
    { title: "ธรรมดาที่แสนพิเศษ", src: "audio/ANATOMY RABBIT - ธรรมดาแสนพเศษ  Extraordinary (Official Audio).mp3" },
    { title: "จีบอยู่เผื่อไม่รู้", src: "audio/WWJ - จบอยเผอไมร (How cute!) [Official Audio].mp3" }
  ],
  special: [
    { title: "รักเกินตัว (Overrated) - Mr.Min", src: "audio/[Official MV] รักเกินตัว (Overrated) - Mr.Min [NMMMnBt3eho].mp3" },
    { title: "เหมือนเคย", src: "audio/Boyd Kosiyabong - เหมอนเคย ft. Seattha Sirachaya (Official Lyric Video).mp3" },
    { title: "รักแรกพบ", src: "audio/Tattoo Colour - รกแรกพบ [Karaoke version].mp3" }
  ],
  gallery: [
    { title: "Cocktail - งานเต้นรำในคืนพระจันทร์เต็มดวง", src: "audio/งานเต้นรำในคืนพระจันทร์เต็มดวง - Cocktail feat. นิว นภัสสร (Official MV) [y04gImu0qiw].mp3" },
    { title: "Billie Eilish - BIRDS OF A FEATHER", src: "audio/Billie Eilish - BIRDS OF A FEATHER (Official Lyric Video).mp3" },
    { title: "ถ้าเธอรักใครคนหนึ่ง - อิ้งค์ วรันธร", src: "audio/ถาเธอรกใครคนหนง - INK WARUNTORN  Ost. บพเพสนนวาส  [Official MV].mp3" }
  ]
};
const GALLERY_ALBUMS = window.IM_GALLERY_ALBUMS || [];

const loginScreen = document.querySelector("#loginScreen");
const diaryApp = document.querySelector("#diaryApp");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#passwordInput");
const loginMessage = document.querySelector("#loginMessage");
const passcodeDisplay = document.querySelector("#passcodeDisplay");
const keypad = document.querySelector("#keypad");
const slideTrack = document.querySelector("#slideTrack");
const slidePrev = document.querySelector("#slidePrev");
const slideNext = document.querySelector("#slideNext");
const slideDots = document.querySelector("#slideDots");
const introText = document.querySelector("#introText");
const introDone = document.querySelector("#introDone");
const appNav = document.querySelector("#appNav");
const viewSections = [...document.querySelectorAll(".view-section")];
const specialGrid = document.querySelector("#specialGrid");
const timeline = document.querySelector("#timeline");
const entryCount = document.querySelector("#entryCount");
const gallery = document.querySelector("#gallery");
const albumTabs = document.querySelector("#albumTabs");
const galleryGrid = document.querySelector("#galleryGrid");
const modal = document.querySelector("#modal");
const modalDate = document.querySelector("#modalDate");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const musicDock = document.querySelector("#musicDock");
const musicToggle = document.querySelector("#musicToggle");
const musicNext = document.querySelector("#musicNext");
const musicLabel = document.querySelector("#musicLabel");
const bgMusic = document.querySelector("#bgMusic");

let entries = [];
let activeSlide = 0;
let slideTimer = null;
let hasTriedMusic = false;
let isMusicWanted = false;
let passcode = "";
let lockTimer = null;
let activePlaylistName = "diary";
let activeTrackIndex = 0;
let activeAlbumId = GALLERY_ALBUMS[0]?.id || "";
let failedTracks = new Set();
let unlockedProtectedEntries = new Set();

document.querySelectorAll("img").forEach(attachFallbackImage);

function attachFallbackImage(img) {
  img.addEventListener("error", () => {
    if (!img.src.includes(FALLBACK_IMAGE)) {
      img.src = FALLBACK_IMAGE;
    }
  });
}

setupLoginCarousel();

setupLockState();

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || isLocked()) return;

  if (button.dataset.key && passcode.length < PASSWORD.length) {
    passcode += button.dataset.key;
  }

  if (button.dataset.action === "backspace") {
    passcode = passcode.slice(0, -1);
  }

  if (button.dataset.action === "clear") {
    passcode = "";
  }

  updatePasscodeDisplay();

  if (passcode.length === PASSWORD.length) {
    validateLogin();
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  validateLogin();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

function setupLoginCarousel() {
  const slides = [...document.querySelectorAll(".slide")];
  if (!slides.length) return;

  slideDots.innerHTML = slides.map((_, index) => `
    <button type="button" data-slide-index="${index}" aria-label="ไปยังรูปที่ ${index + 1}"></button>
  `).join("");

  slidePrev.addEventListener("click", () => {
    goToSlide(activeSlide - 1);
    restartSlideTimer();
  });

  slideNext.addEventListener("click", () => {
    goToSlide(activeSlide + 1);
    restartSlideTimer();
  });

  slideDots.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      goToSlide(Number(button.dataset.slideIndex));
      restartSlideTimer();
    });
  });

  goToSlide(0);
  restartSlideTimer();
}

function goToSlide(index) {
  const slides = [...document.querySelectorAll(".slide")];
  if (!slides.length) return;

  activeSlide = (index + slides.length) % slides.length;
  slideTrack.style.transform = `translateX(-${activeSlide * 100}%)`;

  slideDots.querySelectorAll("button").forEach((button, dotIndex) => {
    button.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function restartSlideTimer() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(activeSlide + 1), 6200);
}

function validateLogin() {
  if (isLocked()) {
    showLockMessage();
    return;
  }

  if (passcode.length < PASSWORD.length) {
    loginMessage.textContent = "กดรหัสให้ครบ 6 ตัวก่อนน้า";
    return;
  }

  if (passcode !== PASSWORD) {
    registerFailedAttempt();
    return;
  }

  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(LOCK_KEY);
  loginMessage.textContent = "เปิดสมุดแล้ว...";
  enterDiary();
}

async function enterDiary() {
  loginScreen.style.animation = "riseIn 520ms ease reverse forwards";
  setTimeout(() => {
    loginScreen.hidden = true;
    diaryApp.hidden = false;
    musicDock.hidden = false;
    window.scrollTo({ top: 0 });
    renderSpecialNotes();
    renderGallery();
    showView("diary", false);
    setPlaylist("diary", false);
    loadDiary();
    typeIntro();
    tryPlayMusic();
  }, 500);
}

function registerFailedAttempt() {
  const attempts = getFailedAttempts() + 1;
  localStorage.setItem(ATTEMPTS_KEY, String(attempts));

  loginForm.classList.remove("is-wrong");
  void loginForm.offsetWidth;
  loginForm.classList.add("is-wrong");
  passcode = "";
  updatePasscodeDisplay();

  if (attempts >= MAX_ATTEMPTS) {
    const lockUntil = Date.now() + LOCK_DURATION;
    localStorage.setItem(LOCK_KEY, String(lockUntil));
    localStorage.setItem(ATTEMPTS_KEY, String(MAX_ATTEMPTS));
    setupLockState();
    return;
  }

  loginMessage.textContent = `รหัสยังไม่ใช่น้า เหลือโอกาสอีก ${MAX_ATTEMPTS - attempts} ครั้ง`;
}

function setupLockState() {
  if (lockTimer) clearInterval(lockTimer);

  if (!isLocked()) {
    setLoginDisabled(false);
    const attempts = getFailedAttempts();
    loginMessage.textContent = attempts
      ? `ใส่ผิดไปแล้ว ${attempts} ครั้ง เหลืออีก ${MAX_ATTEMPTS - attempts} ครั้ง`
      : "";
    return;
  }

  setLoginDisabled(true);
  showLockMessage();
  lockTimer = setInterval(() => {
    if (!isLocked()) {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCK_KEY);
      setupLockState();
      return;
    }

    showLockMessage();
  }, 1000);
}

function isLocked() {
  return Number(localStorage.getItem(LOCK_KEY) || 0) > Date.now();
}

function getFailedAttempts() {
  return Number(localStorage.getItem(ATTEMPTS_KEY) || 0);
}

function showLockMessage() {
  const lockUntil = Number(localStorage.getItem(LOCK_KEY) || 0);
  const remaining = Math.max(0, lockUntil - Date.now());
  loginMessage.textContent = `ล็อกไว้ก่อนนะ กลับมาใหม่ใน ${formatRemainingTime(remaining)}`;
}

function formatRemainingTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function setLoginDisabled(isDisabled) {
  keypad.querySelectorAll("button").forEach((button) => {
    button.disabled = isDisabled;
  });
  loginForm.querySelector(".primary-button").disabled = isDisabled;
}

function updatePasscodeDisplay() {
  passwordInput.value = passcode;
  passcodeDisplay.querySelectorAll("span").forEach((dot, index) => {
    dot.classList.toggle("is-filled", index < passcode.length);
  });
}

async function loadDiary() {
  try {
    const response = await fetch("diary.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("Diary file not found");
    const text = await response.text();
    entries = parseDiary(text);
    renderTimeline(entries);
  } catch (error) {
    entryCount.textContent = "ยังอ่านไฟล์ diary.txt ไม่ได้";
    timeline.innerHTML = "";
  }
}

function parseDiary(text) {
  const month = "(?:ม\\.ค\\.|ก\\.พ\\.|มี\\.ค\\.|เม\\.ย\\.|พ\\.ค\\.|มิ\\.ย\\.|ก\\.ค\\.|ส\\.ค\\.|ก\\.ย\\.|ต\\.ค\\.|พ\\.ย\\.|ธ\\.ค\\.|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|ธันวา|พ\\.ย\\.)";
  const lineDate = new RegExp(`^(?:วันที่\\s*)?(\\d{1,2}\\s*${month}\\s*\\d{0,4})`);
  const embeddedDate = new RegExp(`วันที่\\s*(\\d{1,2}\\s*${month}\\s*\\d{0,4})`);
  const items = [];
  let current = null;

  text.replace(/^\uFEFF/, "").split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed || trimmed === "น้องอิม") {
      if (current && !trimmed) current.body.push("");
      return;
    }

    const startsWithDate = trimmed.match(lineDate);
    if (startsWithDate) {
      if (current) items.push(current);
      current = {
        date: normalizeDate(startsWithDate[1]),
        body: [trimmed]
      };
      return;
    }

    if (!current) {
      const firstDate = trimmed.match(embeddedDate);
      current = {
        date: normalizeDate(firstDate ? firstDate[1] : "วันแรก"),
        body: [trimmed]
      };
      return;
    }

    current.body.push(line);
  });

  if (current) items.push(current);

  return items
    .map((item, index) => ({
      id: index,
      date: item.date,
      title: item.date,
      text: item.body.join("\n").trim(),
      isProtected: isProtectedDiaryDate(item.date)
    }))
    .filter((item) => item.text);
}

function normalizeDate(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isProtectedDiaryDate(date) {
  return /(?:^|\s)(?:26|27)\s*ก\.ค\.?\s*(?:69|2569)?$/u.test(date.replace(/\s+/g, " ").trim());
}

function renderTimeline(items) {
  entryCount.textContent = items.length
    ? `มีบันทึกทั้งหมด ${items.length} วัน`
    : "ยังไม่มีบันทึกในสมุดนี้";

  timeline.innerHTML = items.map((item) => `
    <article class="timeline-item">
      <button class="timeline-button ${item.isProtected ? "is-locked" : ""}" type="button" data-entry-id="${item.id}">
        <span class="timeline-date">${escapeHtml(item.date)}${item.isProtected ? '<span class="lock-badge">ล็อก</span>' : ""}</span>
        <span class="timeline-preview">${item.isProtected ? "บันทึกนี้ต้องใช้รหัสพิเศษก่อนอ่าน" : escapeHtml(item.text)}</span>
      </button>
    </article>
  `).join("");

  timeline.querySelectorAll(".timeline-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = entries.find((item) => item.id === Number(button.dataset.entryId));
      if (entry) openDiaryEntry(entry);
    });
  });

  const observer = new IntersectionObserver((observed) => {
    observed.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timeline.querySelectorAll(".timeline-item").forEach((item) => observer.observe(item));
}

function showView(name, shouldScroll = true) {
  viewSections.forEach((section) => {
    const isActive = section.dataset.page === name;
    section.hidden = !isActive;
    section.classList.toggle("is-active", isActive);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === name);
  });

  setPlaylist(PLAYLISTS[name] ? name : "diary", isMusicWanted);

  if (shouldScroll) {
    appNav.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderSpecialNotes() {
  specialGrid.innerHTML = SPECIAL_NOTES.map((note, index) => `
    <button class="heart-box" type="button" data-special-id="${index}">
      <span class="heart-mark" aria-hidden="true"></span>
      <span>${escapeHtml(note)}</span>
    </button>
  `).join("");

  specialGrid.querySelectorAll(".heart-box").forEach((button) => {
    button.addEventListener("click", () => {
      const note = SPECIAL_NOTES[Number(button.dataset.specialId)];
      openSpecialNote(note);
    });
  });
}

function renderGallery() {
  renderAlbumTabs();
  renderAlbumPhotos();
}

function renderAlbumTabs() {
  if (!GALLERY_ALBUMS.length) {
    albumTabs.innerHTML = "";
    return;
  }

  albumTabs.innerHTML = GALLERY_ALBUMS.map((album) => `
    <button class="${album.id === activeAlbumId ? "is-active" : ""}" type="button" data-album-id="${escapeHtml(album.id)}">
      <span>${escapeHtml(album.title)}</span>
      <small>${album.photos.length} รูป</small>
    </button>
  `).join("");

  albumTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeAlbumId = button.dataset.albumId;
      renderAlbumTabs();
      renderAlbumPhotos();
    });
  });
}

function renderAlbumPhotos() {
  const activeAlbum = GALLERY_ALBUMS.find((album) => album.id === activeAlbumId) || GALLERY_ALBUMS[0];

  if (!activeAlbum) {
    galleryGrid.innerHTML = `
      <div class="gallery-empty">
        <h3>ยังไม่มีอัลบั้ม</h3>
        <p>เพิ่มอัลบั้มได้ในไฟล์ gallery-data.js</p>
      </div>
    `;
    return;
  }

  galleryGrid.innerHTML = `
    <div class="album-note">${escapeHtml(activeAlbum.note || "เพิ่มรูปในโฟลเดอร์ของทริปนี้ แล้วแก้รายการใน gallery-data.js")}</div>
    ${activeAlbum.photos.map((item, index) => `
      <button class="gallery-frame frame-${(index % 4) + 1}" type="button" data-gallery-id="${index}">
        <span class="gallery-mat">
          <img class="gallery-img" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}">
        </span>
        <span class="gallery-plate">${escapeHtml(item.title)}</span>
      </button>
    `).join("")}
  `;

  galleryGrid.querySelectorAll(".gallery-frame").forEach((button) => {
    button.addEventListener("click", () => {
      const item = activeAlbum.photos[Number(button.dataset.galleryId)];
      openGalleryImage(item);
    });
  });

  galleryGrid.querySelectorAll("img").forEach(attachFallbackImage);
}

function typeIntro() {
  introText.textContent = "";
  introText.classList.remove("is-complete");
  introDone.hidden = true;

  let index = 0;
  const timer = setInterval(() => {
    introText.textContent += INTRO_MESSAGE[index] || "";
    index += 1;

    if (index >= INTRO_MESSAGE.length) {
      clearInterval(timer);
      introText.classList.add("is-complete");
      introDone.hidden = false;
    }
  }, 28);
}

function openDiaryEntry(entry) {
  if (entry.isProtected && !unlockedProtectedEntries.has(entry.id)) {
    openProtectedPrompt(entry);
    return;
  }

  openModal(entry);
}

function openProtectedPrompt(entry) {
  modalDate.textContent = entry.date;
  modalTitle.textContent = "บันทึกนี้ล็อกอยู่";
  modalBody.classList.remove("is-gallery-body");
  modalBody.innerHTML = `
    <form id="protectedForm" class="protected-form">
      <p>ต้องใส่รหัสพิเศษก่อนเปิดอ่านบันทึกวันนี้</p>
      <input id="protectedPassword" type="password" autocomplete="off" placeholder="รหัสพิเศษ">
      <button class="primary-button" type="submit">ปลดล็อก</button>
      <span id="protectedMessage" role="status"></span>
    </form>
  `;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const protectedForm = modalBody.querySelector("#protectedForm");
  const protectedPassword = modalBody.querySelector("#protectedPassword");
  const protectedMessage = modalBody.querySelector("#protectedMessage");
  protectedPassword.focus();

  protectedForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (protectedPassword.value.trim() !== SPECIAL_DIARY_PASSWORD) {
      protectedMessage.textContent = "รหัสพิเศษยังไม่ถูกน้า";
      protectedForm.classList.remove("is-wrong");
      void protectedForm.offsetWidth;
      protectedForm.classList.add("is-wrong");
      protectedPassword.select();
      return;
    }

    unlockedProtectedEntries.add(entry.id);
    openModal(entry);
  });
}

function openModal(entry) {
  modalDate.textContent = entry.date;
  modalTitle.textContent = "บันทึกวันนี้";
  modalBody.textContent = entry.text;
  modalBody.classList.remove("is-gallery-body");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function openSpecialNote(note) {
  modalDate.textContent = "เรื่องพิเศษ";
  modalTitle.textContent = "จำไว้นะ";
  modalBody.textContent = note;
  modalBody.classList.remove("is-gallery-body");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function openGalleryImage(item) {
  modalDate.textContent = "ห้องภาพของเรา";
  modalTitle.textContent = item.title;
  modalBody.classList.add("is-gallery-body");
  modalBody.innerHTML = `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}">`;
  modalBody.querySelectorAll("img").forEach(attachFallbackImage);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    isMusicWanted = true;
    tryPlayMusic(true);
  } else {
    isMusicWanted = false;
    bgMusic.pause();
    setMusicState(false);
  }
});

musicNext.addEventListener("click", () => playNextTrack(true));
bgMusic.addEventListener("ended", () => playNextTrack(true));
bgMusic.addEventListener("play", () => setMusicState(true));
bgMusic.addEventListener("pause", () => setMusicState(false));
bgMusic.addEventListener("error", () => {
  failedTracks.add(currentTrackKey());
  playNextTrack(isMusicWanted);
});

async function tryPlayMusic(force = false) {
  if (hasTriedMusic && !force) return;
  hasTriedMusic = true;
  isMusicWanted = true;

  try {
    if (!bgMusic.src) loadCurrentTrack();
    await bgMusic.play();
  } catch (error) {
    isMusicWanted = false;
    setMusicState(false);
  }
}

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-label", isPlaying ? "ปิดเพลง" : "เปิดเพลง");
  const track = getCurrentTrack();
  musicLabel.textContent = track ? track.title : "เพิ่มเพลงในโฟลเดอร์ audio";
}

function setPlaylist(name, shouldKeepPlaying) {
  if (activePlaylistName === name && bgMusic.src) return;
  activePlaylistName = name;
  activeTrackIndex = 0;
  failedTracks = new Set([...failedTracks].filter((key) => !key.startsWith(`${name}:`)));
  loadCurrentTrack();
  if (shouldKeepPlaying) tryPlayMusic(true);
}

function getCurrentTrack() {
  return PLAYLISTS[activePlaylistName]?.[activeTrackIndex];
}

function loadCurrentTrack() {
  const track = getCurrentTrack();
  if (!track) {
    musicLabel.textContent = "เพิ่มเพลงในโฟลเดอร์ audio";
    return;
  }

  bgMusic.src = track.src;
  bgMusic.load();
  musicLabel.textContent = track.title;
}

function playNextTrack(shouldPlay) {
  const playlist = PLAYLISTS[activePlaylistName] || [];
  if (!playlist.length) {
    musicLabel.textContent = "เพิ่มเพลงในโฟลเดอร์ audio";
    return;
  }

  for (let step = 0; step < playlist.length; step += 1) {
    activeTrackIndex = (activeTrackIndex + 1) % playlist.length;
    if (!failedTracks.has(currentTrackKey())) {
      loadCurrentTrack();
      if (shouldPlay) tryPlayMusic(true);
      return;
    }
  }

  musicLabel.textContent = "เพิ่มเพลงในโฟลเดอร์ audio";
}

function currentTrackKey() {
  const track = getCurrentTrack();
  return `${activePlaylistName}:${track?.src || "none"}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
