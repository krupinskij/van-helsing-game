const createEnemy = (t, [x, y], s) => {
  const obj = { x, y };
  const elem = document.createElement('div');
  elem.className = `e ${t}`;
  elem.dataset.x = x;
  elem.dataset.y = y;
  elem.style.setProperty('--x', `${x}px`);
  elem.style.setProperty('--y', `${y}px`);
  elem.style.setProperty('--d', `-${Math.random() * 3}s`);

  setInterval(() => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) > 80) obj.x += s * (distX > 0 ? 1 : -1);
    if (Math.abs(distY) > 80) obj.y += s * (distY > 0 ? 1 : -1);
  }, 100);

  return { elem, obj };
};
