let rooms = [
  {
    // 0
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 1, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 1
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 2, 0, P_Y],
      [2, 'N'],
      [5, 'E', ' P'],
      [2, 'S'],
      [1, 'S', ' D', 0, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W', ' P'],
    ],
    enemies: [{ x: 0, y: -400, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 2
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 3, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 1, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 3
    walls: [
      [5, 'N', ' P'],
      [2, 'E'],
      [1, 'E', ' D', 4, -400, P_Y + 400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 7, 400, P_Y + 400],
      [2, 'W'],
    ],
    treats: [
      { x: -100, y: -100, t: 'A', g: false },
      { x: 100, y: -100, t: 'A', g: false },
      { x: 0, y: 0, t: 'F', g: false },
      { x: -100, y: 100, t: 'A', g: false },
      { x: 100, y: 100, t: 'A', g: false },
    ],
  },
  {
    // 4
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 5, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 3, 400, P_Y + 400],
      [2, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 5
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 6, 0, P_Y],
      [2, 'N'],
      [5, 'E', ' P'],
      [2, 'S'],
      [1, 'S', ' D', 4, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W'],
    ],
    treats: [
      { x: -100, y: -100, t: 'A', g: false },
      { x: 100, y: -100, t: 'A', g: false },
      { x: 0, y: 0, t: 'A', g: false },
      { x: -100, y: 100, t: 'A', g: false },
      { x: 100, y: 100, t: 'A', g: false },
    ],
  },
  {
    // 6
    walls: [
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 5, 0, P_Y + 800],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 10, 400, P_Y + 400],
      [2, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 7
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 8, 0, P_Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 3, -400, P_Y + 400],
      [2, 'E'],
      [5, 'S'],
      [5, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 8
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 9, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 7, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W', ' P'],
    ],
    treats: [
      { x: -100, y: -100, t: 'F', g: false },
      { x: 100, y: -100, t: 'F', g: false },
      { x: 0, y: 0, t: 'F', g: false },
      { x: -100, y: 100, t: 'F', g: false },
      { x: 100, y: 100, t: 'F', g: false },
    ],
  },

  {
    // 9
    walls: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 10, -400, P_Y + 400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 8, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 10
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 11, 0, P_Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 6, -400, P_Y + 400],
      [2, 'E'],
      [5, 'S', ' P'],
      [2, 'W'],
      [1, 'W', ' D', 9, 400, P_Y + 400],
      [2, 'W'],
    ],
  },
  {
    // 11
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 12, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 12
    start: [3.5, 3],
    walls: [
      [3, 'N'],
      [1, 'N', ' D', 13, 0, P_Y],
      [3, 'N'],
      [3, 'E', ' P'],
      [3, 'E', ' P'],
      [3, 'S'],
      [1, 'S', ' D', 11, 0, P_Y + 800],
      [3, 'S'],
      [3, 'W', ' P'],
      [3, 'W', ' P'],
    ],
    enemies: [{ x: 600, y: -500, hp: 400, speed: 15, strength: 5, t: 'B', j: true }],
    treats: [
      { x: -600, y: -500, t: 'F', g: false },
      { x: 600, y: -500, t: 'F', g: false },
      { x: -100, y: -100, t: 'A', g: false },
      { x: -100, y: 100, t: 'A', g: false },
      { x: 0, y: 0, t: 'A', g: false },
      { x: 100, y: -100, t: 'A', g: false },
      { x: 100, y: 100, t: 'A', g: false },
      { x: -600, y: 500, t: 'F', g: false },
      { x: 600, y: 500, t: 'F', g: false },
    ],
  },
  {
    // 13
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 14, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 12, 0, P_Y + 900],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 14
    walls: [
      [5, 'N', ' P'],
      [2, 'E'],
      [1, 'E', ' D', 15, -400, P_Y + 400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 18, 400, P_Y + 400],
      [2, 'W'],
    ],
  },
  {
    // 15
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 16, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 14, 400, P_Y + 400],
      [2, 'W'],
    ],
    enemies: [
      { x: -100, y: 100, hp: 100, speed: 5, strength: 1, t: 'D' },
      { x: 100, y: -100, hp: 100, speed: 5, strength: 1, t: 'D' },
    ],
  },
  {
    // 16
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 17, 0, P_Y],
      [2, 'N'],
      [5, 'E', ' P'],
      [2, 'S'],
      [1, 'S', ' D', 15, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W'],
    ],
    treats: [
      { x: -100, y: -100, t: 'A', g: false },
      { x: 100, y: -100, t: 'A', g: false },
      { x: 0, y: 0, t: 'A', g: false },
      { x: -100, y: 100, t: 'A', g: false },
      { x: 100, y: 100, t: 'A', g: false },
    ],
  },
  {
    // 17
    walls: [
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 16, 0, P_Y + 800],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 21, 400, P_Y + 400],
      [2, 'W'],
    ],
    enemies: [
      { x: 100, y: 100, hp: 100, speed: 5, strength: 1, t: 'D' },
      { x: -100, y: -100, hp: 100, speed: 5, strength: 1, t: 'D' },
    ],
  },
  {
    // 18
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 19, 0, P_Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 14, -400, P_Y + 400],
      [2, 'E'],
      [5, 'S'],
      [5, 'W'],
    ],
    enemies: [
      { x: 100, y: 100, hp: 100, speed: 5, strength: 1, t: 'D' },
      { x: -100, y: -100, hp: 100, speed: 5, strength: 1, t: 'D' },
    ],
  },
  {
    // 19
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 20, 0, P_Y],
      [5, 'N'],
      [5, 'E'],
      [5, 'S'],
      [1, 'S', ' D', 18, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W', ' P'],
    ],
    treats: [
      { x: -100, y: -100, t: 'F', g: false },
      { x: 100, y: -100, t: 'F', g: false },
      { x: 0, y: 0, t: 'F', g: false },
      { x: -100, y: 100, t: 'F', g: false },
      { x: 100, y: 100, t: 'F', g: false },
    ],
    enemies: [{ x: 900, y: 0, hp: 400, speed: 15, strength: 20, t: 'B' }],
  },

  {
    // 20
    walls: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 21, -400, P_Y + 400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 19, 0, P_Y + 800],
      [2, 'S'],
      [5, 'W'],
    ],
    enemies: [
      { x: -100, y: 100, hp: 100, speed: 5, strength: 1, t: 'D' },
      { x: 100, y: -100, hp: 100, speed: 5, strength: 1, t: 'D' },
    ],
  },
  {
    // 21
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 22, 0, P_Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 17, -400, P_Y + 400],
      [2, 'E'],
      [5, 'S', ' P'],
      [2, 'W'],
      [1, 'W', ' D', 20, 400, P_Y + 400],
      [2, 'W'],
    ],
  },
  {
    // 22
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 23, 0, P_Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [1, 'W'],
      [1, 'W', ' D R', 25, 0, P_Y + 400],
      [3, 'W', ' P'],
    ],
  },
  {
    // 23
    start: [3.5, 3],
    walls: [
      [3, 'N'],
      [1, 'N', ' D', 24, 0, P_Y],
      [3, 'N'],
      [3, 'E'],
      [3, 'E'],
      [3, 'S'],
      [1, 'S', ' D', 22, 0, P_Y + 800],
      [3, 'S'],
      [3, 'W'],
      [3, 'W'],
    ],
    enemies: [
      { x: 0, y: 0, hp: 400, speed: 15, strength: 20, t: 'B' },
      { x: -600, y: 500, hp: 100, speed: 5, strength: 1, t: 'D' },
      { x: 600, y: 500, hp: 100, speed: 5, strength: 1, t: 'D' },
    ],
  },
  {
    // 24
    walls: [
      [5, 'N', ' P'],
      [5, 'E', ' P'],
      [2, 'S'],
      [1, 'S', ' D', 23, 0, P_Y + 900],
      [2, 'S'],
      [5, 'W', ' P'],
    ],
    treats: [
      { x: -200, y: -200, t: 'F', g: false },
      { x: 0, y: -200, t: 'A', g: false },
      { x: 200, y: -200, t: 'F', g: false },
      { x: -200, y: 0, t: 'A', g: false },
      { x: 0, y: 0, t: 'F', g: false },
      { x: 200, y: 0, t: 'A', g: false },
      { x: -200, y: 200, t: 'F', g: false },
      { x: 0, y: 200, t: 'A', g: false },
      { x: 200, y: 200, t: 'F', g: false },
      { x: -400, y: -400, t: 'A', g: false },
      { x: -400, y: 400, t: 'A', g: false },
      { x: 400, y: -400, t: 'A', g: false },
      { x: 400, y: 400, t: 'A', g: false },
    ],
  },
  {
    // 25
    f: 1,
    start: [3.5, 3.5],
    walls: [
      [7, 'N', ' P'],
      [7, 'E', ' P'],
      [7, 'S', ' P'],
      [7, 'W', ' P'],
    ],
    enemies: [{ x: 200, y: 0, hp: 2000, speed: 10, strength: 200, t: 'V' }],
    treats: [
      { x: -600, y: -600, t: 'F', g: false },
      { x: -600, y: 600, t: 'F', g: false },
      { x: 600, y: -600, t: 'F', g: false },
      { x: 600, y: 600, t: 'F', g: false },
      { x: 0, y: -600, t: 'A', g: false },
      { x: 0, y: 600, t: 'A', g: false },
      { x: -600, y: 0, t: 'A', g: false },
      { x: 600, y: 0, t: 'A', g: false },
    ],
  },
];

const roomsBU = JSON.stringify(rooms);