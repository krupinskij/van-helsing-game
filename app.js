let walls = [];
let wallsH = [];
let wallsV = [];
let enemies = [];
let treats = [];

const P_X = 500;
const P_Y = 0;

const player = {
  rot: 0,
  _hp: 80,
  _s: 10,
  _a: 10,
  posX: P_X,
  posY: P_Y,

  get hp() {
    return this._hp;
  },
  set hp(_hp) {
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
        case 'H':
          player.s += 10;
          break;
        case 'F':
          player.hp += 10;
          break;
      }
      elem.parentNode.removeChild(elem);

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

  // const enemy = createEnemy('D', [200, 200], 5, 1);
  // enemies.push(enemy);
  // roomElem.appendChild(enemy.elem);

  const treat = createTreat('A', [200, 200]);
  treats.push(treat);
  roomElem.appendChild(treat.elem);

  const treat2 = createTreat('F', [400, 200]);
  treats.push(treat2);
  roomElem.appendChild(treat2.elem);

  const treat3 = createTreat('H', [600, 200]);
  treats.push(treat3);
  roomElem.appendChild(treat3.elem);
  // const enemy2 = createEnemy('D', [600, 400], 10);
  // enemies.push(enemy2);
  // roomElem.appendChild(enemy2.elem);

  // const food = document.createElement('div');
  // food.className = 't F';
  // {
  //   const dx = 600;
  //   const dy = 200;
  //   food.dataset.x = dx;
  //   food.dataset.y = dy;
  //   food.style.setProperty('--x', `${dx}px`);
  //   food.style.setProperty('--y', `${dy}px`);
  // }
  // roomElem.appendChild(food);

  // const arrows = document.createElement('div');
  // arrows.className = 't A';
  // {
  //   const dx = 200;
  //   const dy = 400;
  //   arrows.dataset.x = dx;
  //   arrows.dataset.y = dy;
  //   arrows.style.setProperty('--x', `${dx}px`);
  //   arrows.style.setProperty('--y', `${dy}px`);
  // }
  // roomElem.appendChild(arrows);

  // const holywater = document.createElement('div');
  // holywater.className = 't H';
  // {
  //   const dx = 400;
  //   const dy = 400;
  //   holywater.dataset.x = dx;
  //   holywater.dataset.y = dy;
  //   holywater.style.setProperty('--x', `${dx}px`);
  //   holywater.style.setProperty('--y', `${dy}px`);
  // }
  // roomElem.appendChild(holywater);

  document.getElementById('g').appendChild(roomElem);
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
// createRoom([space2]);
// createRoom([space3]);

wallsH = Array.from(document.querySelectorAll('.w.N, .w.S'));
wallsV = Array.from(document.querySelectorAll('.w.E, .w.W'));
walls = [...wallsH, ...wallsV];

document.addEventListener('click', () => {
  player.a--;
});
