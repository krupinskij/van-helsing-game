const createTreat = obj => {
  const elem = document.createElement('div');
  elem.className = `t ${obj.t}`;

  elem.style.setProperty('--x', `${obj.x}px`);
  elem.style.setProperty('--y', `${obj.y}px`);

  return { elem, obj };
};
