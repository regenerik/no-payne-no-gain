const menu = document.querySelector("#menu");
const roomsScreen = document.querySelector("#roomsScreen");
const roomScreen = document.querySelector("#roomScreen");
const gameScreen = document.querySelector("#gameScreen");
const endScreen = document.querySelector("#endScreen");
const playBtn = document.querySelector("#playBtn");
const howToPlayBtn = document.querySelector("#howToPlayBtn");
const howToPlayDialog = document.querySelector("#howToPlayDialog");
const closeHowToPlayBtn = document.querySelector("#closeHowToPlayBtn");
const logsBtn = document.querySelector("#logsBtn");
const logsDialog = document.querySelector("#logsDialog");
const closeLogsBtn = document.querySelector("#closeLogsBtn");
const musicToggleBtn = document.querySelector("#musicToggleBtn");
const multiplayerBtn = document.querySelector("#multiplayerBtn");
const proModeToggle = document.querySelector("#proModeToggle");
const againBtn = document.querySelector("#againBtn");
const closeBtn = document.querySelector("#closeBtn");
const backMenuBtn = document.querySelector("#backMenuBtn");
const roomGameBtn = document.querySelector("#roomGameBtn");
const roomsBackBtn = document.querySelector("#roomsBackBtn");
const createRoomBtn = document.querySelector("#createRoomBtn");
const serverUrlInput = document.querySelector("#serverUrlInput");
const serverSettingsBtn = document.querySelector("#serverSettingsBtn");
const serverSettingsPanel = document.querySelector("#serverSettingsPanel");
const playerNameInput = document.querySelector("#playerNameInput");
const playerNameDialog = document.querySelector("#playerNameDialog");
const playerNameForm = document.querySelector("#playerNameForm");
const playerNameDialogTitle = document.querySelector("#playerNameDialogTitle");
const cancelPlayerNameBtn = document.querySelector("#cancelPlayerNameBtn");
const createRoomFields = document.querySelector("#createRoomFields");
const roomClosedDialog = document.querySelector("#roomClosedDialog");
const roomClosedMessage = document.querySelector("#roomClosedMessage");
const closeRoomNoticeBtn = document.querySelector("#closeRoomNoticeBtn");
const connectServerBtn = document.querySelector("#connectServerBtn");
const serverStatus = document.querySelector("#serverStatus");
const roomNameInput = document.querySelector("#roomNameInput");
const roomMaxInput = document.querySelector("#roomMaxInput");
const roomList = document.querySelector("#roomList");
const activeRoomName = document.querySelector("#activeRoomName");
const redTeamList = document.querySelector("#redTeamList");
const spectatorsList = document.querySelector("#spectatorsList");
const blueTeamList = document.querySelector("#blueTeamList");
const moveToRedBtn = document.querySelector("#moveToRedBtn");
const moveToBlueBtn = document.querySelector("#moveToBlueBtn");
const moveToSpectatorsFromRedBtn = document.querySelector("#moveToSpectatorsFromRedBtn");
const moveToSpectatorsFromBlueBtn = document.querySelector("#moveToSpectatorsFromBlueBtn");
const autoTeamsBtn = document.querySelector("#autoTeamsBtn");
const randomTeamsBtn = document.querySelector("#randomTeamsBtn");
const lockRoomBtn = document.querySelector("#lockRoomBtn");
const resetTeamsBtn = document.querySelector("#resetTeamsBtn");
const copyLinkBtn = document.querySelector("#copyLinkBtn");
const closeRoomOverlayBtn = document.querySelector("#closeRoomOverlayBtn");
const leaveRoomBtn = document.querySelector("#leaveRoomBtn");
const startMultiplayerGameBtn = document.querySelector("#startMultiplayerGameBtn");
const roomTimeInput = document.querySelector("#roomTimeInput");
const roomUnlimitedToggle = document.querySelector("#roomUnlimitedToggle");
const roomScoreInput = document.querySelector("#roomScoreInput");
const roomProModeToggle = document.querySelector("#roomProModeToggle");
const roomKeeperToggle = document.querySelector("#roomKeeperToggle");
const roomSprintToggle = document.querySelector("#roomSprintToggle");
const pickStadiumBtn = document.querySelector("#pickStadiumBtn");
const timerEl = document.querySelector("#timer");
const scoreEl = document.querySelector("#score");
const momentEl = document.querySelector("#moment");
const goalBanner = document.querySelector("#goalBanner");
const controlsEl = document.querySelector(".controls");
const playerOverlay = document.querySelector("#playerOverlay");
const chargeMeter = document.querySelector("#chargeMeter");
const chargeFill = document.querySelector("#chargeFill");
const chargeText = document.querySelector("#chargeText");
const sprintMeter = document.querySelector("#sprintMeter");
const sprintFill = document.querySelector("#sprintFill");
const touchControls = document.querySelector("#touchControls");
const touchJoystick = document.querySelector("#touchJoystick");
const touchStick = document.querySelector("#touchStick");
const touchCameraBtn = document.querySelector("#touchCameraBtn");
const touchProBtn = document.querySelector("#touchProBtn");
const touchSoundBtn = document.querySelector("#touchSoundBtn");
const touchSprintBtn = document.querySelector("#touchSprintBtn");
const touchSoftBtn = document.querySelector("#touchSoftBtn");
const touchPassBtn = document.querySelector("#touchPassBtn");
const touchShotBtn = document.querySelector("#touchShotBtn");
let spectatorNotice;
let acknowledgedSpectatorSignature = "";

const matchLength = 180;
const field = { width: 42, length: 76 };
const keys = new Set();
const trainingLines = [
  "El entrenamiento empieza a ponerse serio",
  "La pelota firmo contrato con el gol",
  "El rival se acerca y reconsidera su vida",
  "El delantero no corre: el pasto se mueve",
  "La practica ya parece una final",
  "El arquero ya esta mirando al juez",
];
const multiplayerLines = [
  "La defensa acaba de presentar una queja formal",
  "Ese pase tenia direccion postal",
  "El cesped pide tiempo muerto",
  "Alguien revise si la pelota tiene licencia",
  "La tactica fue improvisar con absoluta confianza",
  "El arquero esta actualizando el curriculum",
  "Se juega como se puede y se festeja como se quiere",
  "La tribuna vio algo. Nadie sabe exactamente que",
  "El VAR decidio mirar para otro lado",
  "Hay mas fe que marca personal",
];
const modePhrase = (trainingText, multiplayerText) => multiplayerMode ? multiplayerText : trainingText;
const defaultServerUrl = "https://futbol-fun-server.onrender.com";
const clientPlayerId = sessionStorage.getItem("npgClientId")
  || (crypto.randomUUID?.() || `player-${Date.now()}-${Math.random().toString(36).slice(2)}`);
sessionStorage.setItem("npgClientId", clientPlayerId);
const gameplayKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyC",
  "KeyE",
  "KeyQ",
  "KeyM",
  "KeyP",
  "ShiftLeft",
  "Space",
]);

function isGameplayActive() {
  return gameScreen.classList.contains("is-active") || roomOverlayOpen;
}

function shouldBlockBrowserShortcut(event) {
  if (!isGameplayActive()) return false;
  return gameplayKeys.has(event.code) || ((event.ctrlKey || event.metaKey) && gameplayKeys.has(event.code));
}

let renderer;
let scene;
let camera;
let clock;
let player;
let ball;
let ballShadow;
let kickArrow;
let goalKeeper;
let keeperState;
let goalKeepers = [];
let trainingFreeMode = false;
let trainingWorldColliders = [];
let museumGroup = null;
let trainingTunnelSeal = null;
let trainingTunnelCover = null;
const trainingMuseumFloorY = -6.4;
const trainingTunnelStartX = -28;
const trainingTunnelEndX = -48;
let opponents = [];
let multiplayerActors = [];
let playerTags = [];
let score = 0;
let redScore = 0;
let blueScore = 0;
let remaining = matchLength;
let playerAngle = 0;
let cameraMode = "third";
let broadcastFocusZ = 0;
let proModeEnabled = false;
let multiplayerMode = false;
let ballControlled = false;
let ballOwner = null;
let ballMagnetCooldown = 0;
let playerMoveDir = new THREE.Vector3(0, 0, 1);
let ballVelocity;
let ballVerticalVelocity = 0;
let ballShotCharge = 0;
let spaceChargeStart = null;
let chargeMeterOpacity = 0;
let chargeMeterRatio = 0;
let ballTrails = [];
let stadiumScoreTexture;
let stadiumScoreCtx;
let stadiumTimerText = "";
let goalCooldown = 0;
let ended = false;
let phraseTimer = 0;
let activeRoom = null;
let selectedPlayerId = null;
let roomLocked = false;
let roomOverlayOpen = false;
let onlineMode = false;
let networkSessionReady = false;
let socket = null;
let socketServerUrl = localStorage.getItem("npgServerUrl") || defaultServerUrl;
let onlinePlayerName = localStorage.getItem("npgPlayerName") || "";
if (onlinePlayerName.toLowerCase() === "davo") onlinePlayerName = "";
let lastNetStateAt = 0;
let lastBallNetStateAt = 0;
let localInputSeq = 0;
let lastSnapshotSeq = 0;
let currentMatchId = null;
let authoritativeLocalTarget = new THREE.Vector3();
let hasAuthoritativeLocalTarget = false;
let networkBallOwnerId = null;
let localBallPredictionBlockedUntil = 0;
let lastNetworkBallSeq = 0;
let pendingLocalKickId = null;
let lastAppliedKickId = null;
let localKickSeq = 0;
let networkBallTarget = new THREE.Vector3(0, 0.42, 0);
let networkBallVelocity = new THREE.Vector3();
let touchPointerId = null;
let touchMoveVector = new THREE.Vector2();
let kickoffLockUntil = 0;
let kickoffLocked = false;
let kickoffTeam = null;
let kickoffTakerId = null;
let touchSprintActive = false;
let lobbyPreviewMode = false;
let multiplayerRooms = [];
let roomListState = "loading";
let spectatorViewing = false;
let spectatorJumpVelocity = 0;
let spectatorGrounded = true;
let spectatorJumpQueued = false;
let spectatorConfetti = [];
let lastSpectatorConfettiAt = 0;
let matchEndRoomTimer = 0;
let pendingIdentityAction = null;
let pendingIdentityNeedsRoom = false;
let suppressNextRoomClosedNotice = false;
const fullShotChargeSeconds = 0.416;
const sprintDrainSeconds = 3;
const sprintRechargeSeconds = 5;
const sprintEmptyDelaySeconds = 2;
let sprintEnergy = 1;
let sprintRechargeDelay = 0;

let celebrationRenderer;
let celebrationScene;
let celebrationCamera;
let celebrationClock;
let cupPlayer;
let cup;
let rain = [];
let gameFrame = 0;
let celebrationFrame = 0;
let menuMusicMuted = true;
let stadiumSoundMuted = false;
let menuMusic;
let stadiumLoop;
let goalSound;
let kickSound;
let menuMusicVolume = Number(localStorage.getItem("npgMenuVolume"));
let stadiumSoundVolume = Number(localStorage.getItem("npgStadiumVolume"));
if (!Number.isFinite(menuMusicVolume)) menuMusicVolume = 0.5;
if (!Number.isFinite(stadiumSoundVolume)) stadiumSoundVolume = 0.5;
if (localStorage.getItem("npgAudioDefaultsVersion") !== "2") {
  stadiumSoundVolume = 0.5;
  localStorage.setItem("npgStadiumVolume", String(stadiumSoundVolume));
  localStorage.setItem("npgAudioDefaultsVersion", "2");
}

function showScreen(active) {
  roomOverlayOpen = false;
  [menu, roomsScreen, roomScreen, gameScreen, endScreen].forEach((screen) => {
    screen.classList.remove("is-active");
    screen.classList.remove("is-overlay");
  });
  active.classList.add("is-active");
}

function ensureSpectatorNotice() {
  if (spectatorNotice) return spectatorNotice;
  spectatorNotice = document.createElement("div");
  spectatorNotice.className = "spectator-notice";
  spectatorNotice.textContent = "!";
  spectatorNotice.title = "Hay jugadores en espera";
  spectatorNotice.dataset.tooltip = "Hay jugadores en espera";
  spectatorNotice.setAttribute("role", "status");
  spectatorNotice.setAttribute("aria-label", "Hay jugadores en espera");
  document.body.appendChild(spectatorNotice);
  return spectatorNotice;
}

function updateSpectatorNotice() {
  const notice = ensureSpectatorNotice();
  const spectatorSignature = activeRoom?.players
    ?.filter((roomPlayer) => roomPlayer.team === "spectators")
    .map((roomPlayer) => roomPlayer.id)
    .sort()
    .join("|") || "";
  const shouldShow = Boolean(
    activeRoom
    && isCurrentRoomHost()
    && spectatorSignature
  );
  notice.classList.toggle("show", shouldShow);
  notice.classList.toggle(
    "needs-attention",
    shouldShow && spectatorSignature !== acknowledgedSpectatorSignature
  );
}

function makeCanvasTexture(draw, width = 256, height = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createAudio(src, { loop = false, volume = 1 } = {}) {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  audio.preload = "auto";
  audio.load();
  return audio;
}

function setupAudio() {
  if (menuMusic) return;
  menuMusic = createAudio("./sonidos/menu.mp3", { loop: true, volume: menuMusicVolume });
  stadiumLoop = createAudio("./sonidos/ambiente_loop.mp3", { loop: true, volume: stadiumSoundVolume });
  goalSound = createAudio("./sonidos/gol.mp3", { loop: false, volume: Math.min(1, stadiumSoundVolume * 2.7) });
  kickSound = createAudio("./sonidos/kick.mp3", { loop: false, volume: 0.72 });
}

function safePlay(audio) {
  if (!audio) return;
  const promise = audio.play();
  if (promise?.catch) promise.catch(() => {});
}

function stopAudio(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

function updateMusicButton() {
  if (!musicToggleBtn) return;
  const percentage = Math.round(menuMusicVolume * 100);
  musicToggleBtn.textContent = menuMusicMuted ? "Musica: OFF" : `Musica: ${percentage}%`;
}

function adjustContextVolume(direction) {
  setupAudio();
  const step = 0.05 * Math.sign(direction);
  if (gameScreen.classList.contains("is-active")) {
    stadiumSoundVolume = THREE.MathUtils.clamp(stadiumSoundVolume + step, 0, 1);
    stadiumLoop.volume = stadiumSoundVolume;
    goalSound.volume = Math.min(1, stadiumSoundVolume * 2.7);
    localStorage.setItem("npgStadiumVolume", String(stadiumSoundVolume));
    momentEl.textContent = `Ambiente ${Math.round(stadiumSoundVolume * 100)}%`;
    phraseTimer = 2;
    return;
  }
  menuMusicVolume = THREE.MathUtils.clamp(menuMusicVolume + step, 0, 1);
  menuMusic.volume = menuMusicVolume;
  localStorage.setItem("npgMenuVolume", String(menuMusicVolume));
  updateMusicButton();
}

function startMenuMusic() {
  setupAudio();
  stopAudio(stadiumLoop);
  if (menuMusic.paused && menuMusic.currentTime > 0.25) menuMusic.currentTime = 0;
  if (!menuMusicMuted) safePlay(menuMusic);
}

function startStadiumAudio() {
  setupAudio();
  stopAudio(menuMusic);
  if (!stadiumSoundMuted) safePlay(stadiumLoop);
}

function stopGameAudio() {
  stopAudio(stadiumLoop);
  stopAudio(goalSound);
}

function toggleMenuMusic() {
  setupAudio();
  menuMusicMuted = !menuMusicMuted;
  if (!menuMusicMuted && menuMusicVolume <= 0.001) {
    menuMusicVolume = 0.5;
    menuMusic.volume = menuMusicVolume;
    localStorage.setItem("npgMenuVolume", String(menuMusicVolume));
  }
  updateMusicButton();
  if (menuMusicMuted) {
    stopAudio(menuMusic);
    return;
  }
  if (menu.classList.contains("is-active")) startMenuMusic();
}

function toggleStadiumSound() {
  setupAudio();
  stadiumSoundMuted = !stadiumSoundMuted;
  if (stadiumSoundMuted) {
    stopAudio(stadiumLoop);
    stopAudio(goalSound);
    return;
  }
  if (gameScreen.classList.contains("is-active")) startStadiumAudio();
}

function toggleMute() {
  if (gameScreen.classList.contains("is-active")) toggleStadiumSound();
  else toggleMenuMusic();
}

function unlockMenuAudio() {
  if (menu.classList.contains("is-active") && !menuMusicMuted) startMenuMusic();
}

function unlockMobileStadiumAudio() {
  setupAudio();
  if (!stadiumLoop.paused || stadiumSoundMuted) return;
  const intendedVolume = stadiumSoundVolume;
  stadiumLoop.volume = 0;
  const promise = stadiumLoop.play();
  if (!promise?.then) return;
  promise.then(() => {
    stadiumLoop.volume = intendedVolume;
    if (!gameScreen.classList.contains("is-active") || stadiumSoundMuted) stadiumLoop.pause();
  }).catch(() => {
    stadiumLoop.volume = intendedVolume;
  });
}

document.addEventListener("pointerdown", () => {
  unlockMenuAudio();
  unlockMobileStadiumAudio();
});
document.addEventListener("keydown", unlockMenuAudio);

function updateServerStatus(text) {
  if (serverStatus) serverStatus.textContent = text;
}

function updateConnectionUi() {
  const connected = Boolean(onlineMode && socket?.connected);
  if (createRoomBtn) createRoomBtn.disabled = !connected;
  createRoomBtn?.classList.toggle("is-loading", !connected);
  if (connectServerBtn) connectServerBtn.textContent = connected ? "Reconectar" : "Conectar";
}

function getEnteredPlayerName() {
  return (playerNameInput?.value || "").trim().slice(0, 18);
}

function requestPlayerIdentity(title, action, { includeRoom = false } = {}) {
  pendingIdentityAction = action;
  pendingIdentityNeedsRoom = includeRoom;
  playerNameDialogTitle.textContent = title;
  playerNameInput.value = onlinePlayerName;
  createRoomFields.hidden = !includeRoom;
  playerNameDialog.hidden = false;
  requestAnimationFrame(() => {
    playerNameInput.focus();
    playerNameInput.select();
  });
}

function closePlayerIdentity() {
  pendingIdentityAction = null;
  pendingIdentityNeedsRoom = false;
  createRoomFields.hidden = true;
  playerNameDialog.hidden = true;
}

function saveEnteredPlayerName() {
  const enteredName = getEnteredPlayerName();
  if (!enteredName) {
    playerNameInput.focus();
    return false;
  }
  onlinePlayerName = enteredName;
  localStorage.setItem("npgPlayerName", onlinePlayerName);
  return true;
}

function joinOnlineRoom(roomId) {
  if (!onlineMode || !socket?.connected) return;
  socket.emit("room:join", {
    roomId,
    playerName: onlinePlayerName,
  }, (response) => {
    if (response?.ok) {
      networkSessionReady = true;
      activeRoom = response.room;
      selectedPlayerId = clientPlayerId;
      if (response.room.started) {
        spectatorViewing = false;
        startGame({ multiplayer: true });
        openRoomOverlay();
      } else {
        showRoomLobbyPreview();
      }
    } else {
      updateServerStatus(response?.error || "No pude entrar");
    }
  });
}

function loadSocketClient(url) {
  return new Promise((resolve, reject) => {
    if (window.io) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `${url.replace(/\/$/, "")}/socket.io/socket.io.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error("No pude cargar Socket.IO"));
    document.head.appendChild(script);
  });
}

async function connectOnlineServer() {
  const url = (serverUrlInput.value || socketServerUrl || "").trim().replace(/\/$/, "");
  if (!url) {
    updateServerStatus("Falta URL");
    return;
  }
  localStorage.setItem("npgServerUrl", url);
  socketServerUrl = url;
  roomListState = "loading";
  updateServerStatus("Conectando...");
  updateConnectionUi();
  renderRoomList();

  try {
    await loadSocketClient(url);
    if (socket) socket.disconnect();
    socket = window.io(url, {
      transports: ["websocket", "polling"],
      auth: { playerId: clientPlayerId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      timeout: 12000,
    });
    socket.on("connect", () => {
      onlineMode = true;
      updateServerStatus(`Online ${socket.id.slice(0, 4)}`);
      updateConnectionUi();
      if (activeRoom?.id) {
        networkSessionReady = false;
        socket.emit("room:resume", { roomId: activeRoom.id }, (response) => {
          if (!response?.ok) {
            networkSessionReady = false;
            handleRoomClosed();
            return;
          }
          activeRoom = response.room;
          networkSessionReady = true;
          selectedPlayerId = clientPlayerId;
          currentMatchId = response.room.matchState?.matchId || currentMatchId;
          if (multiplayerMode && response.room.matchState) {
            applyAuthoritativeSnapshot(response.room.matchState, true);
            syncMultiplayerTeamsToField({ preserveLocal: true });
            momentEl.textContent = "Conexion recuperada";
            phraseTimer = 2;
          } else if (roomScreen.classList.contains("is-active")) {
            renderRoom();
          }
        });
      } else {
        networkSessionReady = true;
      }
      socket.emit("rooms:list", (response) => {
        if (response?.ok) {
          multiplayerRooms = response.rooms;
          roomListState = "ready";
          renderRoomList();
        }
      });
    });
    socket.on("disconnect", () => {
      onlineMode = false;
      networkSessionReady = false;
      keys.clear();
      touchSprintActive = false;
      resetTouchStick();
      if (multiplayerMode) {
        momentEl.textContent = "Reconectando...";
        phraseTimer = 999;
      }
      roomListState = "loading";
      updateServerStatus("Reconectando...");
      updateConnectionUi();
      renderRoomList();
    });
    socket.on("connect_error", () => {
      onlineMode = false;
      roomListState = "error";
      updateServerStatus("Sin conexión. Revisa el engranaje.");
      updateConnectionUi();
      renderRoomList();
    });
    socket.on("rooms:update", (rooms) => {
      if (!onlineMode) return;
      multiplayerRooms = rooms;
      roomListState = "ready";
      renderRoomList();
    });
    socket.on("room:state", (room) => {
      const previousLocalTeam = activeRoom?.players.find((roomPlayer) => roomPlayer.id === getLocalPlayerId())?.team;
      activeRoom = room;
      roomLocked = Boolean(room.locked);
      selectedPlayerId = selectedPlayerId && room.players.some((roomPlayer) => roomPlayer.id === selectedPlayerId)
        ? selectedPlayerId
        : clientPlayerId;
      if (roomScreen.classList.contains("is-active")) renderRoom();
      updateSpectatorNotice();
      if (multiplayerMode) {
        const nextLocalTeam = room.players.find((roomPlayer) => roomPlayer.id === getLocalPlayerId())?.team;
        if (nextLocalTeam === "spectators" && previousLocalTeam !== "spectators" && room.started) {
          enterLiveSpectatorMode();
        } else if (nextLocalTeam !== "spectators") {
          spectatorViewing = false;
        }
        syncMultiplayerTeamsToField({ preserveLocal: previousLocalTeam === nextLocalTeam });
        if (previousLocalTeam !== nextLocalTeam) updateGameplayControlHints();
        if (room.matchState && previousLocalTeam !== nextLocalTeam) {
          applyAuthoritativeSnapshot(room.matchState, true);
        }
      }
    });
    socket.on("room:started", (room) => {
      if (matchEndRoomTimer) {
        clearTimeout(matchEndRoomTimer);
        matchEndRoomTimer = 0;
      }
      goalBanner.classList.remove("show", "final-result");
      activeRoom = room;
      activeRoom.started = true;
      currentMatchId = room.matchState?.matchId || null;
      spectatorViewing = getLocalRoomPlayer()?.team === "spectators";
      roomTimeInput.value = room.settings?.timeLimit || 5;
      roomUnlimitedToggle.checked = room.settings?.unlimited === true;
      roomTimeInput.disabled = roomUnlimitedToggle.checked;
      roomScoreInput.value = room.settings?.scoreLimit || 9;
      roomProModeToggle.checked = room.settings?.proMode === true;
      roomKeeperToggle.checked = room.settings?.keeperEnabled === true;
      roomSprintToggle.checked = room.settings?.limitedSprint !== false;
      startGame({ multiplayer: true });
    });
    socket.on("room:ended", (room) => {
      activeRoom = room;
      finishMatch();
    });
    socket.on("room:closed", (payload) => {
      handleRoomClosed(payload);
    });
    socket.on("match:snapshot", (snapshot) => {
      applyAuthoritativeSnapshot(snapshot);
    });
    socket.on("spectator:confetti", ({ playerId, matchId } = {}) => {
      if (matchId !== currentMatchId) return;
      const unit = playerId === getLocalPlayerId()
        ? player
        : multiplayerActors.find((actor) => actor.userData.playerId === playerId);
      if (unit?.visible) spawnSpectatorConfetti(unit.position);
    });
    socket.on("ball:kicked", (kick) => {
      if (kick.playerId !== getLocalPlayerId()) {
        playKickSound(kick.soundKind || "shot", Number(kick.chargeRatio) || 0);
        const direction = new THREE.Vector3(Number(kick.dir?.x) || 0, 0, Number(kick.dir?.z) || 0);
        if (direction.lengthSq() > 0.001) spawnBallTrail(direction.normalize(), Number(kick.chargeRatio) || 0);
      }
    });
    socket.on("ball:kick-rejected", ({ kickId } = {}) => {
      if (kickId && kickId === pendingLocalKickId) {
        pendingLocalKickId = null;
        localBallPredictionBlockedUntil = 0;
      }
    });
    socket.on("match:score", (payload) => {
      applyNetworkScore(payload);
    });
  } catch {
    onlineMode = false;
    updateServerStatus("Error servidor");
    updateConnectionUi();
    renderRoomList();
  }
}

function createKitTexture(team = "neutral") {
  return makeCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = team === "red" ? "#ff3155" : team === "blue" ? "#2e66ff" : "#f8fbff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = team === "neutral" ? "#101313" : "#f8fbff";
    ctx.fillRect(0, 0, w, 24);
    ctx.fillStyle = "#101313";
    ctx.fillRect(0, h - 20, w, 20);
    ctx.save();
    ctx.translate(w * 0.2, h * 0.2);
    ctx.rotate(-0.72);
    ctx.fillRect(0, 0, 28, h * 0.92);
    ctx.restore();
    ctx.fillStyle = team === "neutral" ? "#0b0e0e" : "#ffffff";
    ctx.font = "900 54px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAYNE", w / 2, 124);
    ctx.font = "900 84px Arial";
    ctx.fillText("2", w / 2, 204);
    ctx.fillStyle = team === "neutral" ? "#121616" : "rgba(255,255,255,0.92)";
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.ellipse(62 + i * 9, 58 + i * 10, 8, 24, -0.75, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function createBallTexture() {
  return makeCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const patch = (x, y, r, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#080b0c";
      ctx.fill();
      ctx.restore();
    };

    patch(w * 0.5, h * 0.5, 32, 0.1);
    patch(w * 0.2, h * 0.26, 24, -0.5);
    patch(w * 0.82, h * 0.28, 24, 0.45);
    patch(w * 0.28, h * 0.78, 24, 0.25);
    patch(w * 0.76, h * 0.74, 24, -0.3);
    patch(w * 0.04, h * 0.52, 20, 0.2);
    patch(w * 0.96, h * 0.54, 20, -0.2);

    ctx.strokeStyle = "rgba(8, 11, 12, 0.55)";
    ctx.lineWidth = 5;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 36 + i * 18, i * 0.45, Math.PI + i * 0.45);
      ctx.stroke();
    }
  });
}

function createScoreboardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  stadiumScoreCtx = canvas.getContext("2d");
  stadiumScoreTexture = new THREE.CanvasTexture(canvas);
  stadiumScoreTexture.colorSpace = THREE.SRGBColorSpace;
  updateStadiumScoreboard();
  return stadiumScoreTexture;
}

function updateStadiumScoreboard() {
  if (!stadiumScoreCtx || !stadiumScoreTexture) return;
  const ctx = stadiumScoreCtx;
  ctx.clearRect(0, 0, 512, 256);
  ctx.fillStyle = "#0b0d0f";
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = "#3c464d";
  ctx.lineWidth = 18;
  ctx.strokeRect(12, 12, 488, 232);
  ctx.fillStyle = "#ffffff";
  ctx.font = multiplayerMode ? "900 68px Arial" : "900 92px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(multiplayerMode ? `${redScore} - ${blueScore}` : `${score} - 0`, 256, 124);
  ctx.font = "900 24px Arial";
  ctx.fillStyle = "#7cffb2";
  ctx.fillText(multiplayerMode ? "ROJO        AZUL" : "FUTBOL WORLD CUP", 256, 44);
  ctx.font = "800 28px Arial";
  ctx.fillStyle = "#dce8ed";
  ctx.fillText(stadiumTimerText || (multiplayerMode ? "00:00" : "ENTRENAMIENTO"), 256, 204);
  stadiumScoreTexture.needsUpdate = true;
}

function createPlayer(isHero = false, team = "red") {
  const group = new THREE.Group();
  const limbs = { arms: [], legs: [] };
  const kit = isHero
    ? new THREE.MeshStandardMaterial({ map: createKitTexture(multiplayerMode ? team : "neutral"), roughness: 0.52 })
    : new THREE.MeshStandardMaterial({
        color: team === "blue" ? 0x2457d6 : team === "spectators" ? 0xf2c84b : 0xa5182d,
        roughness: 0.62,
      });
  const skin = new THREE.MeshStandardMaterial({ color: 0xd7a36f, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: isHero ? 0x101010 : 0x16203a, roughness: 0.7 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.55, 0.62), kit);
  body.position.y = 2.1;
  group.userData.body = body;
  group.userData.isHero = isHero;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 16), skin);
  head.position.y = 3.12;
  group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), dark);
  hair.position.y = 3.25;
  group.add(hair);

  const shorts = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.4, 0.6), dark);
  shorts.position.y = 1.14;
  group.add(shorts);

  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.92, 8, 12), skin);
    arm.position.set(side * 0.74, 2.08, 0);
    arm.rotation.z = side * 0.18;
    arm.userData.side = side;
    group.add(arm);
    limbs.arms.push(arm);

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 1.02, 8, 12), dark);
    leg.position.set(side * 0.28, 0.54, 0);
    leg.userData.side = side;
    group.add(leg);
    limbs.legs.push(leg);
  }

  group.userData.baseY = group.position.y;
  group.userData.limbs = limbs;
  group.userData.walkTime = Math.random() * Math.PI * 2;
  return group;
}

function roomKeepersEnabled() {
  if (!multiplayerMode) return false;
  if (activeRoom?.settings) return activeRoom.settings.keeperEnabled === true;
  return roomKeeperToggle?.checked === true;
}

function createGoalkeeper(side = 1, team = "red") {
  const keeper = createPlayer(false, team);
  keeper.scale.set(0.95, 0.95, 0.95);
  keeper.position.set(0, 0, side * (field.length / 2 - 4.5));
  keeper.rotation.y = side > 0 ? Math.PI : 0;
  keeper.userData.side = side;
  scene.add(keeper);
  return {
    unit: keeper,
    side,
    mode: "ready",
    targetX: 0,
    targetZ: side * (field.length / 2 - 4.5),
    diveTimer: 0,
    diveSide: 1,
    clearanceCooldown: 0,
  };
}

function animatePlayerRun(unit, dt, moving) {
  if (!unit.userData.limbs) return;
  const intensity = moving ? 1 : 0;
  unit.userData.walkTime += dt * (moving ? 11 : 5);
  const swing = Math.sin(unit.userData.walkTime) * 0.62 * intensity;

  unit.userData.limbs.arms.forEach((arm) => {
    arm.rotation.x = -swing * arm.userData.side;
    arm.rotation.z = arm.userData.side * 0.18;
  });

  unit.userData.limbs.legs.forEach((leg) => {
    leg.rotation.x = swing * leg.userData.side;
    leg.rotation.z = 0;
  });
}

function getSpectatorFloorHeight(x, z) {
  const sideDistance = Math.abs(x) - (field.width / 2 + 5.4);
  const endDistance = Math.abs(z) - (field.length / 2 + 5.4);
  const onSideStand = Math.abs(x) >= field.width / 2 + 5
    && Math.abs(x) <= field.width / 2 + 15
    && Math.abs(z) <= field.length / 2 + 10;
  const onEndStand = Math.abs(z) >= field.length / 2 + 5
    && Math.abs(z) <= field.length / 2 + 15
    && Math.abs(x) <= field.width / 2 + 10;
  const distance = onSideStand && (!onEndStand || sideDistance >= endDistance)
    ? sideDistance
    : endDistance;
  const row = THREE.MathUtils.clamp(Math.round(distance / 0.74), 0, 12);
  return 1.15 + row * 0.34;
}

function constrainSpectatorToStands(unit) {
  const outerX = field.width / 2 + 14.35;
  const outerZ = field.length / 2 + 14.35;
  const innerX = field.width / 2 + 5;
  const innerZ = field.length / 2 + 5;
  unit.position.x = THREE.MathUtils.clamp(unit.position.x, -outerX, outerX);
  unit.position.z = THREE.MathUtils.clamp(unit.position.z, -outerZ, outerZ);
  if (Math.abs(unit.position.x) < innerX && Math.abs(unit.position.z) < innerZ) {
    const toSide = innerX - Math.abs(unit.position.x);
    const toEnd = innerZ - Math.abs(unit.position.z);
    if (toSide < toEnd) unit.position.x = Math.sign(unit.position.x || 1) * innerX;
    else unit.position.z = Math.sign(unit.position.z || 1) * innerZ;
  }
}

function getTrainingExplorerFloorY(x, z) {
  if (multiplayerMode || !trainingFreeMode) return 0;
  if (x <= trainingTunnelEndX && x >= -75 && Math.abs(z) <= 11.5) {
    return trainingMuseumFloorY;
  }
  const insidePassage = Math.abs(z) <= 3.55;
  if (!insidePassage || x > trainingTunnelStartX) return 0;
  if (x >= trainingTunnelEndX) {
    const progress = THREE.MathUtils.clamp(
      (trainingTunnelStartX - x) / (trainingTunnelStartX - trainingTunnelEndX),
      0,
      1
    );
    return trainingMuseumFloorY * progress;
  }
  return 0;
}

function applyPlayerGroundHeight(moving = false, kickoffTaker = false) {
  const floorY = getTrainingExplorerFloorY(player.position.x, player.position.z);
  if (kickoffTaker) {
    player.position.y = THREE.MathUtils.lerp(player.position.y, floorY, 0.18);
    return;
  }
  const bob = moving ? Math.abs(Math.sin(performance.now() * 0.014)) * 0.08 : 0;
  player.position.y = THREE.MathUtils.lerp(player.position.y, floorY + bob, 0.42);
}

function constrainTrainingExplorer(unit) {
  if (multiplayerMode || !trainingFreeMode) {
    unit.position.x = THREE.MathUtils.clamp(unit.position.x, -field.width / 2 + 2, field.width / 2 - 2);
    unit.position.z = THREE.MathUtils.clamp(unit.position.z, -field.length / 2 + 1.1, field.length / 2 - 1.1);
    return;
  }

  unit.position.x = THREE.MathUtils.clamp(unit.position.x, -75.2, field.width / 2 + 13);
  unit.position.z = THREE.MathUtils.clamp(unit.position.z, -49, 49);
  if (unit.position.x < -48.5 && Math.abs(unit.position.z) > 3.55) {
    unit.position.x = Math.min(unit.position.x, -49.2);
    unit.position.z = THREE.MathUtils.clamp(unit.position.z, -10.95, 10.95);
  } else if (unit.position.x < -49.2) {
    unit.position.x = THREE.MathUtils.clamp(unit.position.x, -74.05, -49.2);
    unit.position.z = THREE.MathUtils.clamp(unit.position.z, -10.95, 10.95);
  } else if (unit.position.x < -25.2) {
    unit.position.z = THREE.MathUtils.clamp(unit.position.z, -3.05, 3.05);
  }
  resolveTrainingPlayerWorldCollisions(unit);
}

function collideBallWithTrainingWorld() {
  if (multiplayerMode || !trainingFreeMode || !ball) return;
  const radius = 0.42;
  for (const box of trainingWorldColliders) {
    const closest = new THREE.Vector3(
      THREE.MathUtils.clamp(ball.position.x, box.min.x, box.max.x),
      THREE.MathUtils.clamp(ball.position.y, box.min.y, box.max.y),
      THREE.MathUtils.clamp(ball.position.z, box.min.z, box.max.z)
    );
    const delta = ball.position.clone().sub(closest);
    if (delta.lengthSq() >= radius * radius) continue;
    const normal = delta.lengthSq() > 0.0001
      ? delta.normalize()
      : new THREE.Vector3(
          Math.abs(ballVelocity.x) > Math.abs(ballVelocity.z) ? -Math.sign(ballVelocity.x || 1) : 0,
          0,
          Math.abs(ballVelocity.z) >= Math.abs(ballVelocity.x) ? -Math.sign(ballVelocity.z || 1) : 0
        );
    ball.position.copy(closest).addScaledVector(normal, radius + 0.02);
    const velocity3 = new THREE.Vector3(ballVelocity.x, ballVerticalVelocity, ballVelocity.z);
    velocity3.reflect(normal).multiplyScalar(0.68);
    ballVelocity.set(velocity3.x, 0, velocity3.z);
    ballVerticalVelocity = velocity3.y;
  }
}

function resolveTrainingPlayerWorldCollisions(unit) {
  if (multiplayerMode || !trainingFreeMode || !unit) return;
  const radius = 0.72;
  for (const box of trainingWorldColliders) {
    if (unit.position.y > box.max.y + 0.5) continue;
    if (unit.position.y + 3.15 < box.min.y) continue;
    const closestX = THREE.MathUtils.clamp(unit.position.x, box.min.x, box.max.x);
    const closestZ = THREE.MathUtils.clamp(unit.position.z, box.min.z, box.max.z);
    const dx = unit.position.x - closestX;
    const dz = unit.position.z - closestZ;
    const distance = Math.hypot(dx, dz);
    if (distance >= radius) continue;
    if (distance > 0.001) {
      unit.position.x += (dx / distance) * (radius - distance);
      unit.position.z += (dz / distance) * (radius - distance);
      continue;
    }
    const distances = [
      { axis: "x", amount: box.min.x - unit.position.x - radius },
      { axis: "x", amount: box.max.x - unit.position.x + radius },
      { axis: "z", amount: box.min.z - unit.position.z - radius },
      { axis: "z", amount: box.max.z - unit.position.z + radius },
    ].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    unit.position[distances[0].axis] += distances[0].amount;
  }
}

function spawnSpectatorConfetti(origin) {
  if (!scene) return;
  const colors = [0xffffff, 0x7cffb2, 0xf7c948, 0x91c9ff, 0xff5671];
  for (let i = 0; i < 28; i += 1) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.11, 0.24),
      new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
      })
    );
    paper.position.copy(origin).add(new THREE.Vector3(
      (Math.random() - 0.5) * 1.2,
      3.1 + Math.random() * 0.8,
      (Math.random() - 0.5) * 1.2
    ));
    paper.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 5.5,
      3.5 + Math.random() * 4,
      (Math.random() - 0.5) * 5.5
    );
    paper.userData.life = 2.6 + Math.random() * 1.2;
    scene.add(paper);
    spectatorConfetti.push(paper);
  }
}

function updateSpectatorConfetti(dt) {
  spectatorConfetti = spectatorConfetti.filter((paper) => {
    paper.userData.life -= dt;
    paper.userData.velocity.y -= 5.5 * dt;
    paper.position.addScaledVector(paper.userData.velocity, dt);
    paper.rotation.x += dt * 5;
    paper.rotation.z += dt * 7;
    paper.material.opacity = THREE.MathUtils.clamp(paper.userData.life / 0.8, 0, 1);
    if (paper.userData.life <= 0) {
      scene.remove(paper);
      return false;
    }
    return true;
  });
}

function createKickArrow() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0xf7c948, transparent: true, opacity: 0.88, side: THREE.DoubleSide });
  const shaft = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 2.2), mat);
  shaft.rotation.x = -Math.PI / 2;
  shaft.position.z = 0.85;
  group.add(shaft);

  const head = new THREE.Mesh(new THREE.CircleGeometry(0.55, 3), mat);
  head.rotation.x = -Math.PI / 2;
  head.rotation.z = Math.PI;
  head.position.z = 2.15;
  group.add(head);

  group.visible = false;
  return group;
}

function addTrainingMuseum() {
  museumGroup = new THREE.Group();
  museumGroup.name = "trainingMuseum";
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x15191c, roughness: 0.88 });
  const darkWallMat = new THREE.MeshBasicMaterial({ color: 0x111619 });
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x202427 });
  const stepMat = new THREE.MeshBasicMaterial({ color: 0x252a2e });
  const ceilingMat = new THREE.MeshBasicMaterial({ color: 0x0b0e10 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x090b0c, roughness: 0.55 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xc5cbce, metalness: 0.35, roughness: 0.42 });
  const redAccentMat = new THREE.MeshStandardMaterial({ color: 0x9f263a, roughness: 0.66 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xbfe5ef,
    transparent: true,
    opacity: 0.2,
    metalness: 0.05,
    roughness: 0.16,
    side: THREE.DoubleSide,
  });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd8ad42, metalness: 0.72, roughness: 0.26 });
  const addBox = (w, h, d, x, y, z, material = wallMat, collidable = true, parent = museumGroup) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    if (collidable) trainingWorldColliders.push(new THREE.Box3().setFromObject(mesh));
    return mesh;
  };
  const addInvisibleCollider = (minX, minY, minZ, maxX, maxY, maxZ) => {
    trainingWorldColliders.push(new THREE.Box3(
      new THREE.Vector3(minX, minY, minZ),
      new THREE.Vector3(maxX, maxY, maxZ)
    ));
  };

  const createShield = (material, scale = 1) => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.72, 0.85);
    shape.lineTo(0.72, 0.85);
    shape.lineTo(0.66, 0.08);
    shape.quadraticCurveTo(0.55, -0.68, 0, -1.02);
    shape.quadraticCurveTo(-0.55, -0.68, -0.66, 0.08);
    shape.closePath();
    const shield = new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
    shield.scale.setScalar(scale);
    return shield;
  };
  // Stadium surfaces become physical only when free mode starts.
  addInvisibleCollider(field.width / 2 + 3.7, 0, -50, field.width / 2 + 15, 9, 50);
  addInvisibleCollider(-field.width / 2 - 15, 0, -50, -field.width / 2 - 3.7, 9, -3.6);
  addInvisibleCollider(-field.width / 2 - 15, 0, 3.6, -field.width / 2 - 3.7, 9, 50);
  addInvisibleCollider(-field.width / 2 - 4, 0, field.length / 2 + 3.7, field.width / 2 + 4, 9, field.length / 2 + 15);
  addInvisibleCollider(-field.width / 2 - 4, 0, -field.length / 2 - 15, field.width / 2 + 4, 9, -field.length / 2 - 3.7);

  // Before the unlock this cover restores the missing stand and green apron.
  trainingTunnelCover = new THREE.Group();
  trainingTunnelCover.name = "trainingTunnelCover";
  const coverStandMat = new THREE.MeshBasicMaterial({ color: 0x344249 });
  const coverSeatRed = new THREE.MeshBasicMaterial({ color: 0xd9274d });
  const coverSeatBlue = new THREE.MeshBasicMaterial({ color: 0x2454c6 });
  const coverApronMat = new THREE.MeshBasicMaterial({ color: 0x14682d });
  const coverGround = new THREE.Mesh(new THREE.PlaneGeometry(50, 26), new THREE.MeshBasicMaterial({ color: 0x203526 }));
  coverGround.rotation.x = -Math.PI / 2;
  coverGround.position.set(-50, -0.085, 0);
  trainingTunnelCover.add(coverGround);
  const coverApron = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), coverApronMat);
  coverApron.rotation.x = -Math.PI / 2;
  coverApron.position.set(-25.5, -0.01, 0);
  trainingTunnelCover.add(coverApron);
  addBox(0.8, 1.35, 8, -field.width / 2 - 4.25, 0.68, 0, coverStandMat, false, trainingTunnelCover);
  for (let row = 0; row < 13; row += 1) {
    const y = 1.15 + row * 0.34;
    const rowX = -field.width / 2 - 5.4 - row * 0.74;
    addBox(0.88, 0.16, 8, rowX, y - 0.17, 0, coverStandMat, false, trainingTunnelCover);
    addBox(
      0.46,
      0.42,
      6.3,
      rowX,
      y,
      0,
      row < 6 ? coverSeatBlue : coverSeatRed,
      false,
      trainingTunnelCover
    );
  }
  addBox(1, 8, 8, -field.width / 2 - 15, 4, 0, new THREE.MeshBasicMaterial({ color: 0x0d1716 }), false, trainingTunnelCover);
  scene.add(trainingTunnelCover);

  // The facade is part of the secret and appears only after the unlock.
  const facade = new THREE.Group();
  facade.name = "trainingMuseumFacade";
  addBox(1.1, 5.2, 0.62, -25.55, 2.6, -4.15, silverMat, false, facade);
  addBox(1.1, 5.2, 0.62, -25.55, 2.6, 4.15, silverMat, false, facade);
  addBox(1.1, 0.65, 8.9, -25.55, 4.88, 0, silverMat, false, facade);
  addBox(1.0, 1.15, 8.2, -25.72, 4.15, 0, darkWallMat, false, facade);
  const facadeShield = createShield(new THREE.MeshBasicMaterial({ color: 0xf2f5f4 }), 0.62);
  facadeShield.rotation.y = Math.PI / 2;
  facadeShield.position.set(-25.08, 4.28, 0);
  facade.add(facadeShield);
  museumGroup.add(facade);

  trainingTunnelSeal = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 4.2, 7.45),
    new THREE.MeshBasicMaterial({ color: 0x010202 })
  );
  trainingTunnelSeal.position.set(-25.86, 2.1, 0);
  trainingTunnelSeal.visible = false;
  scene.add(trainingTunnelSeal);

  // Entrance landing and a long stairway descending six metres underground.
  addBox(2.4, 0.18, 7.5, -26.8, -0.08, 0, floorMat, false);
  const stairCount = 28;
  const stairLength = (trainingTunnelStartX - trainingTunnelEndX) / stairCount;
  for (let index = 0; index < stairCount; index += 1) {
    const progress = (index + 1) / stairCount;
    const topY = trainingMuseumFloorY * progress;
    const x = trainingTunnelStartX - (index + 0.5) * stairLength;
    addBox(stairLength + 0.035, 0.18, 7.25, x, topY - 0.09, 0, stepMat, false);
  }
  addBox(3.2, 0.2, 7.3, -49.5, trainingMuseumFloorY - 0.1, 0, floorMat, false);

  const tunnelCenterY = (4.7 + trainingMuseumFloorY) / 2;
  const tunnelWallHeight = 4.7 - trainingMuseumFloorY;
  addBox(23.7, tunnelWallHeight, 0.42, -37.9, tunnelCenterY, -3.85, darkWallMat);
  addBox(23.7, tunnelWallHeight, 0.42, -37.9, tunnelCenterY, 3.85, darkWallMat);
  // The ceiling follows the descent, keeping roads and exterior scenery out.
  for (let index = 0; index < stairCount; index += 1) {
    const progress = (index + 0.5) / stairCount;
    const floorY = trainingMuseumFloorY * progress;
    const x = trainingTunnelStartX - (index + 0.5) * stairLength;
    addBox(stairLength + 0.04, 0.3, 8.1, x, floorY + 4.45, 0, ceilingMat);
  }

  // Low handrails follow the descent without blocking the view.
  const railMat = new THREE.MeshStandardMaterial({ color: 0x626b70, metalness: 0.38, roughness: 0.42 });
  for (let index = 0; index < 10; index += 1) {
    const progress = index / 9;
    const x = THREE.MathUtils.lerp(trainingTunnelStartX - 0.5, trainingTunnelEndX + 0.7, progress);
    const floorY = THREE.MathUtils.lerp(0, trainingMuseumFloorY, progress);
    for (const z of [-3.25, 3.25]) {
      addBox(0.14, 1.2, 0.14, x, floorY + 0.6, z, railMat, false);
    }
  }

  for (const x of [-30, -35, -40, -45]) {
    const progress = THREE.MathUtils.clamp(
      (trainingTunnelStartX - x) / (trainingTunnelStartX - trainingTunnelEndX),
      0,
      1
    );
    const floorY = trainingMuseumFloorY * progress;
    const tunnelLight = new THREE.PointLight(0xffefd0, 0.48, 9);
    tunnelLight.position.set(x, floorY + 3.35, 0);
    museumGroup.add(tunnelLight);
    addBox(0.16, 0.46, 1.25, x, floorY + 2.75, -3.56, silverMat, false);
    addBox(0.16, 0.46, 1.25, x, floorY + 2.75, 3.56, silverMat, false);
  }

  // Underground gallery with portraits, benches and trophy displays.
  const museumCenterX = -62;
  const museumWallCenterY = trainingMuseumFloorY + 2.8;
  addBox(26, 0.22, 24, museumCenterX, trainingMuseumFloorY - 0.11, 0, floorMat, false);
  addBox(26, 5.8, 0.42, museumCenterX, museumWallCenterY, -12, wallMat);
  addBox(26, 5.8, 0.42, museumCenterX, museumWallCenterY, 12, wallMat);
  addBox(0.42, 5.8, 24, -75, museumWallCenterY, 0, wallMat);
  addBox(0.42, 5.8, 8, -49, museumWallCenterY, -8, wallMat);
  addBox(0.42, 5.8, 8, -49, museumWallCenterY, 8, wallMat);
  addBox(26, 0.34, 24, museumCenterX, trainingMuseumFloorY + 5.72, 0, ceilingMat);

  addBox(25.4, 0.28, 0.06, museumCenterX, trainingMuseumFloorY + 2.1, -11.72, redAccentMat, false);
  addBox(25.4, 0.28, 0.06, museumCenterX, trainingMuseumFloorY + 2.1, 11.72, redAccentMat, false);
  addBox(0.24, 0.28, 23.4, -74.72, trainingMuseumFloorY + 2.1, 0, redAccentMat, false);

  const textureLoader = new THREE.TextureLoader();
  const museumPictures = [
    { file: "./assets/museum/messi.jpg", ratio: 1024 / 683, x: -70.1, side: -1, maxWidth: 5.7 },
    { file: "./assets/museum/argentina-10.jpg", ratio: 1122 / 1402, x: -63.6, side: -1, maxWidth: 3.25 },
    { file: "./assets/museum/maradona.jpg", ratio: 960 / 1407, x: -58.8, side: -1, maxWidth: 2.85 },
    { file: "./assets/museum/pele.jpg", ratio: 640 / 1000, x: -69.6, side: 1, maxWidth: 2.7 },
    { file: "./assets/museum/tim.jpg", ratio: 1147 / 645, x: -59.7, side: 1, maxWidth: 6.2 },
  ];
  museumPictures.forEach((picture, index) => {
    const maxHeight = 3.75;
    const imageWidth = Math.min(picture.maxWidth, maxHeight * picture.ratio);
    const imageHeight = imageWidth / picture.ratio;
    const frameWidth = imageWidth + 0.34;
    const frameHeight = imageHeight + 0.34;
    const z = picture.side * 11.72;
    const y = trainingMuseumFloorY + 3.15;
    addBox(frameWidth, frameHeight, 0.2, picture.x, y, z, frameMat, false);
    const texture = textureLoader.load(picture.file);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(imageWidth, imageHeight),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    );
    portrait.position.set(picture.x, y, z - picture.side * 0.12);
    portrait.rotation.y = picture.side < 0 ? 0 : Math.PI;
    portrait.userData.museumFrame = index;
    museumGroup.add(portrait);
    addBox(
      Math.min(1.7, frameWidth * 0.55),
      0.22,
      0.12,
      picture.x,
      y - frameHeight / 2 - 0.22,
      z - picture.side * 0.17,
      silverMat,
      false
    );
  });

  const backShield = createShield(new THREE.MeshBasicMaterial({ color: 0xf7f7f2 }), 1.28);
  backShield.rotation.y = Math.PI / 2;
  backShield.position.set(-74.66, trainingMuseumFloorY + 3.4, 0);
  museumGroup.add(backShield);
  addBox(0.18, 0.32, 2.2, -74.5, trainingMuseumFloorY + 1.78, 0, silverMat, false);

  const addBench = (x, z, rotation = 0) => {
    const bench = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.32, 1.35), darkWallMat);
    seat.position.y = 1.02;
    bench.add(seat);
    for (const legX of [-2.1, 2.1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.0, 1.08), silverMat);
      leg.position.set(legX, 0.5, 0);
      bench.add(leg);
    }
    bench.position.set(x, trainingMuseumFloorY, z);
    bench.rotation.y = rotation;
    museumGroup.add(bench);
    trainingWorldColliders.push(new THREE.Box3().setFromObject(bench));
  };
  addBench(-65, -4.3);
  addBench(-57, 4.3);

  const addTrophyCase = (x, z, sphere = false) => {
    addBox(2.5, 1.15, 2.5, x, trainingMuseumFloorY + 0.58, z, frameMat);
    addBox(2.7, 3.0, 2.7, x, trainingMuseumFloorY + 2.55, z, glassMat, true);
    if (sphere) {
      const ballDisplay = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 14), goldMat);
      ballDisplay.position.set(x, trainingMuseumFloorY + 2.1, z);
      museumGroup.add(ballDisplay);
    } else {
      const cupBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.28, 0.85, 16), goldMat);
      cupBowl.position.set(x, trainingMuseumFloorY + 2.15, z);
      museumGroup.add(cupBowl);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.55, 12), goldMat);
      stem.position.set(x, trainingMuseumFloorY + 1.5, z);
      museumGroup.add(stem);
    }
  };
  addTrophyCase(-52.7, -7.2, true);
  addTrophyCase(-72.3, 6.8, false);

  for (const x of [-71, -65, -59, -53]) {
    const light = new THREE.PointLight(0xffefd2, 0.52, 10);
    light.position.set(x, trainingMuseumFloorY + 4.75, 0);
    museumGroup.add(light);
  }
  museumGroup.visible = false;
  scene.add(museumGroup);
}

function unlockTrainingFreeMode() {
  if (multiplayerMode || trainingFreeMode) return;
  trainingFreeMode = true;
  if (museumGroup) museumGroup.visible = true;
  if (trainingTunnelSeal) trainingTunnelSeal.visible = false;
  if (trainingTunnelCover) trainingTunnelCover.visible = false;
  goalBanner.textContent = "MODO LIBRE DESBLOQUEADO";
  goalBanner.classList.remove("show");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
  momentEl.textContent = "Los limites desaparecieron. Hay algo oculto bajo la tribuna";
}

function addField({ trainingMode = false } = {}) {
  const cityGroundMat = new THREE.MeshBasicMaterial({ color: 0x203526 });
  const addGroundPlane = (width, depth, x, z, y = -0.09) => {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), cityGroundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(x, y, z);
    scene.add(ground);
  };
  if (trainingMode) {
    // Leave a real opening over the stairway and underground museum.
    addGroundPlane(180, 92, 0, -59);
    addGroundPlane(180, 92, 0, 59);
    addGroundPlane(115, 26, 32.5, 0);
    addGroundPlane(14, 26, -83, 0);
  } else {
    addGroundPlane(180, 210, 0, 0);
  }

  const asphaltMat = new THREE.MeshBasicMaterial({ color: 0x252b2e });
  const roadMat = new THREE.MeshBasicMaterial({ color: 0x171c1f });
  const parkingLineMat = new THREE.MeshBasicMaterial({ color: 0xc8c6a6 });
  const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xe3c84c });
  const sidewalkMat = new THREE.MeshBasicMaterial({ color: 0x697176 });
  const trunkMat = new THREE.MeshBasicMaterial({ color: 0x4b3324 });
  const leavesMat = new THREE.MeshBasicMaterial({ color: 0x287044 });

  const addFlatArea = (width, depth, x, z, material, y = -0.055) => {
    const area = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
    area.rotation.x = -Math.PI / 2;
    area.position.set(x, y, z);
    scene.add(area);
    return area;
  };

  addFlatArea(24, 112, -49, 0, asphaltMat);
  addFlatArea(24, 112, 49, 0, asphaltMat);
  addFlatArea(76, 22, 0, -67, asphaltMat);
  addFlatArea(76, 22, 0, 67, asphaltMat);
  if (trainingMode) {
    const roadSegmentDepth = (194 - 28) / 2;
    const roadSegmentOffset = 14 + roadSegmentDepth / 2;
    addFlatArea(12, roadSegmentDepth, -68, -roadSegmentOffset, roadMat, -0.045);
    addFlatArea(12, roadSegmentDepth, -68, roadSegmentOffset, roadMat, -0.045);
  } else {
    addFlatArea(12, 194, -68, 0, roadMat, -0.045);
  }
  addFlatArea(12, 194, 68, 0, roadMat, -0.045);
  addFlatArea(148, 12, 0, -86, roadMat, -0.045);
  addFlatArea(148, 12, 0, 86, roadMat, -0.045);

  for (const x of [-62, -38, 38, 62]) {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 116), sidewalkMat);
    curb.position.set(x, 0, 0);
    scene.add(curb);
  }
  for (const z of [-79, -55, 55, 79]) {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(80, 0.18, 0.55), sidewalkMat);
    curb.position.set(0, 0, z);
    scene.add(curb);
  }

  const addParkingMark = (x, z, rotation = 0) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.018, 4.6), parkingLineMat);
    line.position.set(x, -0.02, z);
    line.rotation.y = rotation;
    scene.add(line);
  };
  for (const side of [-1, 1]) {
    for (let z = -49; z <= 49; z += 5.5) {
      addParkingMark(side * 44, z);
      addParkingMark(side * 54, z);
    }
    for (let x = -32; x <= 32; x += 5.5) {
      addParkingMark(x, side * 63, Math.PI / 2);
      addParkingMark(x, side * 71, Math.PI / 2);
    }
  }

  const carColors = [0xb9c2c7, 0x285b91, 0x9e2937, 0xe2d168, 0x3b4145, 0xe6e8e9];
  const addParkedCar = (x, z, rotation, colorIndex) => {
    const car = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.48, 3.45),
      new THREE.MeshStandardMaterial({ color: carColors[colorIndex % carColors.length], roughness: 0.68 })
    );
    body.position.y = 0.32;
    car.add(body);
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.42, 1.72),
      new THREE.MeshBasicMaterial({ color: 0x17252c })
    );
    roof.position.set(0, 0.68, -0.15);
    car.add(roof);
    car.position.set(x, 0, z);
    car.rotation.y = rotation;
    scene.add(car);
  };
  for (let i = 0; i < 13; i += 1) {
    const z = -46 + i * 7.5;
    addParkedCar(-49, z, 0, i);
    if (i % 2 === 0) addParkedCar(49, z + 2.4, Math.PI, i + 2);
  }
  for (let i = 0; i < 9; i += 1) {
    const x = -29 + i * 7.3;
    if (i % 2 === 0) addParkedCar(x, -67, Math.PI / 2, i + 1);
    addParkedCar(x, 67, -Math.PI / 2, i + 3);
  }

  for (const x of [-68, 68]) {
    if (trainingMode && x < 0) {
      const lineDepth = (190 - 28) / 2;
      const lineOffset = 14 + lineDepth / 2;
      for (const z of [-lineOffset, lineOffset]) {
        const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, lineDepth), roadLineMat);
        centerLine.position.set(x, -0.015, z);
        scene.add(centerLine);
      }
      continue;
    }
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 190), roadLineMat);
    centerLine.position.set(x, -0.015, 0);
    scene.add(centerLine);
  }
  for (const z of [-86, 86]) {
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(145, 0.02, 0.14), roadLineMat);
    centerLine.position.set(0, -0.015, z);
    scene.add(centerLine);
  }

  const addTree = (x, z, scale = 1) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.22 * scale, 1.7 * scale, 8), trunkMat);
    trunk.position.set(x, 0.78 * scale, z);
    scene.add(trunk);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.9 * scale, 10, 8), leavesMat);
    crown.position.set(x, 2.05 * scale, z);
    scene.add(crown);
  };
  for (let z = -72; z <= 72; z += 12) {
    addTree(-78, z, 0.92 + (Math.abs(z) % 3) * 0.08);
    addTree(78, z + 4, 0.95);
  }
  for (let x = -56; x <= 56; x += 14) {
    addTree(x, -96, 0.9);
    addTree(x + 5, 96, 1);
  }

  const buildingColors = [0x33404a, 0x27333c, 0x3f494f];
  const addBuilding = (x, z, width, depth, height, colorIndex) => {
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshBasicMaterial({ color: buildingColors[colorIndex % buildingColors.length] })
    );
    building.position.set(x, height / 2 - 0.05, z);
    scene.add(building);
  };
  addBuilding(-86, -58, 12, 19, 8, 0);
  addBuilding(-87, 37, 11, 23, 11, 1);
  addBuilding(87, -49, 13, 25, 9, 2);
  addBuilding(86, 45, 14, 20, 7, 0);
  addBuilding(-38, -103, 24, 10, 8, 1);
  addBuilding(34, 103, 30, 10, 10, 2);

  const apronMat = new THREE.MeshBasicMaterial({ color: 0x14682d });
  if (trainingMode) {
    const apronWidth = field.width + 24;
    const apronDepth = field.length + 24;
    const sideDepth = (apronDepth - 9) / 2;
    const sideOffset = 4.5 + sideDepth / 2;
    addFlatArea(apronWidth, sideDepth, 0, -sideOffset, apronMat);
    addFlatArea(apronWidth, sideDepth, 0, sideOffset, apronMat);
    addFlatArea(apronWidth - 9, 9, 4.5, 0, apronMat);
  } else {
    addFlatArea(field.width + 24, field.length + 24, 0, 0, apronMat);
  }

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(field.width, field.length),
    new THREE.MeshBasicMaterial({ color: 0x197a34 })
  );
  grass.rotation.x = -Math.PI / 2;
  scene.add(grass);

  for (let i = 0; i < 10; i += 1) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(field.width, field.length / 10),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x208b3d : 0x156f30, transparent: true, opacity: 0.42 })
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.006, -field.length / 2 + field.length / 20 + i * field.length / 10);
    scene.add(stripe);
  }

  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe8fff0 });
  const addLine = (w, l, x, z) => {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(w, l), lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.014, z);
    scene.add(line);
  };

  const addGroundSegment = (x1, z1, x2, z2, thickness = 0.16) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    const segment = new THREE.Mesh(new THREE.BoxGeometry(length, 0.018, thickness), lineMat);
    segment.position.set((x1 + x2) / 2, 0.024, (z1 + z2) / 2);
    segment.rotation.y = -Math.atan2(dz, dx);
    scene.add(segment);
  };

  addLine(field.width, 0.18, 0, -field.length / 2);
  addLine(field.width, 0.18, 0, field.length / 2);
  addLine(0.18, field.length, -field.width / 2, 0);
  addLine(0.18, field.length, field.width / 2, 0);
  addLine(field.width, 0.14, 0, 0);

  const addPenaltyMarkings = (side) => {
    const boxFrontZ = side * (field.length / 2 - 12);
    const penaltyZ = side * (field.length / 2 - 9.3);
    const radius = 5.9;
    const points = [];
    for (let i = 0; i <= 32; i += 1) {
      const theta = Math.PI * i / 32;
      points.push({
        x: Math.cos(theta) * radius,
        z: boxFrontZ - side * Math.sin(theta) * radius,
      });
    }
    for (let i = 0; i < points.length - 1; i += 1) {
      addGroundSegment(points[i].x, points[i].z, points[i + 1].x, points[i + 1].z, 0.16);
    }

    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), lineMat);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(0, 0.022, penaltyZ);
    scene.add(spot);
  };

  addLine(0.14, 12, -7, field.length / 2 - 6);
  addLine(0.14, 12, 7, field.length / 2 - 6);
  addLine(14, 0.14, 0, field.length / 2 - 12);
  addPenaltyMarkings(1);

  addLine(0.14, 12, -7, -field.length / 2 + 6);
  addLine(0.14, 12, 7, -field.length / 2 + 6);
  addLine(14, 0.14, 0, -field.length / 2 + 12);
  addPenaltyMarkings(-1);

  const centerCircle = new THREE.Mesh(
    new THREE.RingGeometry(5.9, 6.08, 96),
    lineMat
  );
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.y = 0.018;
  scene.add(centerCircle);

  const centerSpot = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 24),
    lineMat
  );
  centerSpot.rotation.x = -Math.PI / 2;
  centerSpot.position.y = 0.019;
  scene.add(centerSpot);

  const singleGoalMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, metalness: 0.1, roughness: 0.35 });
  const redGoalMat = new THREE.MeshStandardMaterial({ color: 0xff3155, metalness: 0.08, roughness: 0.38 });
  const blueGoalMat = new THREE.MeshStandardMaterial({ color: 0x2e66ff, metalness: 0.08, roughness: 0.38 });
  const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 12);
  for (const side of [1, -1]) {
    const goalMat = multiplayerMode ? (side < 0 ? redGoalMat : blueGoalMat) : singleGoalMat;
    const netMat = new THREE.MeshBasicMaterial({
      color: multiplayerMode ? (side < 0 ? 0xff9aa9 : 0x9bb8ff) : 0xdff6ff,
      transparent: true,
      opacity: 0.48,
      side: THREE.DoubleSide,
    });
    const goalLineZ = side * (field.length / 2 + 0.15);
    const backZ = side * (field.length / 2 + 3.2);
    for (const x of [-4.1, 4.1]) {
      const post = new THREE.Mesh(postGeo, goalMat);
      post.position.set(x, 1.6, goalLineZ);
      scene.add(post);

      const backPost = new THREE.Mesh(postGeo, goalMat);
      backPost.position.set(x, 1.6, backZ);
      scene.add(backPost);

      const sideBar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.05, 10), goalMat);
      sideBar.rotation.x = Math.PI / 2;
      sideBar.position.set(x, 3.18, (goalLineZ + backZ) / 2);
      scene.add(sideBar);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 8.4, 12), goalMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 3.18, goalLineZ);
    scene.add(bar);

    const backBar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 8.4, 12), goalMat);
    backBar.rotation.z = Math.PI / 2;
    backBar.position.set(0, 3.18, backZ);
    scene.add(backBar);

    const netBack = new THREE.Mesh(new THREE.PlaneGeometry(8.25, 3.05), netMat);
    netBack.position.set(0, 1.65, backZ);
    scene.add(netBack);

    const roofNet = new THREE.Mesh(new THREE.PlaneGeometry(8.25, 3.05), netMat);
    roofNet.rotation.x = -Math.PI / 2;
    roofNet.position.set(0, 3.16, (goalLineZ + backZ) / 2);
    scene.add(roofNet);

    for (const x of [-4.1, 4.1]) {
      const sideNet = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 3.05), netMat);
      sideNet.rotation.y = Math.PI / 2;
      sideNet.position.set(x, 1.65, (goalLineZ + backZ) / 2);
      scene.add(sideNet);
    }
  }

  const standBaseMat = new THREE.MeshBasicMaterial({ color: 0x26333b });
  const stepMat = new THREE.MeshBasicMaterial({ color: 0x344249 });
  const redSeat = new THREE.MeshBasicMaterial({ color: 0xd9274d });
  const blueSeat = new THREE.MeshBasicMaterial({ color: 0x2454c6 });
  const yellowStep = new THREE.MeshBasicMaterial({ color: 0xf2d84b });
  const shadowMouth = new THREE.MeshBasicMaterial({ color: 0x05090a });

  const addSeatBlock = (x, z, w, d, mat, rot = 0, y = 3.35) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(w, 0.42, d), mat);
    block.position.set(x, y, z);
    block.rotation.y = rot;
    scene.add(block);
    return block;
  };

  const addBackStand = (z, side) => {
    const apronWall = new THREE.Mesh(new THREE.BoxGeometry(field.width + 34, 1.35, 0.8), standBaseMat);
    apronWall.position.set(0, 0.68, side * (field.length / 2 + 4.25));
    scene.add(apronWall);

    for (let row = 0; row < 13; row += 1) {
      const y = 1.15 + row * 0.34;
      const rowZ = side * (field.length / 2 + 5.4 + row * 0.74);
      const tread = new THREE.Mesh(new THREE.BoxGeometry(field.width + 30, 0.16, 0.88), stepMat);
      tread.position.set(0, y - 0.17, rowZ);
      scene.add(tread);

      addSeatBlock(-20, rowZ, 13, 0.46, row < 7 ? blueSeat : redSeat, 0, y);
      addSeatBlock(-6.5, rowZ, 10, 0.46, row < 5 ? redSeat : blueSeat, 0, y);
      addSeatBlock(8, rowZ, 13, 0.46, row < 6 ? blueSeat : redSeat, 0, y);
      addSeatBlock(20, rowZ, 8, 0.46, row < 7 ? redSeat : blueSeat, 0, y);
      addSeatBlock(-13.1, rowZ, 1.45, 0.55, yellowStep, 0, y + 0.04);
      addSeatBlock(15.2, rowZ, 1.45, 0.55, yellowStep, 0, y + 0.04);
    }

    for (const x of [-23, 23]) {
      const tunnel = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.7, 0.42), shadowMouth);
      tunnel.position.set(x, 1.45, side * (field.length / 2 + 4.75));
      scene.add(tunnel);

      const frameMat = new THREE.MeshBasicMaterial({ color: 0xc9d0d3 });
      const frameZ = side * (field.length / 2 + 4.56);
      for (const frameX of [-2.95, 2.95]) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 3.25, 0.28), frameMat);
        pillar.position.set(x + frameX, 1.65, frameZ);
        scene.add(pillar);
      }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.25, 0.38, 0.28), frameMat);
      lintel.position.set(x, 3.08, frameZ);
      scene.add(lintel);
      tunnel.position.z = side * (field.length / 2 + 4.42);
    }
  };

  const addSideStand = (x, side) => {
    const hasTrainingTunnel = trainingMode && side < 0;
    const sideWallX = side * (field.width / 2 + 4.25);
    const addSideSegment = (width, height, depth, segmentX, segmentY, segmentZ, material) => {
      const segment = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      segment.position.set(segmentX, segmentY, segmentZ);
      scene.add(segment);
    };
    if (hasTrainingTunnel) {
      const segmentDepth = (field.length + 24 - 8) / 2;
      const segmentOffset = 4 + segmentDepth / 2;
      addSideSegment(0.8, 1.35, segmentDepth, sideWallX, 0.68, -segmentOffset, standBaseMat);
      addSideSegment(0.8, 1.35, segmentDepth, sideWallX, 0.68, segmentOffset, standBaseMat);
    } else {
      addSideSegment(0.8, 1.35, field.length + 24, sideWallX, 0.68, 0, standBaseMat);
    }

    for (let row = 0; row < 13; row += 1) {
      const y = 1.15 + row * 0.34;
      const rowX = side * (field.width / 2 + 5.4 + row * 0.74);
      if (hasTrainingTunnel) {
        const treadDepth = (field.length + 22 - 8) / 2;
        const treadOffset = 4 + treadDepth / 2;
        addSideSegment(0.88, 0.16, treadDepth, rowX, y - 0.17, -treadOffset, stepMat);
        addSideSegment(0.88, 0.16, treadDepth, rowX, y - 0.17, treadOffset, stepMat);
      } else {
        addSideSegment(0.88, 0.16, field.length + 22, rowX, y - 0.17, 0, stepMat);
      }

      for (let z = -32; z <= 32; z += 8) {
        if (hasTrainingTunnel && Math.abs(z) < 4) continue;
        const mat = Math.floor((z + 32) / 8) % 2 === 0 ? blueSeat : redSeat;
        addSeatBlock(rowX, z, 0.46, 6.3, mat, 0, y);
      }
      addSeatBlock(rowX, -16, 0.55, 1.3, yellowStep, 0, y + 0.04);
      addSeatBlock(rowX, 16, 0.55, 1.3, yellowStep, 0, y + 0.04);
    }
  };

  addBackStand(field.length / 2 + 10, 1);
  addBackStand(-field.length / 2 - 10, -1);
  addSideStand(-field.width / 2 - 10, -1);
  addSideStand(field.width / 2 + 10, 1);

  const scoreTexture = createScoreboardTexture();
  const scoreboardFrame = new THREE.Mesh(
    new THREE.BoxGeometry(11.4, 4.8, 0.55),
    new THREE.MeshBasicMaterial({ color: 0x30383d })
  );
  scoreboardFrame.position.set(field.width / 2 + 4.15, 5.75, 0);
  scoreboardFrame.rotation.y = -Math.PI / 2;
  scene.add(scoreboardFrame);
  const scoreboard = new THREE.Mesh(
    new THREE.PlaneGeometry(10.1, 3.72),
    new THREE.MeshBasicMaterial({ map: scoreTexture, side: THREE.DoubleSide })
  );
  scoreboard.position.set(field.width / 2 + 3.86, 5.75, 0);
  scoreboard.rotation.y = -Math.PI / 2;
  scene.add(scoreboard);

  for (const z of [-4.8, 4.8]) {
    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 3.2, 10), new THREE.MeshBasicMaterial({ color: 0xaab2b5 }));
    support.position.set(field.width / 2 + 4.34, 3.8, z);
    scene.add(support);
  }

  const wallMat = new THREE.MeshBasicMaterial({ color: 0x0d1716 });
  const backWallN = new THREE.Mesh(new THREE.BoxGeometry(field.width + 32, 8, 1), wallMat);
  backWallN.position.set(0, 4, field.length / 2 + 15);
  scene.add(backWallN);
  const backWallS = backWallN.clone();
  backWallS.position.z = -field.length / 2 - 15;
  scene.add(backWallS);
  const backWallE = new THREE.Mesh(new THREE.BoxGeometry(1, 8, field.length + 32), wallMat);
  backWallE.position.set(field.width / 2 + 15, 4, 0);
  scene.add(backWallE);
  if (trainingMode) {
    const wallDepth = (field.length + 32 - 8) / 2;
    const wallOffset = 4 + wallDepth / 2;
    for (const z of [-wallOffset, wallOffset]) {
      const backWallW = new THREE.Mesh(new THREE.BoxGeometry(1, 8, wallDepth), wallMat);
      backWallW.position.set(-field.width / 2 - 15, 4, z);
      scene.add(backWallW);
    }
  } else {
    const backWallW = backWallE.clone();
    backWallW.position.x = -field.width / 2 - 15;
    scene.add(backWallW);
  }

  const upperRingMat = new THREE.MeshBasicMaterial({ color: 0x26333b });
  const upperRingN = new THREE.Mesh(new THREE.BoxGeometry(field.width + 44, 1.1, 1.1), upperRingMat);
  upperRingN.position.set(0, 8.35, field.length / 2 + 14.4);
  scene.add(upperRingN);
  const upperRingS = upperRingN.clone();
  upperRingS.position.z = -field.length / 2 - 14.4;
  scene.add(upperRingS);
  const upperRingE = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, field.length + 44), upperRingMat);
  upperRingE.position.set(field.width / 2 + 14.4, 8.35, 0);
  scene.add(upperRingE);
  const upperRingW = upperRingE.clone();
  upperRingW.position.x = -field.width / 2 - 14.4;
  scene.add(upperRingW);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 180; i += 1) {
    starPositions.push(
      (Math.random() - 0.5) * 120,
      13 + Math.random() * 34,
      (Math.random() - 0.5) * 130
    );
  }
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xe9f7ff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0.86 })
  );
  scene.add(stars);

  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfafff2 });
  const lampRigMat = new THREE.MeshBasicMaterial({ color: 0xc9d0d3 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  const addFloodlight = (x, z, facingSide) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 11.8, 12), lampRigMat);
    pole.position.set(x, 7.6, z + facingSide * 2.4);
    scene.add(pole);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(5.9, 3.85, 0.34), new THREE.MeshBasicMaterial({ color: 0x1b2428 }));
    panel.position.set(x, 13.85, z);
    panel.rotation.y = facingSide > 0 ? Math.PI : 0;
    scene.add(panel);

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 12), lampMat);
        bulb.position.set(x + (col - 1.5) * 1.04, 14.55 - row * 0.88, z - facingSide * 0.24);
        scene.add(bulb);
      }
    }

    const glow = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.8), glowMat);
    glow.position.set(x, 13.85, z - facingSide * 0.34);
    glow.rotation.y = facingSide > 0 ? Math.PI : 0;
    scene.add(glow);

    const light = new THREE.PointLight(0xffffff, 1.25, 78);
    light.position.set(x, 13.2, z - facingSide * 1.2);
    scene.add(light);
  };

  addFloodlight(-23, field.length / 2 + 18, 1);
  addFloodlight(23, field.length / 2 + 18, 1);
  addFloodlight(-23, -field.length / 2 - 18, -1);
  addFloodlight(23, -field.length / 2 - 18, -1);

  if (trainingMode) addTrainingMuseum();
}

function getTeamStartPosition(team, index, total) {
  if (team !== "red" && team !== "blue") return new THREE.Vector3(0, 0, -2.4);
  const side = team === "red" ? -1 : 1;
  const row = Math.floor(index / 4);
  const col = index % 4;
  const spread = Math.min(total, 4);
  const x = (col - (spread - 1) / 2) * 4.6;
  const z = side * (14 + row * 5.2);
  return new THREE.Vector3(
    THREE.MathUtils.clamp(x, -field.width / 2 + 4, field.width / 2 - 4),
    0,
    THREE.MathUtils.clamp(z, -field.length / 2 + 8, field.length / 2 - 8)
  );
}

function getLocalMultiplayerStartPosition() {
  if (!multiplayerMode || !activeRoom) return new THREE.Vector3(0, 0, -31);
  const localPlayer = getLocalRoomPlayer();
  const teamPlayers = activeRoom.players.filter((roomPlayer) => roomPlayer.team === localPlayer.team);
  const teamIndex = Math.max(0, teamPlayers.findIndex((roomPlayer) => roomPlayer.id === localPlayer.id));
  return getMultiplayerStartPositionFor(localPlayer, teamIndex, teamPlayers.length);
}

function getLocalPlayerId() {
  return activeRoom || onlineMode ? clientPlayerId : "local-host";
}

function getUnitPlayerId(unit) {
  if (!unit) return null;
  if (unit === player) return getLocalPlayerId();
  return unit.userData?.playerId || null;
}

function getKickoffPlayerId() {
  if (kickoffTakerId) return kickoffTakerId;
  if (!activeRoom || !kickoffTeam) return null;
  return activeRoom.players.find((roomPlayer) => roomPlayer.team === kickoffTeam)?.id || null;
}

function getKickoffSpot() {
  return new THREE.Vector3(0, 0, 0);
}

function isKickoffTaker(unit) {
  return kickoffLocked && multiplayerMode && getUnitPlayerId(unit) === getKickoffPlayerId();
}

function getMultiplayerStartPositionFor(roomPlayer, index, total) {
  if (roomPlayer?.team === "spectators") {
    const side = index % 2 === 0 ? -1 : 1;
    const row = 3 + (index % 6);
    return new THREE.Vector3(
      side * (field.width / 2 + 5.4 + row * 0.74),
      1.15 + row * 0.34,
      THREE.MathUtils.clamp(-24 + index * 6, -32, 32)
    );
  }
  if (
    kickoffLocked
    && roomPlayer?.team === kickoffTeam
    && roomPlayer.id === getKickoffPlayerId()
  ) {
    return getKickoffSpot();
  }
  return getTeamStartPosition(roomPlayer?.team, index, total);
}

function beginKickoffFor(scoringTeam) {
  if (!multiplayerMode || !activeRoom) return;
  kickoffTeam = scoringTeam === "red" ? "blue" : "red";
  const takerId = getKickoffPlayerId();
  kickoffTakerId = takerId;
  kickoffLocked = Boolean(takerId);
  if (!takerId) {
    kickoffTeam = null;
    kickoffTakerId = null;
  }
  kickoffLockUntil = takerId ? performance.now() + 1350 : 0;
}

function releaseKickoffIfNeeded(kickerTeam, kickerId = null) {
  if (!kickoffLocked || !multiplayerMode) return;
  if (kickerTeam !== kickoffTeam) return;
  if (kickerId && kickerId !== getKickoffPlayerId()) return;
  kickoffLocked = false;
  kickoffTeam = null;
  kickoffTakerId = null;
  kickoffLockUntil = 0;
}

function releaseKickoffIfBallMoved() {
  if (!kickoffLocked || !multiplayerMode || !ball) return;
  const flatDistance = Math.hypot(ball.position.x, ball.position.z);
  if (flatDistance > 0.9 || ballVelocity?.length() > 1.4) releaseKickoffIfNeeded(kickoffTeam, getKickoffPlayerId());
}

function constrainUnitToKickoffHalf(unit) {
  if (!kickoffLocked || !multiplayerMode || !unit?.visible) return;
  if (isKickoffTaker(unit)) {
    const spot = getKickoffSpot();
    unit.position.x = spot.x;
    unit.position.z = spot.z;
    return;
  }
  const team = unit.userData?.team;
  if (team === "red") unit.position.z = Math.min(unit.position.z, -0.35);
  if (team === "blue") unit.position.z = Math.max(unit.position.z, 0.35);
}

function applyNetworkKickoffState(state = {}) {
  if (!multiplayerMode) return;
  const locked = Boolean(state.kickoffLocked);
  if (!locked) {
    kickoffLocked = false;
    kickoffTeam = null;
    kickoffTakerId = null;
    kickoffLockUntil = 0;
    return;
  }
  kickoffTeam = state.kickoffTeam === "red" || state.kickoffTeam === "blue" ? state.kickoffTeam : null;
  kickoffTakerId = typeof state.kickoffTakerId === "string" ? state.kickoffTakerId : null;
  kickoffLocked = Boolean(kickoffTeam && kickoffTakerId);
  kickoffLockUntil = kickoffLocked ? performance.now() + 900 : 0;
}

function isOnlineHost() {
  return onlineMode && socket?.connected && activeRoom?.hostId === clientPlayerId;
}

function isCurrentRoomHost() {
  if (!activeRoom) return false;
  if (onlineMode && socket?.connected) return activeRoom.hostId === clientPlayerId;
  return true;
}

function usesNetworkBallAuthority() {
  return multiplayerMode && Boolean(activeRoom);
}

function getLocalRoomPlayer() {
  if (!activeRoom) return { id: "local-host", name: "davo", team: "red", score: 0 };
  return activeRoom.players.find((roomPlayer) => roomPlayer.id === getLocalPlayerId()) || activeRoom.players[0];
}

function getInitialPlayerAngle() {
  if (!multiplayerMode) return 0;
  const team = getLocalRoomPlayer().team;
  if (team === "spectators") {
    return -Math.sign(player?.position.x || -1) * Math.PI / 4;
  }
  return team === "blue" ? Math.PI : 0;
}

function applyPlayerTeam(unit, team) {
  if (!unit?.userData?.body) return;
  unit.userData.team = team;
  if (unit.userData.isHero) {
    unit.userData.body.material = new THREE.MeshStandardMaterial({
      map: createKitTexture(multiplayerMode ? team : "neutral"),
      roughness: 0.52,
    });
  } else {
    unit.userData.body.material = new THREE.MeshStandardMaterial({
      color: team === "blue" ? 0x2457d6 : team === "spectators" ? 0xf2c84b : 0xa5182d,
      roughness: 0.62,
    });
  }
}

function syncMultiplayerTeamsToField({ preserveLocal = false } = {}) {
  if (!multiplayerMode || !activeRoom || !scene || !player) return;

  if (!preserveLocal) {
    ballControlled = false;
    ballOwner = null;
  }
  multiplayerActors.forEach((actor) => scene.remove(actor));
  multiplayerActors = [];

  const localPlayer = getLocalRoomPlayer();
  player.userData.name = localPlayer.name;
  player.userData.isLocal = true;
  player.visible = localPlayer.team === "red"
    || localPlayer.team === "blue"
    || (localPlayer.team === "spectators" && spectatorViewing);
  if (player.visible) {
    applyPlayerTeam(player, localPlayer.team);
    if (!preserveLocal) {
      player.position.copy(getLocalMultiplayerStartPosition());
      playerAngle = getInitialPlayerAngle();
      player.rotation.y = playerAngle;
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    }
  }

  addMultiplayerActors();
  setupPlayerTags();
}

function applyRemotePlayerState(playerId, state) {
  if (!multiplayerMode || !state || playerId === getLocalPlayerId()) return;
  const actor = multiplayerActors.find((unit) => unit.userData.playerId === playerId);
  if (!actor) return;
  const seq = Number(state.seq) || 0;
  if (seq && actor.userData.netSeq && seq <= actor.userData.netSeq) return;
  if (seq) actor.userData.netSeq = seq;
  actor.userData.netTarget ||= new THREE.Vector3();
  const remoteLead = 0.065;
  actor.userData.netTarget.set(
    (Number(state.x) || 0) + (Number(state.vx) || 0) * remoteLead,
    state.y || 0,
    (Number(state.z) || 0) + (Number(state.vz) || 0) * remoteLead
  );
  if (kickoffLocked) {
    if (isKickoffTaker(actor)) {
      actor.userData.netTarget.copy(getKickoffSpot());
    } else {
      if (actor.userData.team === "red") actor.userData.netTarget.z = Math.min(actor.userData.netTarget.z, -0.35);
      if (actor.userData.team === "blue") actor.userData.netTarget.z = Math.max(actor.userData.netTarget.z, 0.35);
    }
  }
  if (actor.position.distanceTo(actor.userData.netTarget) > 7) actor.position.copy(actor.userData.netTarget);
  actor.userData.netAngle = state.angle || 0;
  actor.userData.netMoving = Boolean(state.moving);
  actor.userData.netUpdatedAt = performance.now();
}

function updateRemoteActors(dt) {
  if (!multiplayerMode) return;
  multiplayerActors.forEach((actor) => {
    if (!actor.userData.netTarget) return;
    const blend = 1 - Math.pow(0.0009, dt);
    actor.position.lerp(actor.userData.netTarget, blend);
    const angleDelta = Math.atan2(
      Math.sin((actor.userData.netAngle || 0) - actor.rotation.y),
      Math.cos((actor.userData.netAngle || 0) - actor.rotation.y)
    );
    actor.rotation.y += angleDelta * blend;
    animatePlayerRun(actor, dt, Boolean(actor.userData.netMoving));
  });
}

function sprintIsLimited() {
  if (!multiplayerMode) return true;
  if (getLocalRoomPlayer()?.team === "spectators") return false;
  return activeRoom?.settings?.limitedSprint !== false;
}

function sprintRequested() {
  return touchSprintActive || keys.has("ShiftLeft");
}

function playerMovementRequested() {
  if (touchMoveVector.lengthSq() >= 0.006) return true;
  return keys.has("KeyW") || keys.has("ArrowUp")
    || keys.has("KeyS") || keys.has("ArrowDown")
    || keys.has("KeyA") || keys.has("ArrowLeft")
    || keys.has("KeyD") || keys.has("ArrowRight");
}

function sprintActive() {
  return sprintRequested()
    && (!sprintIsLimited() || (sprintEnergy > 0 && sprintRechargeDelay <= 0));
}

function updateSprintState(dt) {
  const limited = sprintIsLimited();
  sprintMeter?.classList.toggle("is-visible", limited && player?.visible && !lobbyPreviewMode);
  if (!limited) {
    sprintEnergy = 1;
    sprintRechargeDelay = 0;
  } else {
    const consuming = sprintRequested()
      && playerMovementRequested()
      && sprintEnergy > 0
      && sprintRechargeDelay <= 0;
    if (consuming) {
      sprintEnergy = Math.max(0, sprintEnergy - dt / sprintDrainSeconds);
      if (sprintEnergy <= 0) sprintRechargeDelay = sprintEmptyDelaySeconds;
    } else if (sprintRechargeDelay > 0) {
      sprintRechargeDelay = Math.max(0, sprintRechargeDelay - dt);
    } else {
      sprintEnergy = Math.min(1, sprintEnergy + dt / sprintRechargeSeconds);
    }
  }
  if (sprintFill) sprintFill.style.transform = `scaleX(${THREE.MathUtils.clamp(sprintEnergy, 0, 1)})`;
  sprintMeter?.classList.toggle("is-empty-delay", sprintRechargeDelay > 0);
}

function getLocalNetworkVelocity() {
  if (isKickoffTaker(player)) return new THREE.Vector3();
  const sprintMultiplier = sprintActive() ? 1.35 : 1;
  const baseSpeed = getLocalRoomPlayer()?.team === "spectators" ? 8.2 : 10.5;
  if (touchMoveVector.lengthSq() >= 0.006) {
    const analog = THREE.MathUtils.clamp(touchMoveVector.length(), 0.28, 1);
    const throttleScale = cameraMode === "broadcast"
      ? analog
      : Math.abs(touchMoveVector.y) * analog;
    return playerMoveDir.clone().normalize().multiplyScalar(baseSpeed * sprintMultiplier * throttleScale);
  }
  const moving = cameraMode === "broadcast"
    ? keys.has("KeyW") || keys.has("ArrowUp")
      || keys.has("KeyS") || keys.has("ArrowDown")
      || keys.has("KeyA") || keys.has("ArrowLeft")
      || keys.has("KeyD") || keys.has("ArrowRight")
    : keys.has("KeyW") || keys.has("ArrowUp")
      || keys.has("KeyS") || keys.has("ArrowDown");
  if (!moving || playerMoveDir.lengthSq() < 0.001) return new THREE.Vector3();
  return playerMoveDir.clone().normalize().multiplyScalar(baseSpeed * sprintMultiplier);
}

function emitLocalPlayerState() {
  if (!onlineMode || !socket?.connected || !multiplayerMode || !player?.visible) return;
  constrainUnitToKickoffHalf(player);
  const now = performance.now();
  if (now - lastNetStateAt < 33) return;
  lastNetStateAt = now;
  const velocity = getLocalNetworkVelocity();
  (socket.volatile || socket).emit("player:input", {
    matchId: currentMatchId,
    seq: ++localInputSeq,
    angle: player.rotation.y,
    vx: velocity.x,
    vz: velocity.z,
    jump: spectatorJumpQueued,
    sprinting: sprintActive(),
  });
  spectatorJumpQueued = false;
}

function emitBallState() {
  // Multiplayer ball state is produced exclusively by the server.
}

function applyNetworkBallState(state = {}) {
  if (!usesNetworkBallAuthority() || !ball || !ballVelocity) return;
  const seq = Number(state.seq) || 0;
  if (seq && seq <= lastNetworkBallSeq) return;
  if (seq) lastNetworkBallSeq = seq;
  applyNetworkKickoffState(state);
  networkBallOwnerId = state.ownerId || null;
  if (performance.now() < kickoffLockUntil) networkBallOwnerId = null;
  if (pendingLocalKickId && state.lastKickId === pendingLocalKickId) {
    pendingLocalKickId = null;
    localBallPredictionBlockedUntil = performance.now() + 180;
  }
  if (
    networkBallOwnerId === getLocalPlayerId()
    && !pendingLocalKickId
    && performance.now() > localBallPredictionBlockedUntil
    && !proModeEnabled
    && player?.visible
  ) {
    ballControlled = true;
    ballOwner = player;
    ballVerticalVelocity = 0;
    ballShotCharge = 0;
    return;
  }
  networkBallTarget.set(
    (Number(state.x) || 0) + (Number(state.vx) || 0) * 0.045,
    Math.max(0.42, (Number(state.y) || 0.42) + (Number(state.vy) || 0) * 0.045),
    (Number(state.z) || 0) + (Number(state.vz) || 0) * 0.045
  );
  networkBallVelocity.set(Number(state.vx) || 0, 0, Number(state.vz) || 0);
  if (kickoffLocked && (Math.hypot(networkBallTarget.x, networkBallTarget.z) > 0.9 || networkBallVelocity.length() > 1.4)) {
    releaseKickoffIfNeeded(kickoffTeam, getKickoffPlayerId());
  }
  if (ball.position.distanceTo(networkBallTarget) > 8) ball.position.copy(networkBallTarget);
  ballVelocity.copy(networkBallVelocity);
  ballVerticalVelocity = Number(state.vy) || 0;
  ballShotCharge = Number(state.charge) || 0;
  ballControlled = false;
  ballOwner = null;
}

function applyAuthoritativeSnapshot(snapshot = {}, immediate = false) {
  if (!usesNetworkBallAuthority() || !snapshot || !ball || !player) return;
  const snapshotMatchId = typeof snapshot.matchId === "string" ? snapshot.matchId : null;
  if (currentMatchId && snapshotMatchId !== currentMatchId) return;
  if (!currentMatchId && snapshotMatchId) currentMatchId = snapshotMatchId;
  if (activeRoom) activeRoom.matchState = snapshot;
  const seq = Number(snapshot.seq) || 0;
  if (seq && seq <= lastSnapshotSeq) return;
  if (seq) lastSnapshotSeq = seq;

  if (snapshot.matchEndsAt) {
    activeRoom.matchEndsAt = snapshot.matchEndsAt;
    remaining = Math.max(0, (Number(snapshot.matchEndsAt) - Date.now()) / 1000);
  }
  if (snapshot.scores) {
    redScore = Number(snapshot.scores.red) || 0;
    blueScore = Number(snapshot.scores.blue) || 0;
    scoreEl.textContent = `Rojo ${redScore} - ${blueScore} Azul`;
    updateStadiumScoreboard();
    if (activeRoom) activeRoom.scores = { red: redScore, blue: blueScore };
  }
  applyNetworkKickoffState(snapshot);

  (snapshot.players || []).forEach((state) => {
    if (state.id === getLocalPlayerId()) {
      const snapshotAge = THREE.MathUtils.clamp((Date.now() - (Number(snapshot.serverTime) || Date.now())) / 1000, 0, 0.16);
      authoritativeLocalTarget.set(
        (Number(state.x) || 0) + (Number(state.vx) || 0) * snapshotAge,
        Number(state.y) || 0,
        (Number(state.z) || 0) + (Number(state.vz) || 0) * snapshotAge
      );
      hasAuthoritativeLocalTarget = true;
      const error = player.position.distanceTo(authoritativeLocalTarget);
      if (immediate || error > 4.5) {
        player.position.copy(authoritativeLocalTarget);
      } else if (error > 0.28) {
        player.position.lerp(authoritativeLocalTarget, error > 1.2 ? 0.28 : 0.07);
      }
      if (Number.isFinite(Number(state.sprintEnergy))) {
        const serverEnergy = THREE.MathUtils.clamp(Number(state.sprintEnergy), 0, 1);
        sprintEnergy = immediate ? serverEnergy : THREE.MathUtils.lerp(sprintEnergy, serverEnergy, 0.18);
      }
      if (Number.isFinite(Number(state.sprintRechargeDelay))) {
        sprintRechargeDelay = Math.max(0, Number(state.sprintRechargeDelay));
      }
      return;
    }
    applyRemotePlayerState(state.id, { ...state, seq });
  });

  if (snapshot.ball) {
    applyNetworkBallState({
      ...snapshot.ball,
      seq,
      kickoffLocked: snapshot.kickoffLocked,
      kickoffTeam: snapshot.kickoffTeam,
      kickoffTakerId: snapshot.kickoffTakerId,
    });
  }

  if (Array.isArray(snapshot.keepers) && goalKeepers.length) {
    snapshot.keepers.forEach((keeperSnapshot) => {
      const state = goalKeepers.find((candidate) => candidate.side === keeperSnapshot.side);
      if (!state) return;
      state.mode = keeperSnapshot.mode || "ready";
      state.targetX = Number(keeperSnapshot.targetX) || 0;
      state.unit.position.set(
        Number(keeperSnapshot.x) || 0,
        Number(keeperSnapshot.y) || 0,
        Number(keeperSnapshot.z) || 0
      );
      state.unit.rotation.y = state.side > 0 ? Math.PI : 0;
      state.unit.rotation.z = state.mode === "dive"
        ? (state.targetX >= state.unit.position.x ? -1.24 : 1.24)
        : 0;
      if (state.unit.userData.limbs) {
        state.unit.userData.limbs.legs.forEach((leg) => {
          leg.rotation.x = state.mode === "clear" ? -leg.userData.side * 0.95 : 0;
        });
        state.unit.userData.limbs.arms.forEach((arm) => {
          arm.rotation.x = state.mode === "clear" ? arm.userData.side * 0.42 : 0;
        });
      }
    });
  }
}

function applyNetworkKickRequest(kick = {}) {
  if (!usesNetworkBallAuthority() || !isOnlineHost() || !ball || !ballVelocity) return;
  const actor = multiplayerActors.find((unit) => unit.userData.playerId === kick.playerId);
  if (!actor?.visible || actor.position.distanceTo(ball.position) > 3.65) return;
  if (kickoffLocked && (!isKickoffTaker(actor) || actor.userData?.team !== kickoffTeam)) return;
  const chargeRatio = THREE.MathUtils.clamp(Number(kick.chargeRatio) || 0, 0, 1);
  const power = THREE.MathUtils.clamp(Number(kick.power) || 0, 0, 52);
  const dir = new THREE.Vector3(Number(kick.dir?.x) || 0, 0, Number(kick.dir?.z) || 0);
  if (dir.lengthSq() < 0.001) dir.copy(ball.position).sub(actor.position).setY(0);
  if (dir.lengthSq() < 0.001) return;
  dir.normalize();
  releaseKickoffIfNeeded(actor.userData?.team, getUnitPlayerId(actor));
  lastAppliedKickId = kick.kickId || lastAppliedKickId;
  prepareKeeperForShot(dir, chargeRatio);
  playKickSound(kick.soundKind || "shot", chargeRatio);
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0.58 + chargeRatio * 0.22;
  ballVelocity.addScaledVector(dir, power);
  ballVelocity.clampLength(0, 42);
  ballVerticalVelocity = Math.max(ballVerticalVelocity, Number(kick.liftPower) || 0);
  ballShotCharge = Math.max(ballShotCharge, chargeRatio);
  ball.position.addScaledVector(dir, 0.22);
  spawnBallTrail(dir, chargeRatio);
}

function resetLocalPlayerForKickoff() {
  if (!player || !multiplayerMode) return;
  if (getLocalRoomPlayer()?.team === "spectators") return;
  player.position.copy(getLocalMultiplayerStartPosition());
  playerAngle = getInitialPlayerAngle();
  player.rotation.y = playerAngle;
  playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
}

function applyNetworkScore(payload = {}) {
  if (!multiplayerMode || !payload.scores) return;
  redScore = Number(payload.scores.red) || 0;
  blueScore = Number(payload.scores.blue) || 0;
  scoreEl.textContent = `Rojo ${redScore} - ${blueScore} Azul`;
  updateStadiumScoreboard();

  const scoringTeam = payload.scoringTeam;
  if (!stadiumSoundMuted) {
    setupAudio();
    goalSound.currentTime = 0;
    safePlay(goalSound);
  }
  goalBanner.textContent = scoringTeam === "blue" ? "GOOOL DE AZUL" : "GOOOL DE ROJO";
  goalBanner.classList.remove("show");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
  momentEl.textContent = `${scoringTeam === "blue" ? "Azul" : "Rojo"} mete gol y el estadio entiende todo`;
  beginKickoffFor(scoringTeam);
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0;
  networkBallOwnerId = null;
  pendingLocalKickId = null;
  lastAppliedKickId = null;
  localBallPredictionBlockedUntil = performance.now() + 1400;
  ball.position.set(0, 0.42, 0);
  ballVelocity.set(0, 0, 0);
  networkBallTarget.set(0, 0.42, 0);
  networkBallVelocity.set(0, 0, 0);
  ballVerticalVelocity = 0;
  ballShotCharge = 0;
  goalCooldown = 1.15;
  setTimeout(() => {
    if (!ended) {
      resetLocalPlayerForKickoff();
      goalCooldown = 0;
      momentEl.textContent = "Saque desde el centro";
    }
  }, 950);
}

function addMultiplayerActors() {
  multiplayerActors = [];
  if (!multiplayerMode || !activeRoom) return;

  ["red", "blue", "spectators"].forEach((team) => {
    const teamPlayers = activeRoom.players.filter((roomPlayer) => roomPlayer.team === team);
    teamPlayers.forEach((roomPlayer, index) => {
      if (roomPlayer.id === getLocalPlayerId()) return;
      const actor = createPlayer(false, team);
      if (team === "spectators") {
        const side = index % 2 === 0 ? -1 : 1;
        const row = 3 + (index % 6);
        actor.position.set(
          side * (field.width / 2 + 5.4 + row * 0.74),
          1.15 + row * 0.34,
          THREE.MathUtils.clamp(-24 + index * 6, -32, 32)
        );
      } else {
        actor.position.copy(getMultiplayerStartPositionFor(roomPlayer, index, teamPlayers.length));
      }
      actor.rotation.y = team === "blue" ? Math.PI : 0;
      actor.userData.name = roomPlayer.name;
      actor.userData.playerId = roomPlayer.id;
      actor.userData.team = team;
      actor.userData.isLocal = false;
      if (roomPlayer.state) {
        actor.position.set(roomPlayer.state.x, roomPlayer.state.y || 0, roomPlayer.state.z);
        actor.rotation.y = roomPlayer.state.angle || actor.rotation.y;
        actor.userData.netTarget = actor.position.clone();
        actor.userData.netAngle = actor.rotation.y;
        actor.userData.netMoving = Boolean(roomPlayer.state.moving);
      }
      scene.add(actor);
      multiplayerActors.push(actor);
    });
  });
}

function setupGame() {
  const canvas = document.querySelector("#gameCanvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06182a);
  scene.fog = new THREE.Fog(0x06182a, 72, 150);

  camera = new THREE.PerspectiveCamera(82, window.innerWidth / window.innerHeight, 0.1, 180);
  clock = new THREE.Clock();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x204a2c, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-12, 28, -10);
  sun.castShadow = true;
  scene.add(sun);

  trainingFreeMode = false;
  trainingWorldColliders = [];
  museumGroup = null;
  trainingTunnelSeal = null;
  trainingTunnelCover = null;
  addField({ trainingMode: !multiplayerMode });

  const localRoomPlayer = getLocalRoomPlayer();
  player = createPlayer(true, multiplayerMode ? localRoomPlayer.team : "neutral");
  player.userData.name = multiplayerMode ? localRoomPlayer.name : "Jugador";
  player.userData.team = multiplayerMode ? localRoomPlayer.team : "red";
  player.userData.isLocal = true;
  player.visible = !multiplayerMode
    || localRoomPlayer.team === "red"
    || localRoomPlayer.team === "blue"
    || (localRoomPlayer.team === "spectators" && spectatorViewing);
  player.position.copy(getLocalMultiplayerStartPosition());
  scene.add(player);
  addMultiplayerActors();

  ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 16),
    new THREE.MeshStandardMaterial({ map: createBallTexture(), roughness: 0.42 })
  );
  ball.position.set(0, 0.42, multiplayerMode ? 0 : -29.6);
  scene.add(ball);

  ballShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.52, 32),
    new THREE.MeshBasicMaterial({
      color: 0x020806,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  ballShadow.rotation.x = -Math.PI / 2;
  ballShadow.position.set(ball.position.x, 0.035, ball.position.z);
  scene.add(ballShadow);

  kickArrow = createKickArrow();
  scene.add(kickArrow);

  goalKeepers = [];
  if (multiplayerMode) {
    goalKeeper = null;
    keeperState = null;
    if (!lobbyPreviewMode && roomKeepersEnabled()) {
      goalKeepers = [
        createGoalkeeper(-1, "red"),
        createGoalkeeper(1, "blue"),
      ];
    }
  } else {
    keeperState = createGoalkeeper(1, "red");
    goalKeeper = keeperState.unit;
  }

  opponents = [];

  score = 0;
  redScore = 0;
  blueScore = 0;
  remaining = multiplayerMode && !lobbyPreviewMode && !activeRoom?.settings?.unlimited
    ? (Number(roomTimeInput?.value) || 5) * 60
    : Infinity;
  if (multiplayerMode && activeRoom?.matchEndsAt) {
    remaining = Math.max(0, (Number(activeRoom.matchEndsAt) - Date.now()) / 1000);
  }
  ballVelocity = new THREE.Vector3();
  ballVerticalVelocity = 0;
  ballShotCharge = 0;
  networkBallTarget.set(0, 0.42, multiplayerMode ? 0 : -29.6);
  networkBallVelocity.set(0, 0, 0);
  lastNetworkBallSeq = 0;
  lastSnapshotSeq = 0;
  localInputSeq = 0;
  hasAuthoritativeLocalTarget = false;
  pendingLocalKickId = null;
  lastAppliedKickId = null;
  kickoffLocked = false;
  kickoffTeam = null;
  kickoffTakerId = null;
  kickoffLockUntil = 0;
  spaceChargeStart = null;
  chargeMeterOpacity = 0;
  chargeMeterRatio = 0;
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0;
  playerAngle = getInitialPlayerAngle();
  player.rotation.y = playerAngle;
  playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
  proModeEnabled = multiplayerMode
    ? (roomProModeToggle ? roomProModeToggle.checked : false)
    : (proModeToggle ? proModeToggle.checked : false);
  ballTrails.forEach((puff) => scene.remove(puff));
  ballTrails = [];
  spectatorConfetti.forEach((paper) => scene.remove(paper));
  spectatorConfetti = [];
  spectatorJumpVelocity = 0;
  spectatorGrounded = true;
  spectatorJumpQueued = false;
  goalCooldown = 0;
  ended = false;
  cameraMode = lobbyPreviewMode || (multiplayerMode && !player.visible) ? "broadcast" : "third";
  broadcastFocusZ = ball.position.z;
  phraseTimer = 0;
  scoreEl.textContent = multiplayerMode ? "Rojo 0 - 0 Azul" : "0";
  updateStadiumScoreboard();
  updateTimer();
  momentEl.textContent = lobbyPreviewMode
    ? "Room abierta: acomodando equipos"
    : (multiplayerMode ? "Multijugador online" : "Modo entrenamiento");
  if (roomGameBtn) roomGameBtn.style.display = multiplayerMode ? "block" : "none";
  backMenuBtn?.classList.toggle("with-room-button", multiplayerMode);
  setupPlayerTags();
  updateGameplayControlHints();
  updateChargeMeter(0);
  animateGame();
}

function updateTimer() {
  let nextTimerText;
  if (lobbyPreviewMode) {
    timerEl.textContent = "Room";
    nextTimerText = "SALA";
    if (stadiumTimerText !== nextTimerText) {
      stadiumTimerText = nextTimerText;
      updateStadiumScoreboard();
    }
    return;
  }
  if (!multiplayerMode) {
    timerEl.textContent = "Entrenamiento";
    nextTimerText = "ENTRENAMIENTO";
    if (stadiumTimerText !== nextTimerText) {
      stadiumTimerText = nextTimerText;
      updateStadiumScoreboard();
    }
    return;
  }
  if (activeRoom?.settings?.unlimited) {
    remaining = Infinity;
    timerEl.textContent = "Ilimitado";
    nextTimerText = "TIEMPO ILIMITADO";
    if (stadiumTimerText !== nextTimerText) {
      stadiumTimerText = nextTimerText;
      updateStadiumScoreboard();
    }
    return;
  }
  if (activeRoom?.matchEndsAt) {
    remaining = Math.max(0, (Number(activeRoom.matchEndsAt) - Date.now()) / 1000);
  }
  const total = Math.max(0, Math.ceil(remaining));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  nextTimerText = `${m}:${s}`;
  timerEl.textContent = nextTimerText;
  if (stadiumTimerText !== nextTimerText) {
    stadiumTimerText = nextTimerText;
    updateStadiumScoreboard();
  }
}

function clearPlayerTags() {
  playerTags.forEach((tag) => {
    tag.label.remove();
    tag.pointer.remove();
  });
  playerTags = [];
  if (playerOverlay) playerOverlay.innerHTML = "";
}

function setupPlayerTags() {
  clearPlayerTags();
  if (!multiplayerMode || !playerOverlay) return;
  const units = [player, ...multiplayerActors];
  units.forEach((unit) => {
    const label = document.createElement("div");
    label.className = `name-tag ${unit.userData.team === "blue" ? "is-blue" : "is-red"}`;
    label.textContent = unit.userData.name || "player";
    const pointer = document.createElement("div");
    pointer.className = `offscreen-pointer ${unit.userData.team === "blue" ? "is-blue" : "is-red"}`;
    pointer.innerHTML = `<span></span><strong>${unit.userData.name || "player"}</strong>`;
    playerOverlay.append(label, pointer);
    playerTags.push({ unit, label, pointer });
  });
}

function projectToScreen(position) {
  const projected = position.clone().project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * window.innerWidth,
    y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
    ndc: projected,
  };
}

function updatePlayerTags() {
  if (!multiplayerMode || !camera || !playerOverlay) return;
  playerTags.forEach(({ unit, label, pointer }) => {
    const shouldShowName = cameraMode === "broadcast" || !unit.userData.isLocal;
    const head = unit.position.clone().add(new THREE.Vector3(0, 3.78, 0));
    const screen = projectToScreen(head);
    const inFront = screen.ndc.z > -1 && screen.ndc.z < 1;
    const margin = 28;
    const onScreen = inFront
      && screen.x >= margin
      && screen.x <= window.innerWidth - margin
      && screen.y >= margin
      && screen.y <= window.innerHeight - margin;

    label.style.display = shouldShowName && onScreen ? "block" : "none";
    if (shouldShowName && onScreen) {
      label.style.left = `${screen.x}px`;
      label.style.top = `${screen.y}px`;
    }

    const shouldPoint = cameraMode === "broadcast" && !onScreen;
    pointer.style.display = shouldPoint ? "flex" : "none";
    if (shouldPoint) {
      const edgeX = THREE.MathUtils.clamp(screen.x, 18, window.innerWidth - 18);
      const edgeY = THREE.MathUtils.clamp(screen.y, 68, window.innerHeight - 28);
      pointer.style.left = `${edgeX}px`;
      pointer.style.top = `${edgeY}px`;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const angle = Math.atan2(screen.y - centerY, screen.x - centerX);
      pointer.querySelector("span").style.transform = `rotate(${angle}rad)`;
    }
  });
}

function ballDirectionFromPlayer() {
  if (isKickoffTaker(player)) {
    return new THREE.Vector3(Math.sin(playerAngle), 0, Math.cos(playerAngle)).normalize();
  }
  const dir = ball.position.clone().sub(player.position);
  dir.y = 0;
  if (dir.lengthSq() < 0.0001) {
    dir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
  }
  return dir.normalize();
}

function playKickSound(kind, intensity = 0) {
  setupAudio();
  const playLayer = (delay, volume, rate) => {
    setTimeout(() => {
      const audio = kickSound.cloneNode();
      audio.volume = volume;
      audio.playbackRate = rate;
      safePlay(audio);
    }, delay);
  };
  if (kind === "soft") {
    playLayer(0, 0.36, 1.08);
    return;
  }
  if (kind === "pass") {
    playLayer(0, 0.58, 1);
    return;
  }
  playLayer(0, 0.82, 0.92 - intensity * 0.08);
  playLayer(95, 0.28 + intensity * 0.16, 0.82);
  playLayer(210, 0.12 + intensity * 0.1, 0.74);
}

function spawnBallTrail(dir, chargeRatio) {
  if (!ball || chargeRatio <= 0) return;
  const count = Math.ceil(3 + chargeRatio * 8);
  for (let i = 0; i < count; i += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.18 + chargeRatio * 0.28, 16, 10),
      new THREE.MeshBasicMaterial({
        color: chargeRatio > 0.55 ? 0xf7c948 : 0xffffff,
        transparent: true,
        opacity: 0.18 + chargeRatio * 0.28,
        depthWrite: false,
      })
    );
    puff.position.copy(ball.position)
      .addScaledVector(dir, -0.35 - i * (0.22 + chargeRatio * 0.08))
      .add(new THREE.Vector3((Math.random() - 0.5) * 0.22, 0.08 + Math.random() * 0.12, (Math.random() - 0.5) * 0.22));
    puff.userData.life = 0.28 + chargeRatio * 0.36;
    puff.userData.maxLife = puff.userData.life;
    puff.userData.grow = 1.8 + chargeRatio * 2.4;
    scene.add(puff);
    ballTrails.push(puff);
  }
}

function updateBallTrails(dt) {
  const speed = ballVelocity ? ballVelocity.length() : 0;
  if (ball && scene && speed > 13 && ballShotCharge > 0.04) {
    const dir = ballVelocity.clone().setY(0);
    if (dir.lengthSq() > 0.001) {
      dir.normalize();
      const intensity = THREE.MathUtils.clamp((speed - 10) / 30, 0, 1) * THREE.MathUtils.clamp(ballShotCharge, 0, 1);
      const count = 1 + Math.floor(intensity * 3);
      for (let i = 0; i < count; i += 1) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.14 + intensity * 0.28, 14, 8),
          new THREE.MeshBasicMaterial({
            color: intensity > 0.45 ? 0xf7c948 : 0xffffff,
            transparent: true,
            opacity: 0.16 + intensity * 0.34,
            depthWrite: false,
          })
        );
        puff.position.copy(ball.position)
          .addScaledVector(dir, -0.46 - i * 0.3)
          .add(new THREE.Vector3((Math.random() - 0.5) * 0.18, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.18));
        puff.userData.life = 0.22 + intensity * 0.36;
        puff.userData.maxLife = puff.userData.life;
        puff.userData.grow = 1.5 + intensity * 2.8;
        scene.add(puff);
        ballTrails.push(puff);
      }
    }
  }

  ballTrails = ballTrails.filter((puff) => {
    puff.userData.life -= dt;
    const t = Math.max(0, puff.userData.life / puff.userData.maxLife);
    puff.material.opacity = t * 0.42;
    puff.scale.addScalar(dt * puff.userData.grow);
    puff.position.y += dt * 0.35;
    if (puff.userData.life <= 0) {
      scene.remove(puff);
      return false;
    }
    return true;
  });
}

function predictGoalLineX(dir, side = 1) {
  const goalZ = side * (field.length / 2 - 0.42);
  if (Math.abs(dir.z) < 0.001) return ball.position.x;
  const t = (goalZ - ball.position.z) / dir.z;
  return ball.position.x + dir.x * t;
}

function getKeeperStates() {
  return multiplayerMode ? goalKeepers : (keeperState ? [keeperState] : []);
}

function getKeeperForShot(dir) {
  const side = dir.z >= 0 ? 1 : -1;
  return getKeeperStates().find((state) => state.side === side) || null;
}

function prepareKeeperForShot(dir, chargeRatio) {
  const targetKeeper = getKeeperForShot(dir);
  if (!targetKeeper || Math.abs(dir.z) <= 0.16) return;
  const predictedX = predictGoalLineX(dir, targetKeeper.side);
  if (predictedX < -6.3 || predictedX > 6.3) return;

  const saveChance = 0.5 * (1 - THREE.MathUtils.clamp(chargeRatio, 0, 1));
  const commitsCorrectly = Math.random() < saveChance;
  const chosenX = commitsCorrectly
    ? predictedX
    : predictedX + (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 2.7);

  targetKeeper.mode = "dive";
  targetKeeper.targetX = THREE.MathUtils.clamp(chosenX, -5.4, 5.4);
  targetKeeper.targetZ = targetKeeper.side * (field.length / 2 - 4.15);
  targetKeeper.diveTimer = 1.05;
  targetKeeper.diveSide = targetKeeper.targetX >= targetKeeper.unit.position.x ? 1 : -1;
}

function getLocalKeeperArcTarget(state) {
  const goalZ = state.side * field.length / 2;
  const inwardDistance = Math.max(0.05, state.side * (goalZ - ball.position.z));
  const angle = THREE.MathUtils.clamp(
    Math.atan2(ball.position.x, inwardDistance),
    -Math.PI * 0.47,
    Math.PI * 0.47
  );
  return new THREE.Vector3(
    Math.sin(angle) * 6.25,
    0,
    goalZ - state.side * Math.cos(angle) * 4.5
  );
}

function tryLocalKeeperClear(state) {
  if (multiplayerMode || state.clearanceCooldown > 0 || state.mode === "dive") return false;
  if (ball.position.y > 0.9 || ballVelocity.length() > 13) return false;
  const playerDistance = player.position.distanceTo(state.unit.position);
  const ballDistance = ball.position.distanceTo(state.unit.position);
  if (playerDistance > 2.15 || ballDistance > 2.45) return false;

  const lateral = THREE.MathUtils.clamp((ball.position.x - state.unit.position.x) * 0.48, -0.72, 0.72);
  const direction = new THREE.Vector3(lateral, 0, -state.side).normalize();
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 1.05;
  ball.position.copy(state.unit.position).addScaledVector(direction, 1.5);
  ball.position.y = 0.42;
  ballVelocity.copy(direction).multiplyScalar(21);
  ballVerticalVelocity = 1.3;
  ballShotCharge = 0.18;
  state.mode = "clear";
  state.diveTimer = 0.42;
  state.clearanceCooldown = 1.15;
  momentEl.textContent = "El arquero le saca la pelota de los pies";
  return true;
}

function kickBall(power, label, chargeRatio = 0, liftPower = 0, soundKind = "shot") {
  if (!player || !player.visible || !ball || goalCooldown > 0) return;
  if (multiplayerMode && (!socket?.connected || !networkSessionReady)) {
    momentEl.textContent = "Reconectando...";
    return;
  }
  if (multiplayerMode && getLocalRoomPlayer()?.team === "spectators") return;
  const distance = player.position.distanceTo(ball.position);
  if (distance > 3.2) {
    momentEl.textContent = modePhrase(
      "La pelota todavia queda lejos",
      "La pelota queda lejos. El intento fue emocional"
    );
    return;
  }

  const dir = ballDirectionFromPlayer();
  const localTeam = player.userData?.team || getLocalRoomPlayer()?.team;
  if (kickoffLocked && multiplayerMode && (localTeam !== kickoffTeam || getLocalPlayerId() !== getKickoffPlayerId())) {
    momentEl.textContent = `Saca ${kickoffTeam === "red" ? "Rojo" : "Azul"} desde el centro`;
    return;
  }
  releaseKickoffIfNeeded(localTeam, getLocalPlayerId());
  playKickSound(soundKind, chargeRatio);
  vibrateKick(soundKind === "shot" ? 28 : 14);
  ballControlled = false;
  ballOwner = null;
  networkBallOwnerId = null;
  ballMagnetCooldown = 0.58 + chargeRatio * 0.22;
  if (usesNetworkBallAuthority()) {
    pendingLocalKickId = `kick-${getLocalPlayerId()}-${++localKickSeq}`;
    socket.emit("ball:kick", {
      matchId: currentMatchId,
      kickId: pendingLocalKickId,
      power,
      chargeRatio,
      liftPower,
      soundKind,
      dir: { x: dir.x, z: dir.z },
    });
    localBallPredictionBlockedUntil = performance.now() + 520;
    networkBallOwnerId = null;
    ballVelocity.addScaledVector(dir, power);
    ballVelocity.clampLength(0, 42);
    ballVerticalVelocity = Math.max(ballVerticalVelocity, liftPower);
    ballShotCharge = Math.max(ballShotCharge, chargeRatio);
    ball.position.addScaledVector(dir, 0.35);
    spawnBallTrail(dir, chargeRatio);
    momentEl.textContent = label;
    return;
  }
  prepareKeeperForShot(dir, chargeRatio);
  ballVelocity.addScaledVector(dir, power);
  ballVelocity.clampLength(0, 42);
  ballVerticalVelocity = Math.max(ballVerticalVelocity, liftPower);
  ballShotCharge = Math.max(ballShotCharge, chargeRatio);
  ball.position.addScaledVector(dir, 0.22);
  spawnBallTrail(dir, chargeRatio);
  momentEl.textContent = label;
}

function releaseChargedShot() {
  if (spaceChargeStart === null) return;
  const heldSeconds = (performance.now() - spaceChargeStart) / 1000;
  spaceChargeStart = null;
  const chargeSeconds = THREE.MathUtils.clamp(heldSeconds, 0, fullShotChargeSeconds);
  const chargeRatio = heldSeconds < 0.1 ? 0 : chargeSeconds / fullShotChargeSeconds;
  const power = 27.75 * (1 + chargeRatio * 0.68);
  const liftPower = 2.2 + chargeRatio * 7.0;
  const percent = Math.round(chargeRatio * 80);
  const label = chargeRatio === 0
    ? modePhrase("Remate fuerte hacia el eje", "Remate fuerte y decisiones cuestionables")
    : `Remate cargado: +${percent}%`;
  kickBall(power, label, chargeRatio, liftPower, "shot");
}

function beginChargedShot() {
  if (spaceChargeStart === null) spaceChargeStart = performance.now();
}

function vibrateKick(duration = 14) {
  if (!("vibrate" in navigator) || !document.body.classList.contains("touch-enabled")) return;
  navigator.vibrate(duration);
}

function toggleCameraMode() {
  if (multiplayerMode && spectatorViewing && getLocalRoomPlayer()?.team === "spectators") return;
  cameraMode = cameraMode === "third" ? "broadcast" : "third";
  if (cameraMode === "broadcast" && ball) broadcastFocusZ = ball.position.z;
  momentEl.textContent = cameraMode === "broadcast"
    ? "Camara clasica activada"
    : "Camara tercera persona activada";
}

function updateGameplayControlHints() {
  if (!controlsEl) return;
  const spectator = multiplayerMode
    && spectatorViewing
    && getLocalRoomPlayer()?.team === "spectators";
  controlsEl.innerHTML = spectator
    ? `
      <span>W/S: caminar</span>
      <span>Izq/Der: girar</span>
      <span>Shift: correr</span>
      <span>Espacio: saltar</span>
      <span>Q: papelitos</span>
      <span>Room: volver a la sala</span>
    `
    : `
      <span>Arriba/W: avanzar</span>
      <span>Izq/Der: girar</span>
      <span>Shift: correr</span>
      <span>C: camara</span>
      <span>P: pro mode</span>
      <span>M: ambiente on/off</span>
      <span>Q: pase alto</span>
      <span>E: pase</span>
      <span>Espacio: remate</span>
    `;
  if (touchSoftBtn) touchSoftBtn.textContent = spectator ? "Papelitos" : "Pase alto";
  if (touchShotBtn) touchShotBtn.textContent = spectator ? "Saltar" : "Remate";
  if (touchPassBtn) touchPassBtn.textContent = "Pase";
  if (touchPassBtn) touchPassBtn.style.display = spectator ? "none" : "";
  if (touchCameraBtn) touchCameraBtn.style.display = spectator ? "none" : "";
  if (touchProBtn) touchProBtn.style.display = spectator ? "none" : "";
}

function celebrateGoal(scoringTeam = "training") {
  if (!stadiumSoundMuted) {
    setupAudio();
    goalSound.currentTime = 0;
    safePlay(goalSound);
  }
  if (multiplayerMode) {
    if (scoringTeam === "red") redScore += 1;
    if (scoringTeam === "blue") blueScore += 1;
    scoreEl.textContent = `Rojo ${redScore} - ${blueScore} Azul`;
    goalBanner.textContent = scoringTeam === "red" ? "GOOOL DE ROJO" : "GOOOL DE AZUL";
    if (isOnlineHost()) socket.emit("match:goal", { scoringTeam });
  } else {
    score += 1;
    scoreEl.textContent = String(score);
    goalBanner.textContent = "GOOOOOOL";
    if (score >= 20) setTimeout(unlockTrainingFreeMode, 900);
  }
  updateStadiumScoreboard();
  goalBanner.classList.remove("show");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
  momentEl.textContent = multiplayerMode
    ? `${scoringTeam === "red" ? "Rojo" : "Azul"} mete gol y el estadio entiende todo`
    : "GOOOL. La fisica tambien quiso entrar";
  if (multiplayerMode) beginKickoffFor(scoringTeam);
  if (goalKeeper) {
    const keeperDive = Math.random() > 0.5 ? -1 : 1;
    goalKeeper.rotation.z = keeperDive * 1.35;
    goalKeeper.position.x = keeperDive * 5.2;
  }
  if (keeperState) {
    keeperState.mode = "ready";
    keeperState.targetX = 0;
    keeperState.targetZ = field.length / 2 - 4.5;
    keeperState.diveTimer = 0;
  }
  ballVelocity.set(0, 0, 0);
  ballVerticalVelocity = 0;
  ballShotCharge = 0;
  ballControlled = false;
  ballOwner = null;
  networkBallOwnerId = null;
  pendingLocalKickId = null;
  lastAppliedKickId = null;
  localBallPredictionBlockedUntil = performance.now() + 1400;
  if (!multiplayerMode) kickoffLockUntil = performance.now() + 1350;
  ballMagnetCooldown = 0;
  goalCooldown = 1.15;
  setTimeout(() => {
    if (!ended) {
      if (goalKeeper) {
        goalKeeper.rotation.z = 0;
        goalKeeper.position.set(0, 0, field.length / 2 - 4.5);
      }
      if (keeperState) {
        keeperState.mode = "ready";
        keeperState.targetX = 0;
        keeperState.targetZ = field.length / 2 - 4.5;
        keeperState.diveTimer = 0;
      }
      if (multiplayerMode) resetLocalPlayerForKickoff();
      else {
        player.position.set(0, 0, -2.4);
        playerAngle = getInitialPlayerAngle();
        player.rotation.y = playerAngle;
        playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      }
      ball.position.set(0, 0.42, multiplayerMode ? 0 : 0.8);
      ballVelocity.set(0, 0, 0);
      networkBallTarget.set(0, 0.42, multiplayerMode ? 0 : 0.8);
      networkBallVelocity.set(0, 0, 0);
      ballVerticalVelocity = 0;
      ballShotCharge = 0;
      ballControlled = false;
      ballOwner = null;
      networkBallOwnerId = null;
      pendingLocalKickId = null;
      ballMagnetCooldown = 0;
      momentEl.textContent = "Saque desde el centro";
    }
  }, 950);
}

function updateGoalkeeper(dt) {
  const states = getKeeperStates();
  if (states.length === 0) return;
  if (usesNetworkBallAuthority()) return;

  states.forEach((state) => {
    const unit = state.unit;
    state.clearanceCooldown = Math.max(0, (state.clearanceCooldown || 0) - dt);
    if (tryLocalKeeperClear(state)) return;
    if (state.mode === "dive") {
      state.diveTimer -= dt;
      unit.position.x = THREE.MathUtils.lerp(unit.position.x, state.targetX, 1 - Math.pow(0.006, dt));
      unit.position.z = THREE.MathUtils.lerp(unit.position.z, state.targetZ, 1 - Math.pow(0.01, dt));
      unit.rotation.z = THREE.MathUtils.lerp(unit.rotation.z, -state.diveSide * 1.24, 1 - Math.pow(0.006, dt));
      unit.position.y = Math.max(0, Math.sin((1.05 - state.diveTimer) * Math.PI) * 0.5);

      if (unit.userData.limbs) {
        unit.userData.limbs.arms.forEach((arm) => {
          arm.rotation.x = -1.35;
          arm.rotation.z = arm.userData.side * 0.62;
        });
      }

      if (state.diveTimer <= 0) {
        state.mode = "recover";
        state.diveTimer = 0.85;
      }
      return;
    }

    if (state.mode === "clear") {
      state.diveTimer -= dt;
      unit.position.y = Math.max(0, Math.sin((0.42 - state.diveTimer) * Math.PI) * 0.12);
      if (unit.userData.limbs) {
        unit.userData.limbs.legs.forEach((leg) => {
          leg.rotation.x = -leg.userData.side * 0.95;
        });
        unit.userData.limbs.arms.forEach((arm) => {
          arm.rotation.x = arm.userData.side * 0.42;
        });
      }
      if (state.diveTimer <= 0) {
        state.mode = "recover";
        state.diveTimer = 0.85;
      }
      return;
    }

    if (state.mode === "recover") {
      state.diveTimer -= dt;
      unit.rotation.z = THREE.MathUtils.lerp(unit.rotation.z, 0, 1 - Math.pow(0.004, dt));
      unit.position.y = THREE.MathUtils.lerp(unit.position.y, 0, 0.16);
      if (state.diveTimer <= 0) state.mode = "ready";
    }

    if (state.mode === "ready") {
      const target = getLocalKeeperArcTarget(state);
      const blend = 1 - Math.pow(0.02, dt);
      unit.position.x = THREE.MathUtils.lerp(unit.position.x, target.x, blend);
      unit.position.z = THREE.MathUtils.lerp(unit.position.z, target.z, blend);
      unit.position.y = THREE.MathUtils.lerp(unit.position.y, 0, 0.18);
      unit.rotation.z = THREE.MathUtils.lerp(unit.rotation.z, 0, 0.14);
      unit.rotation.y = state.side > 0 ? Math.PI : 0;
      animatePlayerRun(unit, dt, unit.position.distanceTo(target) > 0.02);
    }
  });
}

function handleKeeperBallCollision(previousBallPosition) {
  if (!ball || goalCooldown > 0) return false;
  for (const state of getKeeperStates()) {
  const unit = state.unit;
  const keeperRadius = state?.mode === "dive" ? 1.65 : 1.05;
  const keeperCenter = unit.position.clone().add(new THREE.Vector3(0, 1.2, 0));
  const ballCenter = ball.position.clone();
  let impactPoint = ballCenter;

  if (previousBallPosition) {
    const segment = ballCenter.clone().sub(previousBallPosition);
    const flatSegment = new THREE.Vector3(segment.x, 0, segment.z);
    const flatLengthSq = flatSegment.lengthSq();
    if (flatLengthSq > 0.001) {
      const toKeeper = keeperCenter.clone().sub(previousBallPosition);
      const t = THREE.MathUtils.clamp(
        (toKeeper.x * flatSegment.x + toKeeper.z * flatSegment.z) / flatLengthSq,
        0,
        1
      );
      impactPoint = previousBallPosition.clone().addScaledVector(segment, t);
    }
  }

  const delta = impactPoint.clone().sub(keeperCenter);
  const horizontal = new THREE.Vector3(delta.x, 0, delta.z);
  const verticalOk = Math.min(ball.position.y, impactPoint.y) < 3.2;
  if (!verticalOk || horizontal.length() > keeperRadius + 0.42) continue;

  const normal = horizontal.lengthSq() > 0.001 ? horizontal.normalize() : new THREE.Vector3(0, 0, -state.side);
  const incomingSpeed = Math.max(ballVelocity.length(), 9);
  ball.position.copy(impactPoint).addScaledVector(normal, keeperRadius + 0.62);
  ball.position.y = Math.max(impactPoint.y, 0.62);
  ballVelocity.copy(normal.multiplyScalar(Math.min(incomingSpeed * 0.48, 18)));
  ballVelocity.z += -state.side * 1.2;
  ballVerticalVelocity = Math.max(ballVerticalVelocity * 0.18, 0.75);
  ballShotCharge = Math.max(ballShotCharge, 0.35);
  ballControlled = false;
  momentEl.textContent = "El arquero mete las manos y la pelota rebota";
  return true;
  }
  return false;
}

function getUnitForward(unit) {
  return new THREE.Vector3(Math.sin(unit.rotation.y), 0, Math.cos(unit.rotation.y)).normalize();
}

function getBallOwnerCandidate(distanceLimit = 2.35) {
  if (!ball || ball.position.y >= 0.78) return null;
  const candidates = [
    ...(player?.visible ? [player] : []),
    ...multiplayerActors.filter((actor) => actor.visible),
  ];
  let nearest = null;
  let nearestDistance = distanceLimit;
  candidates.forEach((unit) => {
    if (kickoffLocked && multiplayerMode && getUnitPlayerId(unit) !== getKickoffPlayerId()) return;
    const delta = ball.position.clone().sub(unit.position);
    delta.y = 0;
    const distance = delta.length();
    if (distance < nearestDistance) {
      nearest = unit;
      nearestDistance = distance;
    }
  });
  return nearest;
}

function updateControlledBall(owner, dt, minX, maxX, minZ, maxZ) {
  const carryDir = owner === player
    ? (playerMoveDir.lengthSq() > 0.01 ? playerMoveDir.clone().normalize() : getUnitForward(player))
    : getUnitForward(owner);
  const runPulse = owner === player ? Math.sin(performance.now() * 0.018) * 0.16 : 0;
  const carryDistance = owner === player ? 2.05 + runPulse : 1.42;
  const target = owner.position.clone().addScaledVector(carryDir, carryDistance);
  target.y = getTrainingExplorerFloorY(target.x, target.z) + 0.42;
  const before = ball.position.clone();
  ball.position.lerp(target, 1 - Math.pow(owner === player ? 0.00025 : 0.0008, dt));
  ball.position.x = THREE.MathUtils.clamp(ball.position.x, minX, maxX);
  ball.position.z = THREE.MathUtils.clamp(ball.position.z, minZ, maxZ);
  ballVelocity.copy(ball.position.clone().sub(before)).multiplyScalar(1 / Math.max(dt, 0.001));
  ballVelocity.multiplyScalar(owner === player ? 0.28 : 0.18);
  ballVerticalVelocity = 0;
  ballShotCharge = 0;
  ball.rotation.x += ballVelocity.z * dt * 2.4;
  ball.rotation.z -= ballVelocity.x * dt * 2.4;
  return before;
}

function applyBallBodyCollisions() {
  if (!ball || ballControlled) return;
  const units = [player, ...multiplayerActors].filter((unit) => unit?.visible);
  units.forEach((unit) => {
    const delta = ball.position.clone().sub(unit.position);
    delta.y = 0;
    const distance = delta.length();
    const minDistance = 1.22;
    if (distance <= 0.001 || distance >= minDistance || ball.position.y > 1.1) return;
    const pushDir = delta.normalize();
    const overlap = minDistance - distance;
    ball.position.addScaledVector(pushDir, overlap + 0.02);
    ballVelocity.addScaledVector(pushDir, overlap * 9.5 + 2.5);
  });
}

function resolvePlayerActorCollisions() {
  if (!multiplayerMode || !player?.visible) return;
  multiplayerActors.filter((actor) => actor.visible).forEach((actor) => {
    const delta = player.position.clone().sub(actor.position);
    delta.y = 0;
    const distance = delta.length();
    const minDistance = 1.35;
    if (distance <= 0.001 || distance >= minDistance) return;
    player.position.addScaledVector(delta.normalize(), minDistance - distance);
    player.position.x = THREE.MathUtils.clamp(player.position.x, -field.width / 2 + 2, field.width / 2 - 2);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -field.length / 2 + 1.1, field.length / 2 - 1.1);
  });
}

function detectGoal(maxZ, minZ, requireDirection = true) {
  if (Math.abs(ball.position.x) >= 4.2 || ball.position.y >= 3.08) return false;
  if (ball.position.z >= maxZ && (!requireDirection || ballVelocity.z > 0.8)) {
    celebrateGoal(multiplayerMode ? "red" : "training");
    return true;
  }
  if (multiplayerMode && ball.position.z <= minZ && (!requireDirection || ballVelocity.z < -0.8)) {
    celebrateGoal("blue");
    return true;
  }
  return false;
}

function updateBall(dt) {
  if (goalCooldown > 0) {
    goalCooldown -= dt;
    ball.position.y = 0.42;
    return;
  }

  ballMagnetCooldown = Math.max(0, ballMagnetCooldown - dt);
  if (performance.now() < kickoffLockUntil) {
    ballControlled = false;
    ballOwner = null;
    networkBallOwnerId = null;
  }

  if (usesNetworkBallAuthority()) {
    if (
      networkBallOwnerId === getLocalPlayerId()
      && !pendingLocalKickId
      && performance.now() > localBallPredictionBlockedUntil
      && !proModeEnabled
      && player?.visible
    ) {
      const ballRadius = 0.42;
      const minX = -field.width / 2 + ballRadius;
      const maxX = field.width / 2 - ballRadius;
      const minZ = -field.length / 2 + ballRadius;
      const maxZ = field.length / 2 - ballRadius;
      ballControlled = true;
      ballOwner = player;
      updateControlledBall(player, dt, minX, maxX, minZ, maxZ);
      return;
    }
    if (!pendingLocalKickId) {
      const blend = 1 - Math.pow(0.000001, dt);
      ball.position.lerp(networkBallTarget, blend);
      ballVelocity.lerp(networkBallVelocity, blend);
    } else {
      ball.position.addScaledVector(ballVelocity, dt);
      ballVelocity.multiplyScalar(Math.pow(0.5, dt));
      ballVerticalVelocity -= 9.8 * dt;
      ball.position.y += ballVerticalVelocity * dt;
      if (ball.position.y <= 0.42) {
        ball.position.y = 0.42;
        ballVerticalVelocity = 0;
      }
    }
    ball.rotation.x += ballVelocity.z * dt * 2.4;
    ball.rotation.z -= ballVelocity.x * dt * 2.4;
    ball.rotation.y += ballVelocity.length() * dt * 0.8;
    releaseKickoffIfBallMoved();
    return;
  }

  const ballRadius = 0.42;
  const freeTraining = !multiplayerMode && trainingFreeMode;
  const minX = freeTraining ? -75.4 + ballRadius : -field.width / 2 + ballRadius;
  const maxX = freeTraining ? field.width / 2 + 13 - ballRadius : field.width / 2 - ballRadius;
  const minZ = freeTraining ? -49 + ballRadius : -field.length / 2 + ballRadius;
  const maxZ = freeTraining ? 49 - ballRadius : field.length / 2 - ballRadius;
  const playerRadius = 0.82;
  const toBall = ball.position.clone().sub(player.position);
  toBall.y = 0;
  const distance = toBall.length();
  const minDistance = playerRadius + ballRadius;
  const candidateOwner = !kickoffLocked && !proModeEnabled && ballMagnetCooldown <= 0 && ballVelocity.length() < 18
    ? getBallOwnerCandidate(2.35)
    : null;

  if (candidateOwner) {
    ballControlled = true;
    ballOwner = candidateOwner;
  }

  if (ballControlled && !proModeEnabled) {
    if (!ballOwner?.visible) {
      ballControlled = false;
      ballOwner = null;
    } else {
      const before = updateControlledBall(ballOwner, dt, minX, maxX, minZ, maxZ);
      if (handleKeeperBallCollision(before)) return;
      if (detectGoal(maxZ, minZ, false)) return;
      return;
    }
  }

  if (!proModeEnabled) {
    applyBallBodyCollisions();
  }

  if (proModeEnabled && distance > 0.001 && distance < minDistance) {
    const pushDir = toBall.normalize();
    const overlap = minDistance - distance;
    ball.position.addScaledVector(pushDir, overlap + 0.025);
    ballVelocity.addScaledVector(pushDir, 6.4 * dt + overlap * 7.5);
  }

  applyBallBodyCollisions();

  const previousBallPosition = ball.position.clone();
  ball.position.addScaledVector(ballVelocity, dt);

  const speed = ballVelocity.length();
  if (speed > 0.02) {
    ballVelocity.multiplyScalar(Math.pow(0.36, dt));
    ballShotCharge *= Math.pow(0.34, dt);
  } else {
    ballVelocity.set(0, 0, 0);
    ballShotCharge = 0;
  }

  ballVerticalVelocity -= 9.8 * dt;
  ball.position.y += ballVerticalVelocity * dt;
  const ballFloorY = getTrainingExplorerFloorY(ball.position.x, ball.position.z) + 0.42;
  if (ball.position.y <= ballFloorY) {
    ball.position.y = ballFloorY;
    ballVerticalVelocity = 0;
  }

  applyBallBodyCollisions();
  handleKeeperBallCollision(previousBallPosition);
  collideBallWithTrainingWorld();
  releaseKickoffIfBallMoved();

  if (detectGoal(maxZ, minZ)) return;

  if (ball.position.x < minX) {
    ball.position.x = minX;
    ballVelocity.x = Math.abs(ballVelocity.x) * 0.86;
  } else if (ball.position.x > maxX) {
    ball.position.x = maxX;
    ballVelocity.x = -Math.abs(ballVelocity.x) * 0.86;
  }

  if (ball.position.z < minZ) {
    ball.position.z = minZ;
    ballVelocity.z = Math.abs(ballVelocity.z) * 0.86;
  } else if (ball.position.z > maxZ) {
    ball.position.z = maxZ;
    ballVelocity.z = -Math.abs(ballVelocity.z) * 0.86;
  }

  ball.rotation.x += ballVelocity.z * dt * 2.4;
  ball.rotation.z -= ballVelocity.x * dt * 2.4;
  ball.rotation.y += ballVelocity.length() * dt * 0.8;
}

function updateBallShadow() {
  if (!ballShadow || !ball) return;
  const floorY = getTrainingExplorerFloorY(ball.position.x, ball.position.z);
  const height = Math.max(0, ball.position.y - floorY - 0.42);
  const scale = 1 + Math.min(height * 0.22, 1.05);
  ballShadow.position.set(ball.position.x, floorY + 0.035, ball.position.z);
  ballShadow.scale.set(scale, scale, scale);
  ballShadow.material.opacity = THREE.MathUtils.clamp(0.34 - height * 0.055, 0.08, 0.34);
  ballShadow.visible = ball.visible;
}

function updateKickArrow() {
  if (!kickArrow || !player || !ball || goalCooldown > 0) return;
  if (multiplayerMode && getLocalRoomPlayer()?.team === "spectators") {
    kickArrow.visible = false;
    return;
  }
  const dir = ballDirectionFromPlayer();
  const distance = player.position.distanceTo(ball.position);
  const inRange = distance <= 3.2;
  kickArrow.visible = inRange;
  if (!inRange) return;

  kickArrow.position.set(
    ball.position.x,
    getTrainingExplorerFloorY(ball.position.x, ball.position.z) + 0.045,
    ball.position.z
  );
  kickArrow.rotation.y = Math.atan2(dir.x, dir.z);
  const scale = THREE.MathUtils.clamp(distance / 2.1, 0.72, 1.28);
  kickArrow.scale.set(scale, scale, scale);
}

function updateChargeMeter(dt) {
  if (!chargeMeter || !chargeFill || !chargeText || !player || !camera) return;

  if (spaceChargeStart !== null) {
    const heldSeconds = (performance.now() - spaceChargeStart) / 1000;
    chargeMeterRatio = heldSeconds < 0.1
      ? 0
      : THREE.MathUtils.clamp(heldSeconds, 0, fullShotChargeSeconds) / fullShotChargeSeconds;
    chargeMeterOpacity = 1;
  } else {
    chargeMeterOpacity = Math.max(0, chargeMeterOpacity - dt * 1.8);
    if (chargeMeterOpacity <= 0) chargeMeterRatio = 0;
  }

  const percent = Math.round(chargeMeterRatio * 100);
  chargeFill.style.width = `${percent}%`;
  chargeText.textContent = `${percent}%`;
  chargeMeter.style.opacity = String(chargeMeterOpacity);

  const anchor = player.position.clone().add(new THREE.Vector3(0, 0.25, 0));
  anchor.project(camera);
  const x = (anchor.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-anchor.y * 0.5 + 0.5) * window.innerHeight + 44;
  chargeMeter.style.left = `${THREE.MathUtils.clamp(x, 92, window.innerWidth - 92)}px`;
  chargeMeter.style.top = `${THREE.MathUtils.clamp(y, 72, window.innerHeight - 42)}px`;
}

function getTouchMoveDirection() {
  if (touchMoveVector.lengthSq() < 0.006 || !camera) return null;
  if (cameraMode === "broadcast") {
    return new THREE.Vector3(-touchMoveVector.y, 0, touchMoveVector.x).normalize();
  }
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  if (forward.lengthSq() < 0.001) forward.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
  forward.normalize();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  right.y = 0;
  right.normalize();
  return right.multiplyScalar(touchMoveVector.x)
    .addScaledVector(forward, -touchMoveVector.y)
    .normalize();
}

function updateSpectatorPlayer(dt) {
  const turn = Number(keys.has("KeyA") || keys.has("ArrowLeft"))
    - Number(keys.has("KeyD") || keys.has("ArrowRight"));
  const throttle = Number(keys.has("KeyW") || keys.has("ArrowUp"))
    - Number(keys.has("KeyS") || keys.has("ArrowDown"));
  let moving = false;
  const speed = 8.2 * (sprintActive() ? 1.35 : 1);

  if (touchMoveVector.lengthSq() >= 0.006) {
    const analog = THREE.MathUtils.clamp(touchMoveVector.length(), 0.28, 1);
    const touchTurn = -touchMoveVector.x;
    const touchThrottle = -touchMoveVector.y;
    if (Math.abs(touchTurn) > 0.08) {
      const steeringBoost = Math.abs(touchThrottle) > 0.08 ? 1.18 : 0.86;
      playerAngle += touchTurn * 3.35 * steeringBoost * dt;
    }
    if (Math.abs(touchThrottle) > 0.08) {
      const forward = new THREE.Vector3(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      player.position.addScaledVector(forward, touchThrottle * speed * analog * dt);
      playerMoveDir.copy(forward).multiplyScalar(Math.sign(touchThrottle)).normalize();
    } else {
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    }
    moving = Math.abs(touchThrottle) > 0.08 || Math.abs(touchTurn) > 0.08;
  } else {
    if (turn !== 0) {
      const steeringBoost = throttle !== 0 ? 1.18 : 0.86;
      playerAngle += turn * 3.35 * steeringBoost * dt;
    }
    if (throttle !== 0) {
      const forward = new THREE.Vector3(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      player.position.addScaledVector(forward, throttle * speed * dt);
      playerMoveDir.copy(forward).multiplyScalar(Math.sign(throttle)).normalize();
    } else {
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    }
    moving = throttle !== 0 || turn !== 0;
  }

  constrainSpectatorToStands(player);
  const floor = getSpectatorFloorHeight(player.position.x, player.position.z);
  if (spectatorJumpQueued && spectatorGrounded) {
    spectatorJumpVelocity = 6.2;
    spectatorGrounded = false;
  }
  if (!spectatorGrounded) {
    spectatorJumpVelocity -= 14 * dt;
    player.position.y += spectatorJumpVelocity * dt;
    if (player.position.y <= floor) {
      player.position.y = floor;
      spectatorJumpVelocity = 0;
      spectatorGrounded = true;
    }
  } else {
    player.position.y = floor;
  }
  player.rotation.y = playerAngle;
  animatePlayerRun(player, dt, moving);
}

function updatePlayer(dt) {
  if (!player.visible) return;
  if (multiplayerMode && (!socket?.connected || !networkSessionReady)) {
    animatePlayerRun(player, dt, false);
    return;
  }
  if (multiplayerMode && getLocalRoomPlayer()?.team === "spectators" && spectatorViewing) {
    updateSpectatorPlayer(dt);
    return;
  }
  const kickoffTaker = isKickoffTaker(player);
  const touchDir = getTouchMoveDirection();
  if (touchDir) {
    const analog = THREE.MathUtils.clamp(touchMoveVector.length(), 0.28, 1);
    const touchSprintMultiplier = sprintActive() ? 1.35 : 1;
    if (cameraMode === "broadcast") {
      if (!kickoffTaker) player.position.addScaledVector(touchDir, 10.5 * analog * touchSprintMultiplier * dt);
      constrainTrainingExplorer(player);
      playerAngle = Math.atan2(touchDir.x, touchDir.z);
      playerMoveDir.copy(touchDir);
      applyPlayerGroundHeight(true, kickoffTaker);
      player.rotation.y = playerAngle;
      animatePlayerRun(player, dt, !kickoffTaker);
      constrainUnitToKickoffHalf(player);
      resolvePlayerActorCollisions();
      constrainUnitToKickoffHalf(player);
      return;
    }

    const touchTurn = -touchMoveVector.x;
    const touchThrottle = -touchMoveVector.y;
    if (Math.abs(touchTurn) > 0.08) {
      const steeringBoost = Math.abs(touchThrottle) > 0.08 ? 1.18 : 0.86;
      playerAngle += touchTurn * 3.35 * steeringBoost * dt;
    }
    if (Math.abs(touchThrottle) > 0.08) {
      const forward = new THREE.Vector3(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      if (!kickoffTaker) player.position.addScaledVector(forward, touchThrottle * 10.5 * analog * touchSprintMultiplier * dt);
      playerMoveDir.copy(forward).multiplyScalar(Math.sign(touchThrottle)).normalize();
      constrainTrainingExplorer(player);
      applyPlayerGroundHeight(true, kickoffTaker);
    } else {
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      applyPlayerGroundHeight(false, kickoffTaker);
    }
    player.rotation.y = playerAngle;
    animatePlayerRun(player, dt, !kickoffTaker && (Math.abs(touchThrottle) > 0.08 || Math.abs(touchTurn) > 0.08));
    constrainUnitToKickoffHalf(player);
    resolvePlayerActorCollisions();
    constrainUnitToKickoffHalf(player);
    return;
  }

  if (cameraMode === "broadcast") {
    const screenDir = new THREE.Vector3();
    if (keys.has("KeyW") || keys.has("ArrowUp")) screenDir.x += 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) screenDir.x -= 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) screenDir.z -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) screenDir.z += 1;
    if (screenDir.lengthSq() > 0) {
      screenDir.normalize();
      const sprintMultiplier = sprintActive() ? 1.35 : 1;
      if (!kickoffTaker) player.position.addScaledVector(screenDir, 10.5 * sprintMultiplier * dt);
      constrainTrainingExplorer(player);
      playerAngle = Math.atan2(screenDir.x, screenDir.z);
      playerMoveDir.copy(screenDir);
      applyPlayerGroundHeight(true, kickoffTaker);
      player.rotation.y = playerAngle;
      animatePlayerRun(player, dt, !kickoffTaker);
    } else {
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      applyPlayerGroundHeight(false, kickoffTaker);
      player.rotation.y = playerAngle;
      animatePlayerRun(player, dt, false);
    }
    constrainUnitToKickoffHalf(player);
    resolvePlayerActorCollisions();
    constrainUnitToKickoffHalf(player);
    return;
  }

  const turn = Number(keys.has("KeyA") || keys.has("ArrowLeft")) - Number(keys.has("KeyD") || keys.has("ArrowRight"));
  const throttle = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown"));
  const isMoving = throttle !== 0;
  const isTurning = turn !== 0;

  if (turn !== 0) {
    const steeringBoost = isMoving ? 1.18 : 0.86;
    playerAngle += turn * 3.35 * steeringBoost * dt;
  }

  if (isMoving) {
    const forward = new THREE.Vector3(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    const sprintMultiplier = sprintActive() ? 1.35 : 1;
    if (!kickoffTaker) player.position.addScaledVector(forward, throttle * 10.5 * sprintMultiplier * dt);
    playerMoveDir.copy(forward).multiplyScalar(throttle).normalize();
    constrainTrainingExplorer(player);
    applyPlayerGroundHeight(true, kickoffTaker);
  } else {
    playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    applyPlayerGroundHeight(false, kickoffTaker);
  }

  player.rotation.y = playerAngle;
  constrainUnitToKickoffHalf(player);
  resolvePlayerActorCollisions();
  constrainUnitToKickoffHalf(player);
  animatePlayerRun(player, dt, !kickoffTaker && (isMoving || isTurning));
}

function updateCamera(dt) {
  const insideTrainingMuseum = !multiplayerMode
    && trainingFreeMode
    && player.position.x < -26
    && Math.abs(player.position.z) < 12.5;
  if (insideTrainingMuseum) {
    if (camera.fov !== 75) {
      camera.fov = 75;
      camera.updateProjectionMatrix();
    }
    const behind = new THREE.Vector3(
      -Math.sin(playerAngle) * 7.1,
      4.05,
      -Math.cos(playerAngle) * 7.1
    );
    const desired = player.position.clone().add(behind);
    camera.position.lerp(desired, 1 - Math.pow(0.0007, dt));
    const look = player.position.clone().add(new THREE.Vector3(
      Math.sin(playerAngle) * 2.1,
      1.05,
      Math.cos(playerAngle) * 2.1
    ));
    camera.lookAt(look);
    return;
  }
  if (cameraMode === "broadcast") {
    const portraitTouch = document.body.classList.contains("touch-enabled") && window.innerHeight > window.innerWidth;
    const targetFov = portraitTouch ? 68 : 58;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
    const edgePad = portraitTouch ? 5 : 14;
    const sideDistance = portraitTouch ? 17 : 13;
    const cameraHeight = portraitTouch ? 20 : 17;
    const targetFocusZ = THREE.MathUtils.clamp(ball.position.z, -field.length / 2 + edgePad, field.length / 2 - edgePad);
    const deadZone = portraitTouch ? 0.46 : 0.34;
    const focusDelta = targetFocusZ - broadcastFocusZ;
    if (Math.abs(focusDelta) > deadZone) {
      const adjustedTarget = targetFocusZ - Math.sign(focusDelta) * deadZone;
      broadcastFocusZ = THREE.MathUtils.lerp(broadcastFocusZ, adjustedTarget, 1 - Math.pow(0.002, dt));
    }
    const focusZ = broadcastFocusZ;
    const desired = new THREE.Vector3(-field.width / 2 - sideDistance, cameraHeight, focusZ);
    camera.position.lerp(desired, 1 - Math.pow(0.003, dt));
    camera.lookAt(0, 0.25, focusZ);
    return;
  }

  if (camera.fov !== 82) {
    camera.fov = 82;
    camera.updateProjectionMatrix();
  }
  const behind = new THREE.Vector3(-Math.sin(playerAngle) * 6.7, 6.7, -Math.cos(playerAngle) * 9.4);
  const desired = player.position.clone().add(behind);
  camera.position.lerp(desired, 1 - Math.pow(0.002, dt));
  const look = player.position.clone().add(new THREE.Vector3(0, 1.15, Math.cos(playerAngle) * 2.6));
  camera.lookAt(look);
}

function animateGame() {
  if (!gameScreen.classList.contains("is-active")) return;
  gameFrame = requestAnimationFrame(animateGame);
  const dt = Math.min(clock.getDelta(), 0.04);

  if (
    multiplayerMode
    && !lobbyPreviewMode
    && !activeRoom?.matchEndsAt
    && !activeRoom?.settings?.unlimited
  ) remaining -= dt;
  updateTimer();
  phraseTimer -= dt;
  if (phraseTimer <= 0) {
    const phrases = multiplayerMode ? multiplayerLines : trainingLines;
    momentEl.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    phraseTimer = 4 + Math.random() * 2;
  }

  updateSprintState(dt);
  if (!lobbyPreviewMode) updatePlayer(dt);
  updateRemoteActors(dt);
  updateBall(dt);
  updateBallShadow();
  updateBallTrails(dt);
  updateSpectatorConfetti(dt);
  updateKickArrow();
  updateGoalkeeper(dt);
  updateCamera(dt);
  updateChargeMeter(dt);
  updatePlayerTags();
  if (!lobbyPreviewMode) {
    emitLocalPlayerState();
    emitBallState();
  }

  renderer.render(scene, camera);

  if (multiplayerMode && !lobbyPreviewMode && remaining <= 0 && !ended && !usesNetworkBallAuthority()) {
    ended = true;
    finishMatch();
  }
}

function setupCelebration() {
  const canvas = document.querySelector("#celebrationCanvas");
  celebrationRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  celebrationRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  celebrationRenderer.setSize(window.innerWidth, window.innerHeight);
  celebrationScene = new THREE.Scene();
  celebrationScene.background = new THREE.Color(0x07110d);
  celebrationCamera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 140);
  celebrationCamera.position.set(0, 5, 12);
  celebrationClock = new THREE.Clock();

  celebrationScene.add(new THREE.HemisphereLight(0xffffff, 0x12341e, 2.3));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(-5, 12, 6);
  celebrationScene.add(light);

  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x14753f, roughness: 0.85 })
  );
  pitch.rotation.x = -Math.PI / 2;
  celebrationScene.add(pitch);

  cupPlayer = createPlayer(true);
  cupPlayer.position.set(0, 0, 0);
  cupPlayer.scale.set(1.35, 1.35, 1.35);
  celebrationScene.add(cupPlayer);

  cup = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xf7c948, metalness: 0.8, roughness: 0.2 });
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), gold);
  bowl.scale.y = 0.82;
  cup.add(bowl);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.7, 18), gold);
  stem.position.y = -0.55;
  cup.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24), gold);
  base.position.y = -0.95;
  cup.add(base);
  cup.position.set(0, 5.6, 0);
  celebrationScene.add(cup);

  rain = [];
  for (let i = 0; i < 300; i += 1) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.26),
      new THREE.MeshBasicMaterial({ color: [0xffffff, 0x7cffb2, 0xf7c948, 0x91c9ff][i % 4], side: THREE.DoubleSide })
    );
    paper.position.set((Math.random() - 0.5) * 46, 7 + Math.random() * 20, (Math.random() - 0.5) * 36);
    paper.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    paper.userData.speed = 1.2 + Math.random() * 2.2;
    celebrationScene.add(paper);
    rain.push(paper);
  }
}

function startCelebration() {
  showScreen(endScreen);
  setupCelebration();
  animateCelebration();
}

function showMultiplayerFinalBanner() {
  let text = "EMPATE";
  if (redScore > blueScore) text = "GANO ROJO";
  if (blueScore > redScore) text = "GANO AZUL";
  goalBanner.textContent = `${text} ${redScore} - ${blueScore}`;
  goalBanner.classList.remove("show");
  goalBanner.classList.add("final-result");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
}

function showRoomLobbyPreview() {
  if (!activeRoom) return;
  startGame({ multiplayer: true, lobbyPreview: true });
  openRoomOverlay();
}

function finishMatch() {
  keys.clear();
  clearPlayerTags();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  stopGameAudio();
  if (multiplayerMode) {
    spectatorViewing = false;
    showMultiplayerFinalBanner();
    roomOverlayOpen = false;
    roomScreen.classList.remove("is-overlay");
    if (matchEndRoomTimer) clearTimeout(matchEndRoomTimer);
    matchEndRoomTimer = setTimeout(() => {
      matchEndRoomTimer = 0;
      if (activeRoom?.started) return;
      goalBanner.classList.remove("show", "final-result");
      renderRoom();
      showRoomLobbyPreview();
    }, 2000);
    return;
  }
  startCelebration();
}

function handleRoomClosed(payload = {}) {
  const localWasHost = activeRoom?.hostId === getLocalPlayerId() || suppressNextRoomClosedNotice;
  suppressNextRoomClosedNotice = false;
  if (matchEndRoomTimer) {
    clearTimeout(matchEndRoomTimer);
    matchEndRoomTimer = 0;
  }
  keys.clear();
  clearPlayerTags();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  multiplayerMode = false;
  networkSessionReady = false;
  roomOverlayOpen = false;
  activeRoom = null;
  selectedPlayerId = null;
  updateSpectatorNotice();
  stopGameAudio();
  updateServerStatus(socket?.connected ? "Online" : "Room cerrada por el creador");
  openRooms();
  if (!localWasHost && roomClosedDialog) {
    roomClosedMessage.textContent = payload.reason === "reconnect-timeout"
      ? "El creador de la sala cerró el juego o perdió la conexión."
      : "El creador de la sala salió.";
    roomClosedDialog.hidden = false;
  }
}

function animateCelebration() {
  if (!endScreen.classList.contains("is-active")) return;
  celebrationFrame = requestAnimationFrame(animateCelebration);
  const dt = Math.min(celebrationClock.getDelta(), 0.04);
  const time = performance.now() * 0.001;
  cupPlayer.rotation.y = Math.sin(time * 0.7) * 0.16;
  cup.position.y = 5.45 + Math.sin(time * 3) * 0.18;
  cup.rotation.y += dt * 1.4;
  celebrationCamera.position.x = Math.sin(time * 0.42) * 5;
  celebrationCamera.lookAt(0, 2.5, 0);
  rain.forEach((paper) => {
    paper.position.y -= paper.userData.speed * dt;
    paper.position.x += Math.sin(time + paper.position.z) * dt * 0.8;
    paper.rotation.x += dt * 3;
    paper.rotation.z += dt * 4;
    if (paper.position.y < 0) paper.position.y = 18 + Math.random() * 10;
  });
  celebrationRenderer.render(celebrationScene, celebrationCamera);
}

function renderRoomList() {
  if (!roomList) return;
  roomList.innerHTML = "";
  if (roomListState === "loading") {
    const empty = document.createElement("div");
    empty.className = "room-empty";
    const text = document.createElement("span");
    text.textContent = "Recuperando salas creadas...";
    empty.append(text);
    roomList.appendChild(empty);
    return;
  }
  if (roomListState === "error") {
    const empty = document.createElement("div");
    empty.className = "room-empty";
    empty.textContent = "No pudimos recuperar las salas. Revisa el engranaje.";
    roomList.appendChild(empty);
    return;
  }
  if (multiplayerRooms.length === 0) {
    const empty = document.createElement("div");
    empty.className = "room-empty";
    empty.textContent = "No hay salas creadas todavía.";
    roomList.appendChild(empty);
    return;
  }
  multiplayerRooms.forEach((room) => {
    const row = document.createElement("button");
    row.className = "room-row";
    row.type = "button";
    row.innerHTML = `
      <span class="room-ping">${room.ping} ms</span>
      <strong>${room.name}</strong>
      <span class="room-count">${room.players.length} / ${room.maxPlayers}</span>
    `;
    row.addEventListener("click", () => {
      if (onlineMode && socket?.connected) {
        requestPlayerIdentity(`Entrar a ${room.name}`, () => joinOnlineRoom(room.id));
      } else {
        updateServerStatus("Servidor desconectado");
      }
    });
    roomList.appendChild(row);
  });
}

function openRooms() {
  setupAudio();
  updateConnectionUi();
  renderRoomList();
  showScreen(menu);
  startMenuMusic();
  updateSpectatorNotice();
}

function openRoomOverlay() {
  if (!multiplayerMode || !activeRoom) return;
  keys.clear();
  roomOverlayOpen = true;
  if (isCurrentRoomHost()) {
    acknowledgedSpectatorSignature = activeRoom.players
      ?.filter((roomPlayer) => roomPlayer.team === "spectators")
      .map((roomPlayer) => roomPlayer.id)
      .sort()
      .join("|") || "";
  }
  renderRoom();
  roomScreen.classList.add("is-active", "is-overlay");
  updateSpectatorNotice();
}

function enterLiveSpectatorMode() {
  if (!multiplayerMode || !activeRoom?.started || getLocalRoomPlayer()?.team !== "spectators") return false;
  spectatorViewing = true;
  cameraMode = "third";
  spectatorJumpVelocity = 0;
  spectatorJumpQueued = false;
  spectatorGrounded = true;
  keys.clear();
  resetTouchStick();
  return true;
}

function closeRoomOverlay() {
  if (!roomOverlayOpen) return;
  const enteredStands = enterLiveSpectatorMode();
  if (enteredStands) {
    syncMultiplayerTeamsToField();
    if (activeRoom.matchState) applyAuthoritativeSnapshot(activeRoom.matchState, true);
  }
  updateGameplayControlHints();
  roomOverlayOpen = false;
  roomScreen.classList.remove("is-active", "is-overlay");
}

function leaveRoom() {
  if (matchEndRoomTimer) {
    clearTimeout(matchEndRoomTimer);
    matchEndRoomTimer = 0;
  }
  if (onlineMode && socket?.connected && activeRoom) {
    suppressNextRoomClosedNotice = isCurrentRoomHost();
    socket.emit("room:leave");
  }
  keys.clear();
  clearPlayerTags();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  multiplayerMode = false;
  networkSessionReady = false;
  spectatorViewing = false;
  roomOverlayOpen = false;
  activeRoom = null;
  selectedPlayerId = null;
  stopGameAudio();
  openRooms();
}

function toggleProModeInGame() {
  if (!gameScreen.classList.contains("is-active")) return;
  proModeEnabled = !proModeEnabled;
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0.2;
  if (multiplayerMode && roomProModeToggle) roomProModeToggle.checked = proModeEnabled;
  if (!multiplayerMode && proModeToggle) proModeToggle.checked = proModeEnabled;
  momentEl.textContent = proModeEnabled ? "Pro mode activado" : "No Pro: balon magnetico";
}

function createRoom() {
  if (!onlineMode || !socket?.connected) {
    updateServerStatus("Servidor desconectado");
    return;
  }
  requestPlayerIdentity("Crear partida", createOnlineRoom, { includeRoom: true });
}

function createOnlineRoom() {
  if (onlineMode && socket?.connected) {
    socket.emit("room:create", {
      name: roomNameInput.value,
      maxPlayers: roomMaxInput.value,
      playerName: onlinePlayerName,
    }, (response) => {
      if (!response?.ok) {
        updateServerStatus(response?.error || "No pude crear");
        return;
      }
      activeRoom = response.room;
      selectedPlayerId = clientPlayerId;
      networkSessionReady = true;
      showRoomLobbyPreview();
    });
    return;
  }
}

function openRoom(roomId) {
  activeRoom = multiplayerRooms.find((room) => room.id === roomId) || multiplayerRooms[0];
  if (!onlineMode && activeRoom && !activeRoom.players.some((roomPlayer) => roomPlayer.id === "local-host")) {
    activeRoom.players.push({ id: "local-host", name: "davo", team: "spectators", score: 0 });
  }
  selectedPlayerId = activeRoom?.players[0]?.id || null;
  roomLocked = false;
  showRoomLobbyPreview();
}

function renderPlayers(container, team) {
  container.innerHTML = "";
  const canManageRoom = isCurrentRoomHost();
  activeRoom.players
    .filter((playerInfo) => playerInfo.team === team)
    .forEach((playerInfo) => {
      const row = document.createElement("button");
      row.className = `player-row${playerInfo.id === selectedPlayerId ? " is-selected" : ""}`;
      row.type = "button";
      row.draggable = canManageRoom;
      row.dataset.playerId = playerInfo.id;
      row.innerHTML = `<span>${playerInfo.name}</span><small>${playerInfo.score}</small>`;
      row.addEventListener("click", () => {
        selectedPlayerId = playerInfo.id;
        renderRoom();
      });
      row.addEventListener("dragstart", (event) => {
        if (!canManageRoom) {
          event.preventDefault();
          return;
        }
        selectedPlayerId = playerInfo.id;
        event.dataTransfer.setData("text/plain", playerInfo.id);
        event.dataTransfer.effectAllowed = "move";
        row.classList.add("is-dragging");
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("is-dragging");
      });
      container.appendChild(row);
    });
}

function setupRoomDropZone(container, team) {
  if (!container) return;
  container.addEventListener("dragover", (event) => {
    if (!isCurrentRoomHost()) return;
    event.preventDefault();
    container.classList.add("is-drop-target");
  });
  container.addEventListener("dragleave", () => {
    container.classList.remove("is-drop-target");
  });
  container.addEventListener("drop", (event) => {
    event.preventDefault();
    container.classList.remove("is-drop-target");
    if (!isCurrentRoomHost()) return;
    const playerId = event.dataTransfer.getData("text/plain") || selectedPlayerId;
    if (!playerId) return;
    selectedPlayerId = playerId;
    moveSelectedPlayer(team);
  });
}

function renderRoom() {
  if (!activeRoom) return;
  const canManageRoom = isCurrentRoomHost();
  const matchRunning = activeRoom.started === true
    || Boolean(activeRoom.matchState?.matchId && activeRoom.matchEndsAt);
  const localIsSpectator = getLocalRoomPlayer()?.team === "spectators";
  activeRoomName.textContent = activeRoom.name;
  if (activeRoom.settings) {
    roomTimeInput.value = activeRoom.settings.timeLimit || 5;
    roomUnlimitedToggle.checked = activeRoom.settings.unlimited === true;
    roomScoreInput.value = activeRoom.settings.scoreLimit || 9;
    roomProModeToggle.checked = activeRoom.settings.proMode === true;
    roomKeeperToggle.checked = activeRoom.settings.keeperEnabled === true;
    roomSprintToggle.checked = activeRoom.settings.limitedSprint !== false;
  }
  renderPlayers(redTeamList, "red");
  renderPlayers(spectatorsList, "spectators");
  renderPlayers(blueTeamList, "blue");
  lockRoomBtn.textContent = roomLocked ? "Unlock" : "Lock";
  startMultiplayerGameBtn.textContent = canManageRoom
    ? "Start game"
    : (matchRunning ? (localIsSpectator ? "Mirar partido" : "Back to game") : "Waiting for a new game");
  startMultiplayerGameBtn.disabled = !canManageRoom && !matchRunning;
  startMultiplayerGameBtn.style.display = "";
  startMultiplayerGameBtn.classList.toggle("is-waiting", !canManageRoom && !matchRunning);
  closeRoomOverlayBtn.textContent = "X";
  copyLinkBtn.style.display = canManageRoom ? "" : "none";
  closeRoomOverlayBtn.style.display = canManageRoom && matchRunning ? "inline-flex" : "none";
  leaveRoomBtn.style.display = "";
  [
    autoTeamsBtn,
    randomTeamsBtn,
    lockRoomBtn,
    resetTeamsBtn,
    moveToRedBtn,
    moveToBlueBtn,
    moveToSpectatorsFromRedBtn,
    moveToSpectatorsFromBlueBtn,
  ].forEach((button) => {
    button.style.display = canManageRoom ? "" : "none";
  });
  roomTimeInput.disabled = !canManageRoom || roomUnlimitedToggle.checked;
  [roomScoreInput, roomProModeToggle, roomKeeperToggle, roomSprintToggle, roomUnlimitedToggle].forEach((input) => {
    input.disabled = !canManageRoom;
  });
  if (pickStadiumBtn) pickStadiumBtn.style.display = canManageRoom ? "" : "none";
  redTeamList.classList.toggle("is-locked", !canManageRoom);
  spectatorsList.classList.toggle("is-locked", !canManageRoom);
  blueTeamList.classList.toggle("is-locked", !canManageRoom);
  updateSpectatorNotice();
}

function moveSelectedPlayer(team) {
  if (!activeRoom || !selectedPlayerId || !isCurrentRoomHost()) return;
  if (onlineMode && socket?.connected) {
    socket.emit("player:team", { playerId: selectedPlayerId, team });
    return;
  }
  const playerInfo = activeRoom.players.find((candidate) => candidate.id === selectedPlayerId);
  if (!playerInfo) return;
  playerInfo.team = team;
  renderRoom();
  syncMultiplayerTeamsToField();
}

function autoTeams() {
  if (!activeRoom) return;
  if (onlineMode && socket?.connected) {
    socket.emit("room:autoTeams");
    return;
  }
  activeRoom.players.forEach((playerInfo, index) => {
    playerInfo.team = index % 2 === 0 ? "red" : "blue";
  });
  renderRoom();
  syncMultiplayerTeamsToField();
}

function randomTeams() {
  if (!activeRoom) return;
  if (onlineMode && socket?.connected) {
    socket.emit("room:autoTeams");
    return;
  }
  activeRoom.players
    .map((playerInfo) => ({ playerInfo, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .forEach(({ playerInfo }, index) => {
      playerInfo.team = index % 2 === 0 ? "red" : "blue";
    });
  renderRoom();
  syncMultiplayerTeamsToField();
}

function resetTeams() {
  if (!activeRoom) return;
  if (onlineMode && socket?.connected) {
    socket.emit("room:resetTeams");
    return;
  }
  activeRoom.players.forEach((playerInfo) => {
    playerInfo.team = "spectators";
  });
  renderRoom();
  syncMultiplayerTeamsToField();
}

function copyRoomLink() {
  const params = new URLSearchParams();
  if (activeRoom?.id) params.set("room", activeRoom.id);
  if (onlineMode && socketServerUrl) params.set("server", socketServerUrl);
  const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).catch(() => {});
  }
}

function syncOnlineRoomSettings() {
  if (!onlineMode || !socket?.connected || !activeRoom || !isCurrentRoomHost()) return;
  socket.emit("room:settings", {
    timeLimit: roomTimeInput.value,
    unlimited: roomUnlimitedToggle.checked,
    scoreLimit: roomScoreInput.value,
    proMode: roomProModeToggle.checked,
    keeperEnabled: roomKeeperToggle.checked,
    limitedSprint: roomSprintToggle.checked,
  });
}

function startGame(options = {}) {
  setupAudio();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  if (celebrationFrame) cancelAnimationFrame(celebrationFrame);
  celebrationFrame = 0;
  keys.clear();
  sprintEnergy = 1;
  sprintRechargeDelay = 0;
  clearPlayerTags();
  roomOverlayOpen = false;
  multiplayerMode = Boolean(options.multiplayer);
  if (!multiplayerMode) currentMatchId = null;
  else if (activeRoom?.matchState?.matchId) currentMatchId = activeRoom.matchState.matchId;
  lobbyPreviewMode = Boolean(options.lobbyPreview);
  showScreen(gameScreen);
  if (lobbyPreviewMode) stopGameAudio();
  else startStadiumAudio();
  setupGame();
  if (multiplayerMode && activeRoom?.matchState) {
    applyAuthoritativeSnapshot(activeRoom.matchState, true);
  }
  if (multiplayerMode) {
    updateTimer();
    momentEl.textContent = lobbyPreviewMode ? "Room abierta: acomodando equipos" : "Multijugador online";
  }
}

function returnToMenu() {
  if (onlineMode && socket?.connected && activeRoom && multiplayerMode && !isCurrentRoomHost()) {
    leaveRoom();
    return;
  }
  if (matchEndRoomTimer) {
    clearTimeout(matchEndRoomTimer);
    matchEndRoomTimer = 0;
  }
  keys.clear();
  clearPlayerTags();
  multiplayerMode = false;
  roomOverlayOpen = false;
  stopGameAudio();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  if (renderer) renderer.setAnimationLoop(null);
  if (celebrationFrame) cancelAnimationFrame(celebrationFrame);
  showScreen(menu);
  updateSpectatorNotice();
  startMenuMusic();
}

function resize() {
  if (renderer && camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  if (celebrationRenderer && celebrationCamera) {
    celebrationCamera.aspect = window.innerWidth / window.innerHeight;
    celebrationCamera.updateProjectionMatrix();
    celebrationRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function updateTouchStick(clientX, clientY) {
  if (!touchJoystick || !touchStick) return;
  const rect = touchJoystick.getBoundingClientRect();
  const radius = rect.width / 2;
  const dx = clientX - rect.left - radius;
  const dy = clientY - rect.top - radius;
  const length = Math.min(Math.hypot(dx, dy), radius - 18);
  const angle = Math.atan2(dy, dx);
  const knobX = Math.cos(angle) * length;
  const knobY = Math.sin(angle) * length;
  touchMoveVector.set(knobX / (radius - 18), knobY / (radius - 18));
  touchStick.style.transform = `translate(${knobX}px, ${knobY}px)`;
}

function resetTouchStick() {
  touchPointerId = null;
  touchMoveVector.set(0, 0);
  if (touchStick) touchStick.style.transform = "translate(0, 0)";
}

function setupTouchControls() {
  const isTouchDevice = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  document.body.classList.toggle("touch-enabled", isTouchDevice);
  if (!isTouchDevice || !touchControls || !touchJoystick) return;

  touchJoystick.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    touchPointerId = event.pointerId;
    touchJoystick.setPointerCapture(event.pointerId);
    updateTouchStick(event.clientX, event.clientY);
  });
  touchJoystick.addEventListener("pointermove", (event) => {
    if (event.pointerId !== touchPointerId) return;
    event.preventDefault();
    updateTouchStick(event.clientX, event.clientY);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
    touchJoystick.addEventListener(eventName, resetTouchStick);
  });

  touchCameraBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    toggleCameraMode();
  });
  touchProBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    toggleProModeInGame();
  });
  touchSoundBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    toggleStadiumSound();
  });
  touchSprintBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    touchSprintActive = true;
    touchSprintBtn.classList.add("is-active");
  });
  ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"].forEach((eventName) => {
    touchSprintBtn?.addEventListener(eventName, (event) => {
      event.preventDefault();
      touchSprintActive = false;
      touchSprintBtn.classList.remove("is-active");
    });
  });
  touchSoftBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (multiplayerMode && spectatorViewing && getLocalRoomPlayer()?.team === "spectators") {
      const now = performance.now();
      if (now - lastSpectatorConfettiAt >= 700) {
        lastSpectatorConfettiAt = now;
        socket?.emit("spectator:confetti", { matchId: currentMatchId });
      }
      return;
    }
    kickBall(16.66, modePhrase("Pase alto por encima del arquero", "Pase alto: que la busque el cielo"), 0, 8.4, "pass");
  });
  touchPassBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    kickBall(16.66, "Pase potente al espacio", 0, 0.8, "pass");
  });
  touchShotBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (multiplayerMode && spectatorViewing && getLocalRoomPlayer()?.team === "spectators") {
      spectatorJumpQueued = true;
      return;
    }
    beginChargedShot();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
    touchShotBtn?.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (multiplayerMode && spectatorViewing && getLocalRoomPlayer()?.team === "spectators") return;
      releaseChargedShot();
    });
  });
  touchControls.addEventListener("contextmenu", (event) => event.preventDefault());
}

playBtn.addEventListener("click", startGame);
howToPlayBtn?.addEventListener("click", () => {
  howToPlayDialog.hidden = false;
});
closeHowToPlayBtn?.addEventListener("click", () => {
  howToPlayDialog.hidden = true;
});
howToPlayDialog?.addEventListener("click", (event) => {
  if (event.target === howToPlayDialog) howToPlayDialog.hidden = true;
});
logsBtn?.addEventListener("click", () => {
  logsDialog.hidden = false;
});
closeLogsBtn?.addEventListener("click", () => {
  logsDialog.hidden = true;
});
logsDialog?.addEventListener("click", (event) => {
  if (event.target === logsDialog) logsDialog.hidden = true;
});
musicToggleBtn.addEventListener("click", toggleMute);
connectServerBtn.addEventListener("click", connectOnlineServer);
serverSettingsBtn?.addEventListener("click", () => {
  serverSettingsPanel.hidden = !serverSettingsPanel.hidden;
  if (!serverSettingsPanel.hidden) {
    serverUrlInput.focus();
    serverUrlInput.select();
  }
});
cancelPlayerNameBtn?.addEventListener("click", closePlayerIdentity);
closeRoomNoticeBtn?.addEventListener("click", () => {
  roomClosedDialog.hidden = true;
});
playerNameForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!saveEnteredPlayerName()) return;
  if (pendingIdentityNeedsRoom && !(roomNameInput.value || "").trim()) {
    roomNameInput.focus();
    return;
  }
  const action = pendingIdentityAction;
  closePlayerIdentity();
  action?.();
});
playerNameDialog?.addEventListener("click", (event) => {
  if (event.target === playerNameDialog) closePlayerIdentity();
});
againBtn.addEventListener("click", startGame);
roomGameBtn.addEventListener("click", openRoomOverlay);
backMenuBtn.addEventListener("click", () => {
  const multiplayerMatchOpen = multiplayerMode
    && gameScreen.classList.contains("is-active")
    && !roomOverlayOpen;
  if (
    multiplayerMatchOpen
    && !window.confirm("¿Seguro que querés volver al menú y salir de la partida?")
  ) {
    return;
  }
  returnToMenu();
});
roomsBackBtn?.addEventListener("click", returnToMenu);
createRoomBtn.addEventListener("click", createRoom);
moveToRedBtn.addEventListener("click", () => moveSelectedPlayer("red"));
moveToBlueBtn.addEventListener("click", () => moveSelectedPlayer("blue"));
moveToSpectatorsFromRedBtn.addEventListener("click", () => moveSelectedPlayer("spectators"));
moveToSpectatorsFromBlueBtn.addEventListener("click", () => moveSelectedPlayer("spectators"));
setupRoomDropZone(redTeamList, "red");
setupRoomDropZone(spectatorsList, "spectators");
setupRoomDropZone(blueTeamList, "blue");
autoTeamsBtn.addEventListener("click", autoTeams);
randomTeamsBtn.addEventListener("click", randomTeams);
resetTeamsBtn.addEventListener("click", resetTeams);
lockRoomBtn.addEventListener("click", () => {
  if (onlineMode && socket?.connected) {
    socket.emit("room:lock", !roomLocked);
    return;
  }
  roomLocked = !roomLocked;
  renderRoom();
});
copyLinkBtn.addEventListener("click", copyRoomLink);
closeRoomOverlayBtn.addEventListener("click", closeRoomOverlay);
leaveRoomBtn.addEventListener("click", leaveRoom);
roomTimeInput.addEventListener("change", syncOnlineRoomSettings);
roomUnlimitedToggle.addEventListener("change", () => {
  roomTimeInput.disabled = roomUnlimitedToggle.checked;
  syncOnlineRoomSettings();
});
roomScoreInput.addEventListener("change", syncOnlineRoomSettings);
roomProModeToggle.addEventListener("change", syncOnlineRoomSettings);
roomKeeperToggle.addEventListener("change", syncOnlineRoomSettings);
roomSprintToggle.addEventListener("change", syncOnlineRoomSettings);
startMultiplayerGameBtn.addEventListener("click", () => {
  if (!isCurrentRoomHost()) {
    if (!activeRoom?.started) return;
    if (getLocalRoomPlayer()?.team === "spectators") {
      spectatorViewing = true;
      startGame({ multiplayer: true });
      return;
    }
    if (multiplayerMode) closeRoomOverlay();
    return;
  }
  if (onlineMode && socket?.connected) {
    socket.emit("room:start", {
      timeLimit: roomTimeInput.value,
      unlimited: roomUnlimitedToggle.checked,
      scoreLimit: roomScoreInput.value,
      proMode: roomProModeToggle.checked,
      keeperEnabled: roomKeeperToggle.checked,
      limitedSprint: roomSprintToggle.checked,
    });
    return;
  }
  startGame({ multiplayer: true });
});
closeBtn.addEventListener("click", () => {
  window.close();
  showScreen(menu);
});

window.addEventListener("keydown", (event) => {
  if (
    !event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && ["Equal", "NumpadAdd", "Minus", "NumpadSubtract"].includes(event.code)
  ) {
    event.preventDefault();
    adjustContextVolume(event.code === "Equal" || event.code === "NumpadAdd" ? 1 : -1);
    return;
  }
  if (event.code === "Escape" && !howToPlayDialog?.hidden) {
    event.preventDefault();
    howToPlayDialog.hidden = true;
    return;
  }
  if (shouldBlockBrowserShortcut(event)) {
    event.preventDefault();
  }
}, { capture: true });

window.addEventListener("keyup", (event) => {
  if (shouldBlockBrowserShortcut(event)) {
    event.preventDefault();
  }
}, { capture: true });

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyM" && !gameScreen.classList.contains("is-active")) {
    event.preventDefault();
    toggleMute();
    return;
  }
  const playing = gameScreen.classList.contains("is-active");
  if (event.code === "Escape" && playing && !multiplayerMode) {
    event.preventDefault();
    returnToMenu();
    return;
  }
  if (event.code === "Escape" && multiplayerMode && playing) {
    event.preventDefault();
    if (roomOverlayOpen) closeRoomOverlay();
    else openRoomOverlay();
    return;
  }
  if (roomOverlayOpen) {
    keys.clear();
    return;
  }
  if (playing && (gameplayKeys.has(event.code) || (event.ctrlKey && gameplayKeys.has(event.code)))) {
    event.preventDefault();
  }
  keys.add(event.code);
  if (event.repeat) return;
  const watchingFromStands = multiplayerMode
    && spectatorViewing
    && getLocalRoomPlayer()?.team === "spectators";
  if (watchingFromStands && event.code === "Space") {
    spectatorJumpQueued = true;
    return;
  }
  if (watchingFromStands && event.code === "KeyQ") {
    const now = performance.now();
    if (now - lastSpectatorConfettiAt >= 700) {
      lastSpectatorConfettiAt = now;
      socket?.emit("spectator:confetti", { matchId: currentMatchId });
    }
    return;
  }
  if (event.code === "KeyQ") {
    kickBall(16.66, modePhrase("Pase alto por encima del arquero", "Pase alto: que la busque el cielo"), 0, 8.4, "pass");
  }
  if (event.code === "KeyE" && !event.ctrlKey) {
    kickBall(16.66, "Pase potente al espacio", 0, 0.8, "pass");
  }
  if (event.code === "KeyC") {
    toggleCameraMode();
  }
  if (event.code === "KeyP") {
    toggleProModeInGame();
  }
  if (event.code === "KeyM") {
    toggleMute();
  }
  if (event.code === "Space") {
    beginChargedShot();
  }
});

window.addEventListener("keyup", (event) => {
  const playing = gameScreen.classList.contains("is-active");
  if (event.code === "Escape" && playing && !multiplayerMode) {
    event.preventDefault();
    return;
  }
  if (event.code === "Escape" && multiplayerMode && playing) {
    event.preventDefault();
    return;
  }
  if (roomOverlayOpen) {
    keys.clear();
    return;
  }
  if (playing && (gameplayKeys.has(event.code) || (event.ctrlKey && gameplayKeys.has(event.code)))) {
    event.preventDefault();
  }
  keys.delete(event.code);
  const watchingFromStands = multiplayerMode
    && spectatorViewing
    && getLocalRoomPlayer()?.team === "spectators";
  if (event.code === "Space" && !watchingFromStands) {
    releaseChargedShot();
  }
});
window.addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !socket || socket.connected) return;
  updateServerStatus("Reconectando...");
  socket.connect();
});

if (new URLSearchParams(window.location.search).has("play")) {
  startGame();
}

if (new URLSearchParams(window.location.search).has("broadcast")) {
  cameraMode = "broadcast";
}

setupAudio();
setupTouchControls();
updateMusicButton();
serverUrlInput.value = new URLSearchParams(window.location.search).get("server") || socketServerUrl || defaultServerUrl;
playerNameInput.value = onlinePlayerName;
updateConnectionUi();
renderRoomList();

const sharedRoomId = new URLSearchParams(window.location.search).get("room");
connectOnlineServer();
if (sharedRoomId) {
  let sharedRoomAttempts = 0;
  const joinSharedRoomWhenReady = () => {
    if (socket?.connected) {
      requestPlayerIdentity("Entrar a la partida", () => joinOnlineRoom(sharedRoomId));
      return;
    }
    sharedRoomAttempts += 1;
    if (sharedRoomAttempts < 40) setTimeout(joinSharedRoomWhenReady, 250);
  };
  joinSharedRoomWhenReady();
}
