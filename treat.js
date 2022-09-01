const createTreat = (t, [x, y]) => {
  const obj = { x, y, t };
  const elem = document.createElement('div');
  elem.className = `t ${t}`;

  elem.style.setProperty('--x', `${x}px`);
  elem.style.setProperty('--y', `${y}px`);

  return { elem, obj };
};
