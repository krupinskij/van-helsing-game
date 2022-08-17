let walls = [];
let wallsH = [];
let wallsV = [];

const P_X = 0;
const P_Y = 200;

const moveDistH = dist => {
  for (let i = 0; i < wallsH.length; i++) {
    const wall = wallsH[i];

    const pY = player.posY - 600;
    if (Math.abs(pY - +wall.dataset.y + dist) > 50) continue;

    const isS = wall.dataset.d === 'S';
    const pX = (player.posX + +wall.dataset.x) * (isS ? -1 : 1);
    if (pX > -50 && +wall.dataset.w - pX > -50) return 0;
  }

  return dist;
};

const moveDistV = dist => {
  for (let i = 0; i < wallsV.length; i++) {
    const wall = wallsV[i];

    if (Math.abs(player.posX + +wall.dataset.x + dist) > 50) continue;

    const isE = wall.dataset.d === 'E';
    const pY = (player.posY - 600 - +wall.dataset.y) * (isE ? -1 : 1);
    if (pY > -50 && +wall.dataset.w - pY > -50) return 0;
  }

  return dist;
};

const player = {
  rot: 0,
  posX: P_X,
  posY: P_Y,

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
        player.posX += moveDistV(10 * Math.sin(player.rot));
        player.posY += moveDistH(10 * Math.cos(player.rot));
      },
    },
    ArrowDown: {
      pressed: false,
      action: () => {
        player.posX += moveDistV(-10 * Math.sin(player.rot));
        player.posY += moveDistH(-10 * Math.cos(player.rot));
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
  const walls = document.querySelectorAll('.w');
  walls.forEach(element => {
    let pXL = (pYR = player.posX + +element.dataset.x);
    let pYL = (pXR = player.posY - 600 - +element.dataset.y);

    switch (element.dataset.d) {
      case 'N':
        pYR -= +element.dataset.w;
        break;
      case 'S':
        pYR += +element.dataset.w;
        break;
      case 'E':
        pXR += +element.dataset.w;
        break;
      case 'W':
        pXR -= +element.dataset.w;
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

  let mh = -Infinity,
    mw = -Infinity,
    mx = -Infinity,
    my = -Infinity;
  spaces.forEach(space => {
    let [x, y] = space.start;

    let h = 0,
      w = 0;
    space.walls.forEach(([len, dir]) => {
      const wallElem = document.createElement('div');
      wallElem.className = 'w';
      wallElem.dataset.d = dir;
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
  document.body.appendChild(roomElem);
};

const space = {
  start: [2, 1],
  walls: [
    [2, 'N'],
    [2, 'W'],
    [1, 'N'],
    [2, 'E'],
    [2, 'N'],
    [3, 'E'],
    [3, 'N'],
    [3, 'E'],
    [8, 'S'],
    [2, 'W'],
    [1, 'S'],
    [1, 'W'],
    [1, 'N'],
    [3, 'W'],
  ],
};

const space2 = {
  start: [0, -4],
  walls: [
    [3, 'N'],
    [1, 'W'],
    [1, 'S'],
    [1, 'W'],
    [1, 'S'],
    [1, 'E'],
    [1, 'S'],
    [1, 'E'],
  ],
};

createRoom([space, space2]);

const space3 = {
  start: [-4, 4],
  walls: [
    [3, 'N'],
    [1, 'W'],
    [1, 'S'],
    [1, 'W'],
    [1, 'S'],
    [1, 'E'],
    [1, 'S'],
    [1, 'E'],
  ],
};

createRoom([space3]);

walls = Array.from(document.querySelectorAll('.w'));
wallsH = walls.filter(wall => wall.dataset.d === 'N' || wall.dataset.d === 'S');
wallsV = walls.filter(wall => wall.dataset.d === 'E' || wall.dataset.d === 'W');
