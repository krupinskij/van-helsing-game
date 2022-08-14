let rot = 0;
let posX = 500;
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
