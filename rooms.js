const levels = [
  [
    {
      start: [0, 0],
      walls: [
        [2, 'N'],
        [1, 'N', ' D', 1, 500, 700],
        [2, 'N'],
        [5, 'E'],
        [5, 'S'],
        [5, 'W'],
      ],
      treats: [
        { x: 200, y: 200, t: 'A', g: false },
        { x: 200, y: 400, t: 'H', g: false },
      ],
    },
    {
      start: [0, 5],
      walls: [
        [5, 'N'],
        [2, 'E'],
        [1, 'E', ' D', 2, 1100, 1100],
        [2, 'E'],
        [2, 'S'],
        [1, 'S', ' D', 0, 500, 500],
        [2, 'S'],
        [5, 'W'],
      ],
      enemies: [{ x: 500, y: -300, hp: 100, speed: 5, strength: 1, t: 'D' }],
    },
    {
      start: [-5, 5],
      walls: [
        [5, 'N'],
        [5, 'E'],
        [5, 'S'],
        [2, 'W'],
        [1, 'W', ' D', 1, 900, 1100],
        [2, 'W'],
      ],
      enemies: [{ x: 1400, y: -300, hp: 1000, speed: 10, strength: 10, t: 'V' }],
    },
  ],
];