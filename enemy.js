const calcDist = obj => {
  const distX = (Math.abs(player.posX - obj.x) - 90) / 200;
  const distY = (Math.abs(600 - player.posY - obj.y) - 90) / 200;
  return Math.max(distX * distX + distY * distY, 1);
};
const createEnemy = (t, [x, y], speed, strength) => {
  const obj = { x, y, h: 100 };
  const elem = document.createElement('div');
  elem.className = `e ${t}`;
  elem.style.setProperty('--x', `${x}px`);
  elem.style.setProperty('--y', `${y}px`);
  elem.style.setProperty('--hp', `50px`);

  const d = Math.random() * 3;
  elem.style.setProperty('--d', `-${d}s`);

  const moveI = setInterval(() => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) > 90) obj.x += speed * (distX > 0 ? 1 : -1);
    if (Math.abs(distY) > 90) obj.y += speed * (distY > 0 ? 1 : -1);
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
            : Math.min(1 / Math.abs(dx * ey - ex * dy) / (fx * fx + fy * fy), 100) * strength;
        player.hp -= d / player.s;
      }, dist * 100);
    }, 3000);
  }, 3000 - d * 1000);

  elem.addEventListener('click', () => {
    const dist = Math.max(calcDist(obj), 1);
    obj.h -= player.s / dist;
    elem.style.setProperty('--hp', `${(50 * obj.h) / 100}px`);
    if (obj.h <= 0) {
      clearInterval(shotT);
      clearInterval(shotI);
      clearInterval(moveI);
      elem.parentNode.removeChild(elem);
    }
  });

  return { elem, obj };
};
