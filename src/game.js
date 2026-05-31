const menu = document.querySelector("#menu");
const roomsScreen = document.querySelector("#roomsScreen");
const roomScreen = document.querySelector("#roomScreen");
const gameScreen = document.querySelector("#gameScreen");
const endScreen = document.querySelector("#endScreen");
const playBtn = document.querySelector("#playBtn");
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
const playerNameInput = document.querySelector("#playerNameInput");
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
const roomScoreInput = document.querySelector("#roomScoreInput");
const roomProModeToggle = document.querySelector("#roomProModeToggle");
const timerEl = document.querySelector("#timer");
const scoreEl = document.querySelector("#score");
const momentEl = document.querySelector("#moment");
const goalBanner = document.querySelector("#goalBanner");
const playerOverlay = document.querySelector("#playerOverlay");
const chargeMeter = document.querySelector("#chargeMeter");
const chargeFill = document.querySelector("#chargeFill");
const chargeText = document.querySelector("#chargeText");

const matchLength = 180;
const field = { width: 42, length: 76 };
const keys = new Set();
const lines = [
  "Payne cambia de marcha",
  "La pelota firmo contrato con el gol",
  "El rival se acerca y reconsidera su vida",
  "Nueva Zelanda activa modo leyenda",
  "Payne no corre: el pasto se mueve",
  "El arquero ya esta mirando al juez",
];
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
  "KeyM",
  "KeyP",
  "ShiftLeft",
  "ControlLeft",
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
let kickArrow;
let goalKeeper;
let keeperState;
let opponents = [];
let multiplayerActors = [];
let playerTags = [];
let score = 0;
let redScore = 0;
let blueScore = 0;
let remaining = matchLength;
let playerAngle = 0;
let cameraMode = "third";
let proModeEnabled = true;
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
let goalCooldown = 0;
let ended = false;
let phraseTimer = 0;
let activeRoom = null;
let selectedPlayerId = null;
let roomLocked = false;
let roomOverlayOpen = false;
let onlineMode = false;
let socket = null;
let socketServerUrl = localStorage.getItem("npgServerUrl") || "";
let onlinePlayerName = localStorage.getItem("npgPlayerName") || "davo";
let lastNetStateAt = 0;
let lastBallNetStateAt = 0;
let multiplayerRooms = [
  {
    id: "classic-kiwi",
    name: "kiwi classics",
    ping: 38,
    maxPlayers: 12,
    players: [
      { id: "host-kiwi", name: "kiwiHost", team: "red", score: 0 },
      { id: "blue-rocket", name: "blueRocket", team: "blue", score: 0 },
      { id: "spectator-1", name: "mateo", team: "spectators", score: 0 },
    ],
  },
  {
    id: "payne-after",
    name: "after office payne",
    ping: 71,
    maxPlayers: 16,
    players: [
      { id: "after-1", name: "fer", team: "red", score: 0 },
      { id: "after-2", name: "nati", team: "blue", score: 0 },
      { id: "after-3", name: "joaco", team: "spectators", score: 0 },
      { id: "after-4", name: "lu", team: "spectators", score: 0 },
    ],
  },
];

let celebrationRenderer;
let celebrationScene;
let celebrationCamera;
let celebrationClock;
let cupPlayer;
let cup;
let rain = [];
let gameFrame = 0;
let celebrationFrame = 0;
let soundMuted = false;
let menuMusic;
let stadiumLoop;
let goalSound;
let kickSound;

function showScreen(active) {
  roomOverlayOpen = false;
  [menu, roomsScreen, roomScreen, gameScreen, endScreen].forEach((screen) => {
    screen.classList.remove("is-active");
    screen.classList.remove("is-overlay");
  });
  active.classList.add("is-active");
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
  menuMusic = createAudio("./sonidos/menu.mp3", { loop: true, volume: 0.72 });
  stadiumLoop = createAudio("./sonidos/ambiente_loop.mp3", { loop: true, volume: 0.32 });
  goalSound = createAudio("./sonidos/gol.mp3", { loop: false, volume: 0.86 });
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
  musicToggleBtn.textContent = soundMuted ? "Musica: OFF" : "Musica: ON";
}

function startMenuMusic() {
  setupAudio();
  stopAudio(stadiumLoop);
  if (menuMusic.paused && menuMusic.currentTime > 0.25) menuMusic.currentTime = 0;
  if (!soundMuted) safePlay(menuMusic);
}

function startStadiumAudio() {
  setupAudio();
  stopAudio(menuMusic);
  if (!soundMuted) safePlay(stadiumLoop);
}

function stopGameAudio() {
  stopAudio(stadiumLoop);
  stopAudio(goalSound);
}

function toggleMute() {
  setupAudio();
  soundMuted = !soundMuted;
  updateMusicButton();
  if (soundMuted) {
    stopAudio(menuMusic);
    stopAudio(stadiumLoop);
    stopAudio(goalSound);
    return;
  }
  if (gameScreen.classList.contains("is-active")) startStadiumAudio();
  else if (menu.classList.contains("is-active")) startMenuMusic();
}

function unlockMenuAudio() {
  if (menu.classList.contains("is-active") && !soundMuted) startMenuMusic();
}

document.addEventListener("pointerdown", unlockMenuAudio);
document.addEventListener("keydown", unlockMenuAudio);

function updateServerStatus(text) {
  if (serverStatus) serverStatus.textContent = text;
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

  onlinePlayerName = (playerNameInput.value || "davo").trim().slice(0, 18) || "davo";
  localStorage.setItem("npgServerUrl", url);
  localStorage.setItem("npgPlayerName", onlinePlayerName);
  socketServerUrl = url;
  updateServerStatus("Conectando...");

  try {
    await loadSocketClient(url);
    if (socket) socket.disconnect();
    socket = window.io(url, { transports: ["websocket", "polling"] });
    socket.on("connect", () => {
      onlineMode = true;
      updateServerStatus(`Online ${socket.id.slice(0, 4)}`);
      socket.emit("rooms:list", (response) => {
        if (response?.ok) {
          multiplayerRooms = response.rooms;
          renderRoomList();
        }
      });
    });
    socket.on("disconnect", () => {
      onlineMode = false;
      updateServerStatus("Offline");
    });
    socket.on("rooms:update", (rooms) => {
      if (!onlineMode) return;
      multiplayerRooms = rooms;
      if (roomsScreen.classList.contains("is-active")) renderRoomList();
    });
    socket.on("room:state", (room) => {
      activeRoom = room;
      roomLocked = Boolean(room.locked);
      selectedPlayerId = socket.id;
      if (roomScreen.classList.contains("is-active")) renderRoom();
      if (multiplayerMode) syncMultiplayerTeamsToField();
    });
    socket.on("room:started", (room) => {
      activeRoom = room;
      roomTimeInput.value = room.settings?.timeLimit || 3;
      roomScoreInput.value = room.settings?.scoreLimit || 3;
      roomProModeToggle.checked = room.settings?.proMode !== false;
      startGame({ multiplayer: true });
    });
    socket.on("player:state", ({ playerId, state }) => {
      applyRemotePlayerState(playerId, state);
    });
    socket.on("ball:state", (state) => {
      applyNetworkBallState(state);
    });
    socket.on("ball:kick", (kick) => {
      applyNetworkKickRequest(kick);
    });
    socket.on("match:score", (payload) => {
      applyNetworkScore(payload);
    });
  } catch {
    onlineMode = false;
    updateServerStatus("Error servidor");
  }
}

function createKitTexture(team = "neutral") {
  return makeCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = team === "red" ? "#ff3155" : team === "blue" ? "#2e66ff" : "#f8fbff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = team === "neutral" ? "#101313" : "#f8fbff";
    ctx.fillRect(0, 0, w, 24);
    ctx.fillRect(0, h - 24, w, 24);
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
  ctx.font = multiplayerMode ? "900 68px Arial" : "900 104px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(multiplayerMode ? `${redScore} - ${blueScore}` : `${score} - 0`, 256, 132);
  ctx.font = "900 24px Arial";
  ctx.fillStyle = "#7cffb2";
  ctx.fillText(multiplayerMode ? "ROJO        AZUL" : "NO PAYNE NO GAIN", 256, 44);
  stadiumScoreTexture.needsUpdate = true;
}

function createPlayer(isHero = false, team = "red") {
  const group = new THREE.Group();
  const limbs = { arms: [], legs: [] };
  const kit = isHero
    ? new THREE.MeshStandardMaterial({ map: createKitTexture(multiplayerMode ? team : "neutral"), roughness: 0.52 })
    : new THREE.MeshStandardMaterial({ color: team === "blue" ? 0x2457d6 : 0xa5182d, roughness: 0.62 });
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

  const shorts = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.62), dark);
  shorts.position.y = 1.24;
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

function addField() {
  const apron = new THREE.Mesh(
    new THREE.PlaneGeometry(field.width + 24, field.length + 24),
    new THREE.MeshBasicMaterial({ color: 0x14682d })
  );
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = -0.012;
  scene.add(apron);

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
    const apronWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.35, field.length + 24), standBaseMat);
    apronWall.position.set(side * (field.width / 2 + 4.25), 0.68, 0);
    scene.add(apronWall);

    for (let row = 0; row < 13; row += 1) {
      const y = 1.15 + row * 0.34;
      const rowX = side * (field.width / 2 + 5.4 + row * 0.74);
      const tread = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.16, field.length + 22), stepMat);
      tread.position.set(rowX, y - 0.17, 0);
      scene.add(tread);

      for (let z = -32; z <= 32; z += 8) {
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
  const backWallW = backWallE.clone();
  backWallW.position.x = -field.width / 2 - 15;
  scene.add(backWallW);

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
  return getTeamStartPosition(localPlayer.team, teamIndex, teamPlayers.length);
}

function getLocalPlayerId() {
  return onlineMode && socket?.id ? socket.id : "local-host";
}

function isOnlineHost() {
  return onlineMode && socket?.connected && activeRoom?.hostId === socket.id;
}

function usesNetworkBallAuthority() {
  return onlineMode && socket?.connected && multiplayerMode;
}

function getLocalRoomPlayer() {
  if (!activeRoom) return { id: "local-host", name: "davo", team: "red", score: 0 };
  return activeRoom.players.find((roomPlayer) => roomPlayer.id === getLocalPlayerId()) || activeRoom.players[0];
}

function getInitialPlayerAngle() {
  if (!multiplayerMode) return 0;
  return getLocalRoomPlayer().team === "blue" ? Math.PI : 0;
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
      color: team === "blue" ? 0x2457d6 : 0xa5182d,
      roughness: 0.62,
    });
  }
}

function syncMultiplayerTeamsToField() {
  if (!multiplayerMode || !activeRoom || !scene || !player) return;

  ballControlled = false;
  ballOwner = null;
  multiplayerActors.forEach((actor) => scene.remove(actor));
  multiplayerActors = [];

  const localPlayer = getLocalRoomPlayer();
  player.userData.name = localPlayer.name;
  player.userData.isLocal = true;
  player.visible = localPlayer.team === "red" || localPlayer.team === "blue";
  if (player.visible) {
    applyPlayerTeam(player, localPlayer.team);
    player.position.copy(getLocalMultiplayerStartPosition());
    playerAngle = getInitialPlayerAngle();
    player.rotation.y = playerAngle;
    playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
  }

  addMultiplayerActors();
  setupPlayerTags();
}

function applyRemotePlayerState(playerId, state) {
  if (!multiplayerMode || !state || playerId === getLocalPlayerId()) return;
  const actor = multiplayerActors.find((unit) => unit.userData.playerId === playerId);
  if (!actor) return;
  actor.position.set(state.x, state.y || 0, state.z);
  actor.rotation.y = state.angle || 0;
  animatePlayerRun(actor, 0.016, Boolean(state.moving));
}

function emitLocalPlayerState() {
  if (!onlineMode || !socket?.connected || !multiplayerMode || !player?.visible) return;
  const now = performance.now();
  if (now - lastNetStateAt < 50) return;
  lastNetStateAt = now;
  socket.emit("player:state", {
    x: player.position.x,
    y: player.position.y,
    z: player.position.z,
    angle: player.rotation.y,
    moving: player.position.y > 0.01,
  });
}

function emitBallState() {
  if (!usesNetworkBallAuthority() || !isOnlineHost() || !ball || !ballVelocity) return;
  const now = performance.now();
  if (now - lastBallNetStateAt < 33) return;
  lastBallNetStateAt = now;
  socket.emit("ball:state", {
    x: ball.position.x,
    y: ball.position.y,
    z: ball.position.z,
    vx: ballVelocity.x,
    vz: ballVelocity.z,
    vy: ballVerticalVelocity,
    charge: ballShotCharge,
    ownerId: ballOwner?.userData?.playerId || (ballOwner === player ? getLocalPlayerId() : null),
  });
}

function applyNetworkBallState(state = {}) {
  if (!usesNetworkBallAuthority() || isOnlineHost() || !ball || !ballVelocity) return;
  ball.position.set(
    Number(state.x) || 0,
    Number(state.y) || 0.42,
    Number(state.z) || 0
  );
  ballVelocity.set(Number(state.vx) || 0, 0, Number(state.vz) || 0);
  ballVerticalVelocity = Number(state.vy) || 0;
  ballShotCharge = Number(state.charge) || 0;
  ballControlled = false;
  ballOwner = null;
}

function applyNetworkKickRequest(kick = {}) {
  if (!usesNetworkBallAuthority() || !isOnlineHost() || !ball || !ballVelocity) return;
  const actor = multiplayerActors.find((unit) => unit.userData.playerId === kick.playerId);
  if (!actor?.visible || actor.position.distanceTo(ball.position) > 3.65) return;
  const chargeRatio = THREE.MathUtils.clamp(Number(kick.chargeRatio) || 0, 0, 1);
  const power = THREE.MathUtils.clamp(Number(kick.power) || 0, 0, 52);
  const dir = new THREE.Vector3(Number(kick.dir?.x) || 0, 0, Number(kick.dir?.z) || 0);
  if (dir.lengthSq() < 0.001) dir.copy(ball.position).sub(actor.position).setY(0);
  if (dir.lengthSq() < 0.001) return;
  dir.normalize();
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
  player.position.copy(getLocalMultiplayerStartPosition());
  playerAngle = getInitialPlayerAngle();
  player.rotation.y = playerAngle;
  playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
}

function applyNetworkScore(payload = {}) {
  if (!multiplayerMode || !payload.scores) return;
  const host = isOnlineHost();
  redScore = Number(payload.scores.red) || 0;
  blueScore = Number(payload.scores.blue) || 0;
  scoreEl.textContent = `Rojo ${redScore} - ${blueScore} Azul`;
  updateStadiumScoreboard();
  if (host) return;

  const scoringTeam = payload.scoringTeam;
  if (!soundMuted) {
    setupAudio();
    goalSound.currentTime = 0;
    safePlay(goalSound);
  }
  goalBanner.textContent = scoringTeam === "blue" ? "GOOOL DE AZUL" : "GOOOL DE ROJO";
  goalBanner.classList.remove("show");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
  momentEl.textContent = `${scoringTeam === "blue" ? "Azul" : "Rojo"} mete gol y el estadio entiende todo`;
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0;
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

  ["red", "blue"].forEach((team) => {
    const teamPlayers = activeRoom.players.filter((roomPlayer) => roomPlayer.team === team);
    teamPlayers.forEach((roomPlayer, index) => {
      if (roomPlayer.id === getLocalPlayerId()) return;
      const actor = createPlayer(false, team);
      actor.position.copy(getTeamStartPosition(team, index, teamPlayers.length));
      actor.rotation.y = team === "red" ? 0 : Math.PI;
      actor.userData.name = roomPlayer.name;
      actor.userData.playerId = roomPlayer.id;
      actor.userData.team = team;
      actor.userData.isLocal = false;
      if (roomPlayer.state) {
        actor.position.set(roomPlayer.state.x, roomPlayer.state.y || 0, roomPlayer.state.z);
        actor.rotation.y = roomPlayer.state.angle || actor.rotation.y;
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

  addField();

  const localRoomPlayer = getLocalRoomPlayer();
  player = createPlayer(true, multiplayerMode ? localRoomPlayer.team : "neutral");
  player.userData.name = multiplayerMode ? localRoomPlayer.name : "Payne";
  player.userData.team = multiplayerMode ? localRoomPlayer.team : "red";
  player.userData.isLocal = true;
  player.position.copy(getLocalMultiplayerStartPosition());
  scene.add(player);
  addMultiplayerActors();

  ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 16),
    new THREE.MeshStandardMaterial({ map: createBallTexture(), roughness: 0.42 })
  );
  ball.position.set(0, 0.42, multiplayerMode ? 0 : -29.6);
  scene.add(ball);

  kickArrow = createKickArrow();
  scene.add(kickArrow);

  if (multiplayerMode) {
    goalKeeper = null;
    keeperState = null;
  } else {
    goalKeeper = createPlayer(false);
    goalKeeper.scale.set(0.95, 0.95, 0.95);
    goalKeeper.position.set(0, 0, field.length / 2 - 4.5);
    scene.add(goalKeeper);
    keeperState = {
      mode: "ready",
      targetX: 0,
      targetZ: field.length / 2 - 4.5,
      diveTimer: 0,
      diveSide: 1,
    };
  }

  opponents = [];

  score = 0;
  redScore = 0;
  blueScore = 0;
  remaining = multiplayerMode ? (Number(roomTimeInput?.value) || 3) * 60 : Infinity;
  ballVelocity = new THREE.Vector3();
  ballVerticalVelocity = 0;
  ballShotCharge = 0;
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
    ? (roomProModeToggle ? roomProModeToggle.checked : true)
    : (proModeToggle ? proModeToggle.checked : true);
  ballTrails.forEach((puff) => scene.remove(puff));
  ballTrails = [];
  goalCooldown = 0;
  ended = false;
  cameraMode = "third";
  phraseTimer = 0;
  scoreEl.textContent = multiplayerMode ? "Rojo 0 - 0 Azul" : "0";
  updateStadiumScoreboard();
  updateTimer();
  momentEl.textContent = multiplayerMode ? "Multijugador local: sin arquero PC" : "Modo entrenamiento";
  if (roomGameBtn) roomGameBtn.style.display = multiplayerMode ? "block" : "none";
  setupPlayerTags();
  updateChargeMeter(0);
  animateGame();
}

function updateTimer() {
  if (!multiplayerMode) {
    timerEl.textContent = "Entrenamiento";
    return;
  }
  const total = Math.max(0, Math.ceil(remaining));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
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

function ballDirectionFromPayne() {
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

function predictGoalLineX(dir) {
  const goalZ = field.length / 2 - 0.42;
  if (Math.abs(dir.z) < 0.001) return ball.position.x;
  const t = (goalZ - ball.position.z) / dir.z;
  return ball.position.x + dir.x * t;
}

function prepareKeeperForShot(dir, chargeRatio) {
  if (!keeperState || dir.z <= 0.16) return;
  const predictedX = predictGoalLineX(dir);
  if (predictedX < -6.3 || predictedX > 6.3) return;

  const saveChance = 0.5 * (1 - THREE.MathUtils.clamp(chargeRatio, 0, 1));
  const commitsCorrectly = Math.random() < saveChance;
  const chosenX = commitsCorrectly
    ? predictedX
    : predictedX + (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 2.7);

  keeperState.mode = "dive";
  keeperState.targetX = THREE.MathUtils.clamp(chosenX, -5.4, 5.4);
  keeperState.targetZ = field.length / 2 - 4.15;
  keeperState.diveTimer = 1.05;
  keeperState.diveSide = keeperState.targetX >= goalKeeper.position.x ? 1 : -1;
}

function kickBall(power, label, chargeRatio = 0, liftPower = 0, soundKind = "shot") {
  if (!player || !player.visible || !ball || goalCooldown > 0) return;
  const distance = player.position.distanceTo(ball.position);
  if (distance > 3.2) {
    momentEl.textContent = "Payne mira la pelota: todavia no llega";
    return;
  }

  const dir = ballDirectionFromPayne();
  playKickSound(soundKind, chargeRatio);
  ballControlled = false;
  ballOwner = null;
  ballMagnetCooldown = 0.58 + chargeRatio * 0.22;
  if (usesNetworkBallAuthority() && !isOnlineHost()) {
    socket.emit("ball:kick", {
      power,
      chargeRatio,
      liftPower,
      soundKind,
      dir: { x: dir.x, z: dir.z },
    });
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
  const chargeSeconds = THREE.MathUtils.clamp(heldSeconds, 0, 0.8);
  const chargeRatio = heldSeconds < 0.1 ? 0 : chargeSeconds / 0.8;
  const power = 27.75 * (1 + chargeRatio * 0.8);
  const liftPower = 2.2 + chargeRatio * 5.0;
  const percent = Math.round(chargeRatio * 80);
  const label = chargeRatio === 0
    ? "Payne remata fuerte hacia su eje"
    : `Payne carga el remate: +${percent}%`;
  kickBall(power, label, chargeRatio, liftPower, "shot");
}

function celebrateGoal(scoringTeam = "payne") {
  if (!soundMuted) {
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
    goalBanner.textContent = "GOOOOOOL DE PAYNE";
  }
  updateStadiumScoreboard();
  goalBanner.classList.remove("show");
  void goalBanner.offsetWidth;
  goalBanner.classList.add("show");
  momentEl.textContent = multiplayerMode
    ? `${scoringTeam === "red" ? "Rojo" : "Azul"} mete gol y el estadio entiende todo`
    : "GOOOL. Esta vez la fisica tambien eligio a Payne";
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
      ballVerticalVelocity = 0;
      ballShotCharge = 0;
      ballControlled = false;
      ballOwner = null;
      ballMagnetCooldown = 0;
      momentEl.textContent = multiplayerMode ? "Saque desde el centro" : "Saca Payne desde el centro";
    }
  }, 950);
}

function updateGoalkeeper(dt) {
  if (!goalKeeper || !keeperState) return;

  const baseZ = field.length / 2 - 4.5;
  if (keeperState.mode === "dive") {
    keeperState.diveTimer -= dt;
    goalKeeper.position.x = THREE.MathUtils.lerp(goalKeeper.position.x, keeperState.targetX, 1 - Math.pow(0.006, dt));
    goalKeeper.position.z = THREE.MathUtils.lerp(goalKeeper.position.z, keeperState.targetZ, 1 - Math.pow(0.01, dt));
    goalKeeper.rotation.z = THREE.MathUtils.lerp(goalKeeper.rotation.z, -keeperState.diveSide * 1.24, 1 - Math.pow(0.006, dt));
    goalKeeper.position.y = Math.max(0, Math.sin((1.05 - keeperState.diveTimer) * Math.PI) * 0.5);

    if (goalKeeper.userData.limbs) {
      goalKeeper.userData.limbs.arms.forEach((arm) => {
        arm.rotation.x = -1.35;
        arm.rotation.z = arm.userData.side * 0.62;
      });
    }

    if (keeperState.diveTimer <= 0) {
      keeperState.mode = "recover";
      keeperState.diveTimer = 0.85;
    }
    return;
  }

  if (keeperState.mode === "recover") {
    keeperState.diveTimer -= dt;
    goalKeeper.rotation.z = THREE.MathUtils.lerp(goalKeeper.rotation.z, 0, 1 - Math.pow(0.004, dt));
    goalKeeper.position.y = THREE.MathUtils.lerp(goalKeeper.position.y, 0, 0.16);
    if (keeperState.diveTimer <= 0) keeperState.mode = "ready";
  }

  if (keeperState.mode === "ready") {
    const trackX = THREE.MathUtils.clamp(ball.position.x, -4.8, 4.8);
    goalKeeper.position.x = THREE.MathUtils.lerp(goalKeeper.position.x, trackX, 1 - Math.pow(0.02, dt));
    goalKeeper.position.z = THREE.MathUtils.lerp(goalKeeper.position.z, baseZ, 0.08);
    goalKeeper.position.y = THREE.MathUtils.lerp(goalKeeper.position.y, 0, 0.18);
    goalKeeper.rotation.z = THREE.MathUtils.lerp(goalKeeper.rotation.z, 0, 0.14);
    animatePlayerRun(goalKeeper, dt, Math.abs(trackX - goalKeeper.position.x) > 0.02);
  }
}

function handleKeeperBallCollision(previousBallPosition) {
  if (!goalKeeper || !ball || goalCooldown > 0) return false;
  const keeperRadius = keeperState?.mode === "dive" ? 1.65 : 1.05;
  const keeperCenter = goalKeeper.position.clone().add(new THREE.Vector3(0, 1.2, 0));
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
  if (!verticalOk || horizontal.length() > keeperRadius + 0.42) return false;

  const normal = horizontal.lengthSq() > 0.001 ? horizontal.normalize() : new THREE.Vector3(0, 0, -1);
  const incomingSpeed = Math.max(ballVelocity.length(), 9);
  ball.position.copy(impactPoint).addScaledVector(normal, keeperRadius + 0.62);
  ball.position.y = Math.max(impactPoint.y, 0.62);
  ballVelocity.copy(normal.multiplyScalar(incomingSpeed * 0.82));
  ballVelocity.z = Math.min(ballVelocity.z, -Math.abs(ballVelocity.z) - 2.5);
  ballVerticalVelocity = Math.max(ballVerticalVelocity * 0.25, 1.2);
  ballShotCharge = Math.max(ballShotCharge, 0.35);
  ballControlled = false;
  momentEl.textContent = "El arquero mete las manos y la pelota rebota";
  return true;
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
  target.y = 0.42;
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
    celebrateGoal(multiplayerMode ? "red" : "payne");
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

  if (usesNetworkBallAuthority() && !isOnlineHost()) {
    ball.rotation.x += ballVelocity.z * dt * 2.4;
    ball.rotation.z -= ballVelocity.x * dt * 2.4;
    ball.rotation.y += ballVelocity.length() * dt * 0.8;
    return;
  }

  const ballRadius = 0.42;
  const minX = -field.width / 2 + ballRadius;
  const maxX = field.width / 2 - ballRadius;
  const minZ = -field.length / 2 + ballRadius;
  const maxZ = field.length / 2 - ballRadius;
  const playerRadius = 0.82;
  const toBall = ball.position.clone().sub(player.position);
  toBall.y = 0;
  const distance = toBall.length();
  const minDistance = playerRadius + ballRadius;
  const candidateOwner = !proModeEnabled && ballMagnetCooldown <= 0 && ballVelocity.length() < 18
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
  if (ball.position.y <= 0.42) {
    ball.position.y = 0.42;
    ballVerticalVelocity = 0;
  }

  applyBallBodyCollisions();
  handleKeeperBallCollision(previousBallPosition);

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

function updateKickArrow() {
  if (!kickArrow || !player || !ball || goalCooldown > 0) return;
  const dir = ballDirectionFromPayne();
  const distance = player.position.distanceTo(ball.position);
  const inRange = distance <= 3.2;
  kickArrow.visible = inRange;
  if (!inRange) return;

  kickArrow.position.set(ball.position.x, 0.045, ball.position.z);
  kickArrow.rotation.y = Math.atan2(dir.x, dir.z);
  const scale = THREE.MathUtils.clamp(distance / 2.1, 0.72, 1.28);
  kickArrow.scale.set(scale, scale, scale);
}

function updateChargeMeter(dt) {
  if (!chargeMeter || !chargeFill || !chargeText || !player || !camera) return;

  if (spaceChargeStart !== null) {
    const heldSeconds = (performance.now() - spaceChargeStart) / 1000;
    chargeMeterRatio = heldSeconds < 0.1 ? 0 : THREE.MathUtils.clamp(heldSeconds, 0, 0.8) / 0.8;
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

function updatePlayer(dt) {
  if (!player.visible) return;
  if (cameraMode === "broadcast") {
    const screenDir = new THREE.Vector3();
    if (keys.has("KeyW") || keys.has("ArrowUp")) screenDir.x += 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) screenDir.x -= 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) screenDir.z -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) screenDir.z += 1;
    if (screenDir.lengthSq() > 0) {
      screenDir.normalize();
      const sprintMultiplier = keys.has("ShiftLeft") ? 1.35 : 1;
      player.position.addScaledVector(screenDir, 10.5 * sprintMultiplier * dt);
      player.position.x = THREE.MathUtils.clamp(player.position.x, -field.width / 2 + 2, field.width / 2 - 2);
      player.position.z = THREE.MathUtils.clamp(player.position.z, -field.length / 2 + 1.1, field.length / 2 - 1.1);
      playerAngle = Math.atan2(screenDir.x, screenDir.z);
      playerMoveDir.copy(screenDir);
      player.position.y = Math.abs(Math.sin(performance.now() * 0.014)) * 0.08;
      player.rotation.y = playerAngle;
      animatePlayerRun(player, dt, true);
    } else {
      playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
      player.position.y = THREE.MathUtils.lerp(player.position.y, 0, 0.18);
      player.rotation.y = playerAngle;
      animatePlayerRun(player, dt, false);
    }
    resolvePlayerActorCollisions();
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
    const sprintMultiplier = keys.has("ShiftLeft") ? 1.35 : 1;
    player.position.addScaledVector(forward, throttle * 10.5 * sprintMultiplier * dt);
    playerMoveDir.copy(forward).multiplyScalar(throttle).normalize();
    player.position.x = THREE.MathUtils.clamp(player.position.x, -field.width / 2 + 2, field.width / 2 - 2);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -field.length / 2 + 1.1, field.length / 2 - 1.1);
    player.position.y = Math.abs(Math.sin(performance.now() * 0.014)) * 0.08;
  } else {
    playerMoveDir.set(Math.sin(playerAngle), 0, Math.cos(playerAngle));
    player.position.y = THREE.MathUtils.lerp(player.position.y, 0, 0.18);
  }

  player.rotation.y = playerAngle;
  resolvePlayerActorCollisions();
  animatePlayerRun(player, dt, isMoving || isTurning);
}

function updateCamera(dt) {
  if (cameraMode === "broadcast") {
    if (camera.fov !== 58) {
      camera.fov = 58;
      camera.updateProjectionMatrix();
    }
    const focusZ = THREE.MathUtils.clamp(ball.position.z, -field.length / 2 + 14, field.length / 2 - 14);
    const desired = new THREE.Vector3(-field.width / 2 - 13, 17, focusZ);
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

  if (multiplayerMode) remaining -= dt;
  updateTimer();
  phraseTimer -= dt;
  if (phraseTimer <= 0) {
    momentEl.textContent = lines[Math.floor(Math.random() * lines.length)];
    phraseTimer = 4 + Math.random() * 2;
  }

  updatePlayer(dt);
  updateBall(dt);
  updateBallTrails(dt);
  updateKickArrow();
  updateGoalkeeper(dt);
  updateCamera(dt);
  updateChargeMeter(dt);
  updatePlayerTags();
  emitLocalPlayerState();
  emitBallState();

  renderer.render(scene, camera);

  if (multiplayerMode && remaining <= 0 && !ended) {
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

function finishMatch() {
  keys.clear();
  clearPlayerTags();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  stopGameAudio();
  if (multiplayerMode) {
    showMultiplayerFinalBanner();
    multiplayerMode = false;
    roomOverlayOpen = false;
    roomScreen.classList.remove("is-overlay");
    setTimeout(() => {
      goalBanner.classList.remove("show", "final-result");
      renderRoom();
      showScreen(roomScreen);
    }, 2000);
    return;
  }
  startCelebration();
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
        socket.emit("room:join", {
          roomId: room.id,
          playerName: onlinePlayerName,
        }, (response) => {
          if (response?.ok) {
            activeRoom = response.room;
            selectedPlayerId = socket.id;
            renderRoom();
            showScreen(roomScreen);
          } else {
            updateServerStatus(response?.error || "No pude entrar");
          }
        });
      } else {
        openRoom(room.id);
      }
    });
    roomList.appendChild(row);
  });
}

function openRooms() {
  setupAudio();
  stopAudio(menuMusic);
  renderRoomList();
  showScreen(roomsScreen);
}

function openRoomOverlay() {
  if (!multiplayerMode || !activeRoom) return;
  keys.clear();
  roomOverlayOpen = true;
  renderRoom();
  roomScreen.classList.add("is-active", "is-overlay");
}

function closeRoomOverlay() {
  if (!roomOverlayOpen) return;
  roomOverlayOpen = false;
  roomScreen.classList.remove("is-active", "is-overlay");
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
      selectedPlayerId = socket.id;
      renderRoom();
      showScreen(roomScreen);
    });
    return;
  }

  const maxPlayers = THREE.MathUtils.clamp(Number(roomMaxInput.value) || 12, 2, 16);
  const room = {
    id: `room-${Date.now()}`,
    name: (roomNameInput.value || "payne's room").trim().slice(0, 22),
    ping: 22 + Math.floor(Math.random() * 34),
    maxPlayers,
    players: [
      { id: "local-host", name: "davo", team: "spectators", score: 0 },
    ],
  };
  multiplayerRooms = [room, ...multiplayerRooms];
  openRoom(room.id);
}

function openRoom(roomId) {
  activeRoom = multiplayerRooms.find((room) => room.id === roomId) || multiplayerRooms[0];
  if (!onlineMode && activeRoom && !activeRoom.players.some((roomPlayer) => roomPlayer.id === "local-host")) {
    activeRoom.players.push({ id: "local-host", name: "davo", team: "spectators", score: 0 });
  }
  selectedPlayerId = activeRoom?.players[0]?.id || null;
  roomLocked = false;
  renderRoom();
  showScreen(roomScreen);
}

function renderPlayers(container, team) {
  container.innerHTML = "";
  activeRoom.players
    .filter((playerInfo) => playerInfo.team === team)
    .forEach((playerInfo) => {
      const row = document.createElement("button");
      row.className = `player-row${playerInfo.id === selectedPlayerId ? " is-selected" : ""}`;
      row.type = "button";
      row.draggable = true;
      row.dataset.playerId = playerInfo.id;
      row.innerHTML = `<span>${playerInfo.name}</span><small>${playerInfo.score}</small>`;
      row.addEventListener("click", () => {
        selectedPlayerId = playerInfo.id;
        renderRoom();
      });
      row.addEventListener("dragstart", (event) => {
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
    event.preventDefault();
    container.classList.add("is-drop-target");
  });
  container.addEventListener("dragleave", () => {
    container.classList.remove("is-drop-target");
  });
  container.addEventListener("drop", (event) => {
    event.preventDefault();
    container.classList.remove("is-drop-target");
    const playerId = event.dataTransfer.getData("text/plain") || selectedPlayerId;
    if (!playerId) return;
    selectedPlayerId = playerId;
    moveSelectedPlayer(team);
  });
}

function renderRoom() {
  if (!activeRoom) return;
  activeRoomName.textContent = activeRoom.name;
  if (activeRoom.settings) {
    roomTimeInput.value = activeRoom.settings.timeLimit || 3;
    roomScoreInput.value = activeRoom.settings.scoreLimit || 3;
    roomProModeToggle.checked = activeRoom.settings.proMode !== false;
  }
  renderPlayers(redTeamList, "red");
  renderPlayers(spectatorsList, "spectators");
  renderPlayers(blueTeamList, "blue");
  lockRoomBtn.textContent = roomLocked ? "Unlock" : "Lock";
}

function moveSelectedPlayer(team) {
  if (!activeRoom || !selectedPlayerId) return;
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
  if (!onlineMode || !socket?.connected || !activeRoom) return;
  socket.emit("room:settings", {
    timeLimit: roomTimeInput.value,
    scoreLimit: roomScoreInput.value,
    proMode: roomProModeToggle.checked,
  });
}

function startGame(options = {}) {
  setupAudio();
  if (gameFrame) cancelAnimationFrame(gameFrame);
  gameFrame = 0;
  if (celebrationFrame) cancelAnimationFrame(celebrationFrame);
  celebrationFrame = 0;
  keys.clear();
  clearPlayerTags();
  roomOverlayOpen = false;
  multiplayerMode = Boolean(options.multiplayer);
  showScreen(gameScreen);
  startStadiumAudio();
  setupGame();
  if (multiplayerMode) {
    updateTimer();
    momentEl.textContent = "Multijugador local: sin arquero PC";
  }
}

function returnToMenu() {
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

playBtn.addEventListener("click", startGame);
musicToggleBtn.addEventListener("click", toggleMute);
multiplayerBtn.addEventListener("click", openRooms);
connectServerBtn.addEventListener("click", connectOnlineServer);
againBtn.addEventListener("click", startGame);
roomGameBtn.addEventListener("click", openRoomOverlay);
backMenuBtn.addEventListener("click", returnToMenu);
roomsBackBtn.addEventListener("click", returnToMenu);
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
leaveRoomBtn.addEventListener("click", openRooms);
roomTimeInput.addEventListener("change", syncOnlineRoomSettings);
roomScoreInput.addEventListener("change", syncOnlineRoomSettings);
roomProModeToggle.addEventListener("change", syncOnlineRoomSettings);
startMultiplayerGameBtn.addEventListener("click", () => {
  if (onlineMode && socket?.connected) {
    syncOnlineRoomSettings();
    socket.emit("room:start");
    return;
  }
  startGame({ multiplayer: true });
});
closeBtn.addEventListener("click", () => {
  window.close();
  showScreen(menu);
});

window.addEventListener("keydown", (event) => {
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
  if (event.code === "ControlLeft") {
    kickBall(13.26, "Payne adelanta pelota", 0, 0, "soft");
  }
  if (event.code === "KeyE" && !event.ctrlKey) {
    kickBall(13.88, "Payne mete un golpe corto", 0, 0.8, "pass");
  }
  if (event.code === "KeyC") {
    cameraMode = cameraMode === "third" ? "broadcast" : "third";
    momentEl.textContent = cameraMode === "broadcast" ? "Camara clasica activada" : "Camara Payne activada";
  }
  if (event.code === "KeyP") {
    toggleProModeInGame();
  }
  if (event.code === "KeyM") {
    toggleMute();
  }
  if (event.code === "Space") {
    spaceChargeStart = performance.now();
  }
});

window.addEventListener("keyup", (event) => {
  const playing = gameScreen.classList.contains("is-active");
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
  if (event.code === "Space") {
    releaseChargedShot();
  }
});
window.addEventListener("resize", resize);

if (new URLSearchParams(window.location.search).has("play")) {
  startGame();
}

if (new URLSearchParams(window.location.search).has("broadcast")) {
  cameraMode = "broadcast";
}

setupAudio();
updateMusicButton();
serverUrlInput.value = new URLSearchParams(window.location.search).get("server") || socketServerUrl;
playerNameInput.value = onlinePlayerName;

const sharedRoomId = new URLSearchParams(window.location.search).get("room");
const sharedServerUrl = new URLSearchParams(window.location.search).get("server");
if (sharedServerUrl && sharedRoomId) {
  connectOnlineServer().then(() => {
    setTimeout(() => {
      if (!socket?.connected) return;
      socket.emit("room:join", {
        roomId: sharedRoomId,
        playerName: onlinePlayerName,
      }, (response) => {
        if (response?.ok) {
          activeRoom = response.room;
          selectedPlayerId = socket.id;
          renderRoom();
          showScreen(roomScreen);
        }
      });
    }, 500);
  });
} else if (sharedRoomId) {
  renderRoomList();
  openRoom(sharedRoomId);
}
