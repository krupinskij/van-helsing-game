let walls = [];
let wallsH = [];
let wallsV = [];
let enemies = [];
let treats = [];

const P_X = 0;
const P_Y = 200;

const controller = {
  shift: {
    pressed: false,
  },
  arrowleft: {
    pressed: false,
    action: () => {
      player.rot -= 0.04;
    },
    shiftAction: () => {
      player.moveDistV(-1, Math.cos);
      player.moveDistH(1, Math.sin);
    },
  },
  arrowright: {
    pressed: false,
    action: () => (player.rot += 0.04),
    shiftAction: () => {
      player.moveDistV(1, Math.cos);
      player.moveDistH(-1, Math.sin);
    },
  },
  arrowup: {
    pressed: false,
    action: () => {
      player.moveDistV(1, Math.sin);
      player.moveDistH(1, Math.cos);
    },
  },
  arrowdown: {
    pressed: false,
    action: () => {
      player.moveDistV(-1, Math.sin);
      player.moveDistH(-1, Math.cos);
    },
  },
};
controller.a = { ...controller.arrowleft };
controller.d = { ...controller.arrowright };
controller.w = { ...controller.arrowup };
controller.s = { ...controller.arrowdown };

const player = {
  rot: 0,
  _hp: 100,
  _s: 10,
  _a: 20,
  posX: P_X,
  posY: P_Y,

  get hp() {
    return this._hp;
  },
  set hp(_hp) {
    if (_hp <= 0) alert('You are dead!');
    this._hp = Math.min(100, _hp);
    document.getElementById('h').style.setProperty('--w', `${this._hp}%`);
  },

  get s() {
    return this._s;
  },
  set s(_s) {
    document.getElementById('s').innerText = _s;
    this._s = _s;
  },

  get a() {
    return this._a;
  },
  set a(_a) {
    if (_a < 0) return;
    document.getElementById('a').innerText = _a;
    this._a = _a;
  },

  moveDistH: (t, tg) => {
    const dist = t * 10 * tg(player.rot);
    for (let i = 0; i < wallsH.length; i++) {
      const wall = wallsH[i];

      const pY = player.posY - 600;
      if (Math.abs(pY - +wall.dataset.y + dist) > 50) continue;

      const isS = wall.classList.contains('S');
      const isD = wall.classList.contains('D') && !wall.classList.contains('C');
      const pX = (player.posX + +wall.dataset.x) * (isS ? -1 : 1);

      if (pX > -50 && +wall.dataset.w - pX > -50) {
        if (isD) {
          player.posX = +wall.dataset.px;
          player.posY = +wall.dataset.py;
          createRoom(rooms[+wall.dataset.r]);
        }
        return;
      }
    }

    player.posY += dist;
  },
  moveDistV: (t, tg) => {
    const dist = t * 10 * tg(player.rot);
    for (let i = 0; i < wallsV.length; i++) {
      const wall = wallsV[i];

      if (Math.abs(player.posX + +wall.dataset.x + dist) > 50) continue;

      const isE = wall.classList.contains('E');
      const isD = wall.classList.contains('D') && !wall.classList.contains('C');
      const pY = (player.posY - 600 - +wall.dataset.y) * (isE ? -1 : 1);

      if (pY > -50 && +wall.dataset.w - pY > -50) {
        if (isD) {
          player.posX = +wall.dataset.px;
          player.posY = +wall.dataset.py;
          createRoom(rooms[+wall.dataset.r]);
        }
        return;
      }
    }

    player.posX += dist;
  },
};

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'escape') resetGame();
  if (controller[key]) {
    controller[key].pressed = true;
  }
});

document.addEventListener('keyup', event => {
  const key = event.key.toLowerCase();
  if (controller[key]) {
    controller[key].pressed = false;
  }
});

const executeMoves = () => {
  Object.keys(controller).forEach(key => {
    controller[key].pressed &&
      ((controller['shift'].pressed && controller[key].shiftAction) || controller[key].action)?.();
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

const executeEnemyMoves = () => {
  enemies.forEach(({ obj, elem }) => {
    elem.style.setProperty('--x', `${obj.x}px`);
    elem.style.setProperty('--y', `${obj.y}px`);
  });
};

const getTreat = () => {
  treats = treats.filter(({ obj, elem }) => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) < 50 && Math.abs(distY) < 50) {
      switch (obj.t) {
        case 'A':
          player.a += 10;
          break;
        case 'F':
          if (player.hp >= 100) return true;
          player.hp += 10;
          break;
      }
      obj.g = true;
      elem.parentNode.removeChild(elem);
      playSound(treatSound);

      return false;
    }
    return true;
  });
};

const animate = () => {
  executeMoves();
  calculateShadow();
  executeEnemyMoves();
  getTreat();
  window.requestAnimationFrame(animate);
};
window.requestAnimationFrame(animate);

const createRoom = room => {
  document.getElementById('g').innerHTML = '';
  walls = [];
  wallsH = [];
  wallsV = [];
  treats = [];
  enemies = enemies.filter(enemy => {
    enemy.obj.stop();
    return false;
  });
  const roomElem = document.createElement('div');
  roomElem.className = 'r';

  let mh = (mw = mx = my = -Infinity);
  let [x, y] = room.start || [2.5, 2.5];

  let h = (w = 0);
  room.walls.forEach(([len, dir, ...d]) => {
    const wallElem = document.createElement('div');
    wallElem.className = 'w ' + dir + (d[0] || '') + (room.f ? ' F' : '');
    wallElem.dataset.x = x * 200;
    wallElem.dataset.y = y * 200;
    wallElem.dataset.w = len * 200;
    if (d.length === 4) {
      wallElem.dataset.r = d[1];
      wallElem.dataset.px = d[2];
      wallElem.dataset.py = d[3];
    }

    wallElem.style.width = `${len * 200}px`;
    wallElem.style.setProperty('--x', `${x * 200}px`);
    wallElem.style.setProperty('--y', `${y * 200}px`);
    roomElem.appendChild(wallElem);

    switch (dir) {
      case 'N':
        x -= len;
        w += len;
        wallsH.push(wallElem);
        break;
      case 'S':
        x += len;
        wallsH.push(wallElem);
        break;
      case 'E':
        y -= len;
        h += len;
        wallsV.push(wallElem);
        break;
      case 'W':
        y += len;
        wallsV.push(wallElem);
        break;
    }

    mx = Math.max(mx, x);
    my = Math.max(my, y);
  });
  mh = Math.max(mh, h);
  mw = Math.max(mw, w);

  walls = [...wallsH, ...wallsV];

  const floorElem = document.createElement('div');
  floorElem.className = 'f';
  floorElem.style.width = `${mw * 200}px`;
  floorElem.style.height = `${mh * 200}px`;
  floorElem.style.setProperty('--w', `${mw * 200}px`);
  floorElem.style.setProperty('--h', `${mh * 200}px`);
  floorElem.style.setProperty('--x', `${mx * 200}px`);
  floorElem.style.setProperty('--y', `${my * 200}px`);
  roomElem.appendChild(floorElem);

  room.treats?.forEach(treat => {
    if (!treat.g) {
      const cTreat = createTreat(treat);
      treats.push(cTreat);
      roomElem.appendChild(cTreat.elem);
    }
  });
  room.enemies?.forEach(enemy => {
    if (enemy.hp > 0) {
      const cEnemy = createEnemy(enemy);
      enemies.push(cEnemy);
      roomElem.appendChild(cEnemy.elem);
    }
  });

  document.getElementById('g').appendChild(roomElem);
};

createRoom(rooms[0]);

document.addEventListener('click', () => {
  if (player.a <= 0) return;
  player.a--;
  playSound(arrowSound);
});

const resetGame = () => {
  rooms = JSON.parse(roomsBU);
  player.s = 10;
  player.hp = 100;
  player.a = 20;
  player.rot = 0;
  player.posX = P_X;
  player.posY = P_Y;
  createRoom(rooms[0]);
};
