const calcDist = obj => {
  const distX = (Math.abs(player.posX - obj.x) - 90) / 200;
  const distY = (Math.abs(600 - player.posY - obj.y) - 90) / 200;
  return Math.max(distX * distX + distY * distY, 1);
};
const MAX_HP = {
  D: 100,
  B: 400,
  V: 1000,
};
const createEnemy = obj => {
  const elem = document.createElement('div');
  elem.className = `e ${obj.t}`;
  elem.style.setProperty('--x', `${obj.x}px`);
  elem.style.setProperty('--y', `${obj.y}px`);
  elem.style.setProperty('--hp', `${(50 * obj.hp) / MAX_HP[obj.t]}px`);

  const d = Math.random() * 3;
  elem.style.setProperty('--d', `-${d}s`);

  const moveI = setInterval(() => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) > 80) obj.x += obj.speed * (distX > 0 ? 1 : -1);
    if (Math.abs(distY) > 80) obj.y += obj.speed * (distY > 0 ? 1 : -1);
  }, 100);

  let shotI;
  const shotT = setTimeout(() => {
    player.hp -= 10;
    shotI = setInterval(() => {
      const dist = calcDist(obj);
      const { x: ax, y: ay } = obj;
      const { posX: bx, posY: by } = player;
      setTimeout(() => {
        const { posX: cx, posY: cy } = player;
        const dx = ax - cx;
        const dy = ay - cy;
        const ex = bx - cx;
        const ey = by - cy;
        const fx = bx - ax;
        const fy = by - ay;
        const d =
          dx * fx >= 0 && dy * fy >= 0
            ? 0
            : Math.min(1 / Math.abs(dx * ey - ex * dy) / (fx * fx + fy * fy), 100) * obj.strength;
        player.hp -= d / player.s;
      }, dist * 100);
    }, 3000);
  }, 3000 - d * 1000);

  elem.addEventListener('click', () => {
    const dist = Math.max(calcDist(obj), 1);
    obj.hp -= player.s / dist;
    elem.style.setProperty('--hp', `${(50 * obj.hp) / MAX_HP[obj.t]}px`);
    if (obj.hp <= 0) {
      obj.stop();
      elem.parentNode.removeChild(elem);
    }
  });

  obj.stop = () => {
    clearInterval(shotT);
    clearInterval(shotI);
    clearInterval(moveI);
  };

  return { elem, obj };
};
