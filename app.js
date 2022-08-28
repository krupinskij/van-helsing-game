let walls = [];
let wallsH = [];
let wallsV = [];
let enemies = [];
let withShadow = [];

const P_X = 500;
const P_Y = 0;

const player = {
  rot: 0,
  posX: P_X,
  posY: P_Y,

  moveDistH: t => {
    const dist = t * 10 * Math.cos(player.rot);
    for (let i = 0; i < wallsH.length; i++) {
      const wall = wallsH[i];

      const pY = player.posY - 600;
      if (Math.abs(pY - +wall.dataset.y + dist) > 50) continue;

      const isS = wall.classList.contains('S');
      const isD = wall.classList.contains('D');
      const pX = (player.posX + +wall.dataset.x) * (isS ? -1 : 1);
      if (pX > -50 && +wall.dataset.w - pX > -50 && !isD) return;
    }

    player.posY += dist;
  },
  moveDistV: t => {
    const dist = t * 10 * Math.sin(player.rot);
    for (let i = 0; i < wallsV.length; i++) {
      const wall = wallsV[i];

      if (Math.abs(player.posX + +wall.dataset.x + dist) > 50) continue;

      const isE = wall.classList.contains('E');
      const isD = wall.classList.contains('D');
      const pY = (player.posY - 600 - +wall.dataset.y) * (isE ? -1 : 1);
      if (pY > -50 && +wall.dataset.w - pY > -50 && !isD) return;
    }

    player.posX += dist;
  },

  controller: {
    ArrowLeft: {
      pressed: false,
      action: () => (player.rot -= 0.04),
    },
    ArrowRight: {
      pressed: false,
      action: () => (player.rot += 0.04),
    },
    ArrowUp: {
      pressed: false,
      action: () => {
        player.moveDistV(1);
        player.moveDistH(1);
      },
    },
    ArrowDown: {
      pressed: false,
      action: () => {
        player.moveDistV(-1);
        player.moveDistH(-1);
      },
    },
  },
};

document.addEventListener('keydown', event => {
  if (player.controller[event.key]) {
    player.controller[event.key].pressed = true;
  }
});

document.addEventListener('keyup', event => {
  if (player.controller[event.key]) {
    player.controller[event.key].pressed = false;
  }
});

const executeMoves = () => {
  Object.keys(player.controller).forEach(key => {
    player.controller[key].pressed && player.controller[key].action();
  });
  document.documentElement.style.setProperty('--rot', `${player.rot}rad`);
  document.documentElement.style.setProperty('--posX', `${player.posX}px`);
  document.documentElement.style.setProperty('--posY', `${player.posY}px`);
};

const calculateShadow = () => {
  walls.forEach(element => {
    let pXL = (pYR = player.posX + +element.dataset.x);
    let pYL = (pXR = player.posY - 600 - +element.dataset.y);
    const w = +element.dataset.w;
    switch (element.classList[1]) {
      case 'N':
        pYR -= w;
        break;
      case 'S':
        pYR += w;
        break;
      case 'E':
        pXR += w;
        break;
      case 'W':
        pXR -= w;
        break;
    }
    const alphaL = Math.min(1, Math.sqrt(pXL * pXL + pYL * pYL) / 1500);
    const alphaR = Math.min(1, Math.sqrt(pXR * pXR + pYR * pYR) / 1500);
    element.style.setProperty('--sAL', alphaR);
    element.style.setProperty('--sAR', alphaL);
  });
};

const animate = () => {
  executeMoves();
  calculateShadow();
  window.requestAnimationFrame(animate);
};
window.requestAnimationFrame(animate);

const createRoom = spaces => {
  const roomElem = document.createElement('div');
  roomElem.className = 'r';

  let mh = (mw = mx = my = -Infinity);
  spaces.forEach(space => {
    let [x, y] = space.start;

    let h = (w = 0);
    space.walls.forEach(([len, dir, d = '']) => {
      const wallElem = document.createElement('div');
      wallElem.className = 'w ' + dir + d;
      wallElem.dataset.x = x * 200;
      wallElem.dataset.y = y * 200;
      wallElem.dataset.w = len * 200;

      wallElem.style.width = `${len * 200}px`;
      wallElem.style.setProperty('--x', `${x * 200}px`);
      wallElem.style.setProperty('--y', `${y * 200}px`);
      roomElem.appendChild(wallElem);

      switch (dir) {
        case 'N':
          x -= len;
          w += len;
          break;
        case 'S':
          x += len;
          break;
        case 'E':
          y -= len;
          h += len;
          break;
        case 'W':
          y += len;
          break;
      }

      mx = Math.max(mx, x);
      my = Math.max(my, y);
    });
    mh = Math.max(mh, h);
    mw = Math.max(mw, w);
  });
  const floorElem = document.createElement('div');
  floorElem.className = 'f';
  floorElem.style.width = `${mw * 200}px`;
  floorElem.style.height = `${mh * 200}px`;
  floorElem.style.setProperty('--w', `${mw * 200}px`);
  floorElem.style.setProperty('--h', `${mh * 200}px`);
  floorElem.style.setProperty('--x', `${mx * 200}px`);
  floorElem.style.setProperty('--y', `${my * 200}px`);
  roomElem.appendChild(floorElem);

  const dwergi = document.createElement('div');
  dwergi.className = 'e D';
  const dx = 200;
  const dy = 200;
  dwergi.dataset.x = dx;
  dwergi.dataset.y = dy;
  dwergi.style.setProperty('--x', `${dx}px`);
  dwergi.style.setProperty('--y', `${dy}px`);
  roomElem.appendChild(dwergi);

  const bride = document.createElement('div');
  bride.className = 'e B';
  bride.dataset.x = 0 * 200;
  bride.dataset.y = 1 * 200;
  bride.style.setProperty('--x', `0px`);
  bride.style.setProperty('--y', `200px`);
  roomElem.appendChild(bride);

  document.body.appendChild(roomElem);
};

const space = {
  start: [0, 0],
  walls: [
    [2, 'N'],
    [1, 'N', ' D'],
    [2, 'N'],
    [5, 'E'],
    [5, 'S'],
    [5, 'W'],
  ],
  enemies: ['D'],
};

const space2 = {
  start: [0, 5],
  walls: [
    [2, 'N'],
    [1, 'E'],
    [1, 'N'],
    [1, 'W'],
    [2, 'N'],
    [2, 'E'],
    [1, 'E', ' D'],
    [2, 'E'],
    [2, 'S'],
    [1, 'S', ' D'],
    [2, 'S'],
    [5, 'W'],
  ],
};

const space3 = {
  start: [-5, 5],
  walls: [
    [5, 'N'],
    [5, 'E'],
    [5, 'S'],
    [2, 'W'],
    [1, 'W', ' D'],
    [2, 'W'],
  ],
};

createRoom([space]);
createRoom([space2]);
createRoom([space3]);

wallsH = Array.from(document.querySelectorAll('.w.N, .w.S'));
wallsV = Array.from(document.querySelectorAll('.w.E, .w.W'));
walls = [...wallsH, ...wallsV];
enemies = Array.from(document.querySelectorAll('.e'));
