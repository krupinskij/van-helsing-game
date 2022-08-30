const createEnemy = (t, [x, y], s) => {
  const obj = { x, y, h: 100 };
  const elem = document.createElement('div');
  elem.className = `e ${t}`;
  elem.dataset.x = x;
  elem.dataset.y = y;
  elem.style.setProperty('--x', `${x}px`);
  elem.style.setProperty('--y', `${y}px`);
  elem.style.setProperty('--hp', `50px`);
  elem.style.setProperty('--d', `-${Math.random() * 3}s`);

  const move = setInterval(() => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) > 90) obj.x += s * (distX > 0 ? 1 : -1);
    if (Math.abs(distY) > 90) obj.y += s * (distY > 0 ? 1 : -1);
  }, 100);

  elem.addEventListener('click', () => {
    obj.h -= 10;
    elem.style.setProperty('--hp', `${(50 * obj.h) / 100}px`);
    if (obj.h <= 0) {
      clearInterval(move);
      elem.parentNode.removeChild(elem);
    }
  });

  return { elem, obj };
};
