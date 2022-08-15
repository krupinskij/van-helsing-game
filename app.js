let rot = 0;
let posX = 600;
let posY = 0;

const player = {
  rot: 0,
  posX: 0,
  posY: 600,

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
        player.posX += 10 * Math.cos(player.rot);
        player.posY += 10 * Math.sin(player.rot);
      },
    },
    ArrowDown: {
      pressed: false,
      action: () => {
        player.posX -= 10 * Math.cos(player.rot);
        player.posY -= 10 * Math.sin(player.rot);
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
    let pXL = (pXR = player.posX - 600 - +element.dataset.y);
    let pYL = (pYR = player.posY + +element.dataset.x);

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

const room = {
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

const room2 = {
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

const createRoom = room => {
  const roomElem = document.createElement('div');
  roomElem.className = 'r';
  let [x, y] = room.start;

  room.walls.forEach(([len, dir]) => {
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
        break;
      case 'S':
        x += len;
        break;
      case 'E':
        y -= len;
        break;
      case 'W':
        y += len;
        break;
    }
  });
  document.body.appendChild(roomElem);
};

createRoom(room);
createRoom(room2);
