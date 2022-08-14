let rot = 0;
let posX = 0;
let posY = 0;

const player = {
  rot: 0,
  posX: 0,
  posY: 0,

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

const animate = () => {
  executeMoves();
  window.requestAnimationFrame(animate);
};
window.requestAnimationFrame(animate);

const room = {
  start: [2, 1],
  walls: [
    [5, 'N'],
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

const createRoom = room => {
  const roomElem = document.createElement('div');
  roomElem.className = 'room';
  let [x, y] = room.start;

  room.walls.forEach(([len, dir]) => {
    const wall = document.createElement('div');
    wall.dataset.dir = dir;
    wall.style.width = `${len * 200}px`;
    wall.style.setProperty('--x', `${x * 200}px`);
    wall.style.setProperty('--y', `${y * 200}px`);
    roomElem.appendChild(wall);

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
