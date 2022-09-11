(() => {
let M = Math, I = Int32Array, U = Uint8Array, D = document
M.s = M.sin;
M.c = M.cos;
M.r = M.random;
M.a = M.abs;
M.t = M.max;
M.b = M.min;
D.c = D.createElement;
D.g = document.getElementById;
D.a = document.addEventListener;

let w = [];
let wH = [];
let wV = [];
let e = [];
let t = [];

let X = 0;
let PR = D.body.clientWidth / 2;
let Y = PR - 400;
D.documentElement.style.setProperty('--P', `${PR}px`);
D.documentElement.style.setProperty('--H', `${D.body.clientHeight/2 - 150}px`);
class P {
  constructor() {
    let o1 = (v) => M.s(v*M.PI*2)
    let o2 = (v) => 2 * (v % 1) - 1;
    let o3 = (v) => v % 1 < 0.5 ? 1 : -1;
    let o4 = (v) => {
      let x = (v % 1) * 4;
      return x < 2 ? x - 1 : 3 - x;
    };

    let g = (n) => 0.003959503758 * 2 ** ((n - 128) / 12);

    let c = (i, n, l) => {
      let o1 = o[i.i[0]],
        o1v = i.i[1],
        o1x = i.i[3] / 32,
        o2 = o[i.i[4]],
        o2v = i.i[5],
        o2x = i.i[8] / 32,
        nv = i.i[9],
        a = i.i[10] * i.i[10] * 4,
        s = i.i[11] * i.i[11] * 4,
        r = i.i[12] * i.i[12] * 4,
        ri = 1 / r,
        ed = -i.i[13] / 16,
        ar = i.i[14],
        ai = l * 2 ** (2 - i.i[15]),
        nb = new I(a + s + r),
        c1 = 0,
        c2 = 0;

      let j, j2, e, rs, o1t, o2t;

      for (j = 0, j2 = 0; j < a + s + r; j++, j2++) {
        if (j2 >= 0) {
          ar = (ar >> 8) | ((ar & 255) << 4);
          j2 -= ai;

          o1t = g(n + (ar & 15) + i.i[2] - 128);
          o2t = g(n + (ar & 15) + i.i[6] - 128) * (1 + 0.0008 * i.i[7]);
        }

        e = 1;
        if (j < a) {
          e = j / a;
        } else if (j >= a + s) {
          e = (j - a - s) * ri;
          e = (1 - e) * 3 ** (ed * e);
        }

        c1 += o1t * e ** o1x;
        rs = o1(c1) * o1v;

        c2 += o2t * e ** o2x;
        rs += o2(c2) * o2v;

        if (nv) {
          rs += (2 * M.r() - 1) * nv;
        }

        nb[j] = (80 * rs * e) | 0;
      }

      return nb;
    };

    let o = [o1, o3, o2, o4];

    let ms, ml, mc, mn, mm;

    this.i = s => {
      ms = s;

      ml = s.e;
      mc = 0;

      mn = s.l * s.pl * (ml + 1) * 2;

      mm = new I(mn);
    };

    this.g =  () => {
      let cb = new I(mn),
        i = ms.d[mc],
        l = ms.l,
        pl = ms.pl,
        lo = 0,
        b = 0,
        h,ls,
        fa = 0,nc = [];

      for (let p = 0; p <= ml; ++p) {
        let cp = i.p[p];

        for (let r = 0; r < pl; ++r) {
          let cn = cp ? i.c[cp - 1].f[r] : 0;
          if (cn) {
            i.i[cn - 1] = i.c[cp - 1].f[r + pl] || 0;

            if (cn < 17) {
              nc = [];
            }
          }

          let ol = o[i.i[16]],
            ff = i.i[20],
            d = i.i[23] * 1e-5,
            dl = (i.i[28] * l) & ~1,
            rt = (p * pl + r) * l;

          for (let co = 0; co < 4; ++co) {
            let n = cp ? i.c[cp - 1].n[r + co * pl] : 0;
            if (n) {
              if (!nc[n]) {
                nc[n] = c(i, n, l);
              }

              var nb = nc[n];
              for (let j = 0, i = rt * 2; j < nb.length; j++, i += 2) {
                cb[i] += nb[j];
              }
            }
          }

          for (let j = 0; j < l; j++) {
            let k = (rt + j) * 2;
            let rs = cb[k];

            if (rs || fa) {
              let f = (i.i[21] * 43.23529 * M.PI) / 44100;
              if (i.i[19]) {
                f *= ol(2 ** (i.i[18] - 9) / l * k) * i.i[17] / 512 + 0.5;
              }
              f = 1.5 * M.s(f);
              lo += f * b;
              h = (1 - i.i[22] / 255) * (rs - b) - lo;
              b += f * h;
              rs = ff == 3 ? b : ff == 1 ? h : lo;

              if (d) {
                rs *= d;
                rs = rs < 1 ? (rs > -1 ? o1(rs * 0.25) : -1) : 1;
                rs /= d;
              }

              rs *= i.i[24] / 32;

              fa = rs * rs > 1e-5;

              let t = M.s((M.PI * 4 ** (i.i[26] - 9)) / l * k) * i.i[25] / 512 + 0.5;
              ls = rs * (1 - t);
              rs *= t;
            } else {
              ls = 0;
            }

            if (k >= dl) {
              
           let d = i.i[27] / 255;
              ls += cb[k - dl + 1] * d;

              rs += cb[k - dl] * d;
            }

            cb[k] = ls | 0;
            cb[k + 1] = rs | 0;

            mm[k] += ls | 0;
            mm[k + 1] += rs | 0;
          }
        }
      }

      mc++;
      return mc / ms.c;
    };

    this.w =  () => {
      let h = 44;
      let l1 = h + mn * 2 - 8;
      let l2 = l1 - 36;
      let w = new U(h + mn * 2);
      w.set([
        82,
        73,
        70,
        70,
        l1 & 255,
        (l1 >> 8) & 255,
        (l1 >> 16) & 255,
        (l1 >> 24) & 255,
        87,
        65,
        86,
        69,
        102,
        109,
        116,
        32,
        16,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        68,
        172,
        0,
        0,
        16,
        177,
        2,
        0,
        4,
        0,
        16,
        0,
        100,
        97,
        116,
        97,
        l2 & 255,
        (l2 >> 8) & 255,
        (l2 >> 16) & 255,
        (l2 >> 24) & 255,
      ]);

      for (let i = 0, j = h; i < mn; ++i) {
        var y = mm[i];
        y = y < -32767 ? -32767 : y > 32767 ? 32767 : y;
        w[j++] = y & 255;
        w[j++] = (y >> 8) & 255;
      }

      return w;
    };
  }
}

let _p = (s, l = 0) => {
  let p = new P();
  p.i(s);
  p.g();
  let w = p.w();
  let a = D.c('audio');
  a.src = URL.createObjectURL(new Blob([w], { type: 'audio/wav' }));
  a.play();
  if (l) a.onended = () => a.play();
};

let b$ = {
  d: [
    {
      i: [
        2, 192, 128, 0, 2, 192, 140, 18, 0, 0, 158, 119, 158, 0, 0, 0, 0, 0, 0, 0, 2, 5, 0, 0, 128,
        0, 0, 24, 8,
      ],
      p: [1],
      c: [{ n: [108, , , , , , , , 116, , , , , , , , , , , , 101], f: [] }],
    },
  ],
  l: 22050,
  pl: 32,
  e: 0,
  c: 1,
};

_p(b$, 1);

let a$ = {
  d: [
    {
      i: [
        3, 0, 128, 0, 0, 55, 128, 0, 64, 36, 19, 5, 47, 87, 0, 0, 1, 55, 7, 0, 2, 67, 115, 124, 255,
        67, 6, 39, 1,
      ],
      p: [1],
      c: [{ n: [146], f: [] }],
    },
  ],
  l: 5513,
  pl: 10,
  e: 0,
  c: 1,
};

let k$ = {
  d: [
    {
      i: [
        0, 255, 116, 64, 0, 255, 120, 0, 64, 255, 31, 6, 73, 0, 0, 0, 0, 0, 8, 0, 2, 14, 0, 10, 200,
        0, 0, 0, 0,
      ],
      p: [1],
      c: [{ n: [122], f: [] }],
    },
  ],
  l: 5513,
  pl: 10,
  e: 0,
  c: 1,
};

let s$ = {
  d: [
    {
      i: [
        3, 255, 106, 64, 0, 255, 92, 15, 160, 0, 5, 12, 103, 0, 12, 7, 3, 130, 11, 0, 2, 255, 0, 2,
        200, 83, 5, 0, 1,
      ],
      p: [1],
      c: [{ n: [134], f: [] }],
    },
  ],
  l: 5513,
  pl: 10,
  e: 0,
  c: 1,
};

let t$ = {
  d: [
    {
      i: [
        2, 138, 116, 0, 2, 138, 128, 4, 0, 0, 47, 48, 128, 63, 124, 3, 0, 139, 4, 1, 2, 64, 160, 3,
        128, 147, 4, 0, 5,
      ],
      p: [1],
      c: [{ n: [170], f: [] }],
    },
  ],
  l: 5513,
  pl: 10,
  e: 0,
  c: 1,
};

let r = [
  {
    w: [
      [2, 'N'],
      [1, 'N', ' D', 1, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    w: [
      [2, 'N'],
      [1, 'N', ' D', 2, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 0, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    e: [{ x: 0, y: -400, l: 100, p: 5, s: 1, t: 'D' }],
  },
  { 
    w: [
      [2, 'N'],
      [1, 'N', ' D G', 3, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 1, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  { 
    w: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 4, -400, Y+400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 7, 400, Y+400],
      [2, 'W'],
    ],
    t: [
      { x: -100, y: -100, t: 'A', g: 0 },
      { x: 100, y: -100, t: 'A', g: 0 },
      { x: 0, y: 0, t: 'F', g: 0 },
      { x: -100, y: 100, t: 'A', g: 0 },
      { x: 100, y: 100, t: 'A', g: 0 },
    ],
  },
  {
    w: [
      [2, 'N'],
      [1, 'N', ' D', 5, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 3, 400, Y+400],
      [2, 'W'],
    ],
    e: [{ x: 0, y: 0, l: 100, p: 5, s: 1, t: 'D' }],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 6, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 4, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    t: [
      { x: -100, y: -100, t: 'A', g: 0 },
      { x: 100, y: -100, t: 'A', g: 0 },
      { x: 0, y: 0, t: 'A', g: 0 },
      { x: -100, y: 100, t: 'A', g: 0 },
      { x: 100, y: 100, t: 'A', g: 0 },
    ],
  },
  {
    
    w: [
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 5, 0, Y+800],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 10, 400, Y+400],
      [2, 'W'],
    ],
    e: [{ x: 0, y: 0, l: 100, p: 5, s: 1, t: 'D' }],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 8, 0, Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 3, -400, Y+400],
      [2, 'E'],
      [5, 'S'],
      [5, 'W'],
    ],
    e: [{ x: 0, y: 0, l: 100, p: 5, s: 1, t: 'D' }],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 9, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 7, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    t: [
      { x: -100, y: -100, t: 'F', g: 0 },
      { x: 100, y: -100, t: 'F', g: 0 },
      { x: 0, y: 0, t: 'F', g: 0 },
      { x: -100, y: 100, t: 'F', g: 0 },
      { x: 100, y: 100, t: 'F', g: 0 },
    ],
  },

  {
    
    w: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 10, -400, Y+400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 8, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    e: [{ x: 0, y: 0, l: 100, p: 5, s: 1, t: 'D' }],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D G', 11, 0, Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 6, -400, Y+400],
      [2, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 9, 400, Y+400],
      [2, 'W'],
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 12, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    
    s: [3.5, 3],
    w: [
      [3, 'N'],
      [1, 'N', ' D', 13, 0, Y],
      [3, 'N'],
      [3, 'E'],
      [3, 'E'],
      [3, 'S'],
      [1, 'S', ' D', 11, 0, Y+800],
      [3, 'S'],
      [3, 'W'],
      [3, 'W'],
    ],
    e: [{ x: 600, y: -500, l: 400, p: 15, s: 5, t: 'B', j: 1 }],
    t: [
      { x: -600, y: -500, t: 'F', g: 0 },
      { x: 600, y: -500, t: 'F', g: 0 },
      { x: -100, y: -100, t: 'A', g: 0 },
      { x: -100, y: 100, t: 'A', g: 0 },
      { x: 0, y: 0, t: 'A', g: 0 },
      { x: 100, y: -100, t: 'A', g: 0 },
      { x: 100, y: 100, t: 'A', g: 0 },
      { x: -600, y: 500, t: 'F', g: 0 },
      { x: 600, y: 500, t: 'F', g: 0 },
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D G', 14, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 12, 0, Y+900],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    
    w: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 15, -400, Y+400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 18, 400, Y+400],
      [2, 'W'],
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 16, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 14, 400, Y+400],
      [2, 'W'],
    ],
    e: [
      { x: -100, y: 100, l: 100, p: 5, s: 1, t: 'D' },
      { x: 100, y: -100, l: 100, p: 5, s: 1, t: 'D' },
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 17, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 15, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    t: [
      { x: -100, y: -100, t: 'A', g: 0 },
      { x: 100, y: -100, t: 'A', g: 0 },
      { x: 0, y: 0, t: 'A', g: 0 },
      { x: -100, y: 100, t: 'A', g: 0 },
      { x: 100, y: 100, t: 'A', g: 0 },
    ],
  },
  {
    
    w: [
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 16, 0, Y+800],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 21, 400, Y+400],
      [2, 'W'],
    ],
    e: [
      { x: 100, y: 100, l: 100, p: 5, s: 1, t: 'D' },
      { x: -100, y: -100, l: 100, p: 5, s: 1, t: 'D' },
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 19, 0, Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 14, -400, Y+400],
      [2, 'E'],
      [5, 'S'],
      [5, 'W'],
    ],
    e: [
      { x: 100, y: 100, l: 100, p: 5, s: 1, t: 'D' },
      { x: -100, y: -100, l: 100, p: 5, s: 1, t: 'D' },
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 20, 0, Y],
      [5, 'N'],
      [5, 'E'],
      [5, 'S'],
      [1, 'S', ' D', 18, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    t: [
      { x: -100, y: -100, t: 'F', g: 0 },
      { x: 100, y: -100, t: 'F', g: 0 },
      { x: 0, y: 0, t: 'F', g: 0 },
      { x: -100, y: 100, t: 'F', g: 0 },
      { x: 100, y: 100, t: 'F', g: 0 },
    ],
    e: [{ x: 900, y: 0, l: 400, p: 15, s: 20, t: 'B' }],
  },

  {
    
    w: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 21, -400, Y+400],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 19, 0, Y+800],
      [2, 'S'],
      [5, 'W'],
    ],
    e: [
      { x: -100, y: 100, l: 100, p: 5, s: 1, t: 'D' },
      { x: 100, y: -100, l: 100, p: 5, s: 1, t: 'D' },
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D G', 22, 0, Y],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 17, -400, Y+400],
      [2, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 20, 400, Y+400],
      [2, 'W'],
    ],
  },
  {
    
    w: [
      [2, 'N'],
      [1, 'N', ' D', 23, 0, Y],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [1, 'W'],
      [1, 'W', ' D R', 25, 0, Y+400],
      [3, 'W'],
    ],
  },
  {
    
    s: [3.5, 3],
    w: [
      [3, 'N'],
      [1, 'N', ' D', 24, 0, Y],
      [3, 'N'],
      [3, 'E'],
      [3, 'E'],
      [3, 'S'],
      [1, 'S', ' D', 22, 0, Y+800],
      [3, 'S'],
      [3, 'W'],
      [3, 'W'],
    ],
    e: [
      { x: 0, y: 0, l: 400, p: 15, s: 20, t: 'B' },
      { x: -600, y: 500, l: 100, p: 5, s: 1, t: 'D' },
      { x: 600, y: 500, l: 100, p: 5, s: 1, t: 'D' },
    ],
  },
  {
    
    w: [
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 23, 0, Y+900],
      [2, 'S'],
      [5, 'W'],
    ],
    t: [
      { x: -200, y: -200, t: 'F', g: 0 },
      { x: 0, y: -200, t: 'A', g: 0 },
      { x: 200, y: -200, t: 'F', g: 0 },
      { x: -200, y: 0, t: 'A', g: 0 },
      { x: 0, y: 0, t: 'F', g: 0 },
      { x: 200, y: 0, t: 'A', g: 0 },
      { x: -200, y: 200, t: 'F', g: 0 },
      { x: 0, y: 200, t: 'A', g: 0 },
      { x: 200, y: 200, t: 'F', g: 0 },
      { x: -400, y: -400, t: 'A', g: 0 },
      { x: -400, y: 400, t: 'A', g: 0 },
      { x: 400, y: -400, t: 'A', g: 0 },
      { x: 400, y: 400, t: 'A', g: 0 },
    ],
  },
  {
    
    f: 1,
    s: [3.5, 3.5],
    w: [
      [7, 'N'],
      [7, 'E'],
      [7, 'S'],
      [7, 'W'],
    ],
    e: [{ x: 200, y: 0, l: 2000, p: 10, s: 200, t: 'V' }],
    t: [
      { x: -600, y: -600, t: 'F', g: 0 },
      { x: -600, y: 600, t: 'F', g: 0 },
      { x: 600, y: -600, t: 'F', g: 0 },
      { x: 600, y: 600, t: 'F', g: 0 },
      { x: 0, y: -600, t: 'A', g: 0 },
      { x: 0, y: 600, t: 'A', g: 0 },
      { x: -600, y: 0, t: 'A', g: 0 },
      { x: 600, y: 0, t: 'A', g: 0 },
    ],
  },
];

let rB = JSON.stringify(r);

let _cD = o => {
  let x = (M.a(p.X - o.x) - 90) / 200;
  let y = (M.a(PR - p.Y - o.y) - 90) / 200;
  return M.t(x * x + y * y, 1);
};
let $L = {
  D: 100,
  B: 400,
  V: 2000,
};
let _sM = o => {
  _p(s$);
  let dt = _cD(o);
  let { x: ax, y: ay } = o;
  let { X: bx, Y: by } = p;
  setTimeout(() => {
    let { X: cx, Y: cy } = p;
    let dx = ax - cx, dy = ay - cy,ex = bx - cx,ey = by - cy,fx = bx - ax,fy = by - ay, d =
      dx * fx >= 0 && dy * fy >= 0
        ? 0
        : M.b(1 / M.a(dx * ey - ex * dy) / (fx * fx + fy * fy), 100) * o.s;
    p.l -= d / p.s;
    _p(k$);
  }, dt * 100);
};
let _cE = o => {
  let e = D.c('div');
  e.className = `e ${o.t}`;
  e.style.setProperty('--x', `${o.x}px`);
  e.style.setProperty('--y', `${o.y}px`);
  e.style.setProperty('--l', `${(50 * o.l) / $L[o.t]}px`);

  let d = M.r() * 3;
  e.style.setProperty('--d', `-${d}s`);

  let si = setInterval;
  let mI = si(() => {
    let dx = p.X - o.x;
    let dy = PR - p.Y - o.y;
    if (M.a(dx) > 80) o.x += o.p * (dx > 0 ? 1 : -1);
    if (M.a(dy) > 80) o.y += o.p * (dy > 0 ? 1 : -1);
  }, 100);
  let jI =
    o.j &&
    si(() => {
      o.x = -o.x;
      o.y = -o.y;
    }, 15000);

  let sI;
  let sT = setTimeout(() => {
    _sM(o);
    sI = si(() => {
      _sM(o);
    }, 3000);
  }, 3000 - d * 1000);

  e.addEventListener('click', () => {
    if (p.a <= 0) return;
    let d = M.t(_cD(o), 1);
    o.l -= p.s / d;
    e.style.setProperty('--l', `${(50 * o.l) / $L[o.t]}px`);
    if (o.l <= 0) {
      o.st();
      p.s += {
        D: 1,
        B: 10,
        V: 0,
      }[o.t];
      e.parentNode.removeChild(e);
      _p(k$);

      if (o.t === 'V') _hW();
    }
  });

  o.st = () => {
    let ci = clearInterval;
    ci(sT);
    ci(sI);
    ci(mI);
    if (o.j) ci(jI);
  };

  return { e, o };
};

let _cT = o => {
  let e = D.c('div');
  e.className = `t ${o.t}`;

  e.style.setProperty('--x', `${o.x}px`);
  e.style.setProperty('--y', `${o.y}px`);

  return { e, o };
};

let c = {
  shift: {
    p: 0,
  },
  arrowleft: {
    p: 0,
    a: () => {
      p.R -= 0.04;
    },
    s: () => {
      p.V(-1, M.c);
      p.H(1, M.s);
    },
  },
  arrowright: {
    p: 0,
    a: () => (p.R += 0.04),
    s: () => {
      p.V(1, M.c);
      p.H(-1, M.s);
    },
  },
  arrowup: {
    p: 0,
    a: () => {
      p.V(1, M.s);
      p.H(1, M.c);
    },
  },
  arrowdown: {
    p: 0,
    a: () => {
      p.V(-1, M.s);
      p.H(-1, M.c);
    },
  },
};
c.a = { ...c.arrowleft };
c.d = { ...c.arrowright };
c.w = { ...c.arrowup };
c.s = { ...c.arrowdown };

let p = {
  R: 0,
  _l: 100,
  _s: 10,
  _a: 20,
  X: X,
  Y: Y,
  b: 0,

  get l() {
    return this._l;
  },
  set l(_l) {
    if (_l <= 0) _hL();
    this._l = M.t(M.b(100, _l), 0);
    D.g('h').style.setProperty('--w', `${this._l}%`);
  },

  get s() {
    return this._s;
  },
  set s(_s) {
    D.g('s').innerText = _s;
    this._s = _s;
  },

  get a() {
    return this._a;
  },
  set a(_a) {
    if (_a < 0 || p.b) return;
    D.body.classList.toggle('N', _a === 0)
    D.g('a').innerText = _a;
    this._a = _a;
  },

  H: (k, t) => {
    let d = k * PR * t(p.R) / 80;
    for (let i = 0; i < wH.length; i++) {
      let w = wH[i];

      if (M.a(p.Y - PR - +w.dataset.y + d) > 50) continue;

      let x = (p.X + +w.dataset.x) * (w.classList.contains('S') ? -1 : 1);

      if (x > -50 && +w.dataset.w - x > -50) {
        if (w.classList.contains('D') && !w.classList.contains('C')) {
          p.X = +w.dataset.px;
          p.Y = +w.dataset.py;
          _cR(r[+w.dataset.r]);
        }
        return;
      }
    }

    p.Y += d;
  },
  V: (k, t) => {
    let d = k * PR * t(p.R) / 80;
    for (let i = 0; i < wV.length; i++) {
      let w = wV[i];

      if (M.a(p.X + +w.dataset.x + d) > 50) continue;

      let y = (p.Y - PR - +w.dataset.y) * (w.classList.contains('E') ? -1 : 1);

      if (y > -50 && +w.dataset.w - y > -50) {
        if (w.classList.contains('D') && !w.classList.contains('C')) {
          p.X = +w.dataset.px;
          p.Y = +w.dataset.py;
          _cR(r[+w.dataset.r]);
        }
        return;
      }
    }

    p.X += d;
  },
};

D.a('keydown', e => {
  let k = e.key.toLowerCase();
  if (k === 'escape') _rG();
  if (c[k]) {
    c[k].p = 1;
  }
});

D.a('keyup', e => {
  let k = e.key.toLowerCase();
  if (c[k]) {
    c[k].p = 0;
  }
});

let _eM = () => {
  if (p.b) return;
  Object.keys(c).forEach(k => {
    c[k].p &&
      ((c['shift'].p && c[k].s) || c[k].a)?.();
  });
  let d = D.documentElement;
  d.style.setProperty('--R', `${p.R}rad`);
  d.style.setProperty('--X', `${p.X}px`);
  d.style.setProperty('--Y', `${p.Y}px`);
};

let _cS = () => {
  w.forEach(e => {
    let pXL = (pYR = p.X + +e.dataset.x);
    let pYL = (pXR = p.Y - PR - +e.dataset.y);
    let w = +e.dataset.w;
    switch (e.classList[1]) {
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
    e.style.setProperty('--l',  M.b(1, M.sqrt(pXR * pXR + pYR * pYR) / 1500));
    e.style.setProperty('--r',  M.b(1, M.sqrt(pXL * pXL + pYL * pYL) / 1500));
  });
};

let _eEM = () => {
  e.forEach(({ o, e }) => {
    e.style.setProperty('--x', `${o.x}px`);
    e.style.setProperty('--y', `${o.y}px`);
  });
};

let _gT = () => {
  t = t.filter(({ o, e }) => {
    if (M.a( p.X - o.x) < 50 && M.a(PR - p.Y - o.y) < 50) {
      switch (o.t) {
        case 'A':
          p.a += 10;
          break;
        case 'F':
          if (p.l >= 100) return 1;
          p.l += 10;
          break;
      }
      o.g = 1;
      e.parentNode.removeChild(e);
      _p(t$);

      return 0;
    }
    return 1;
  });
};

let a = () => {
  _eM();
  _cS();
  _eEM();
  _gT();
  requestAnimationFrame(a);
};
requestAnimationFrame(a);

let _cR = r => {
  D.g('g').innerHTML = '';
  w = [];
  wH = [];
  wV = [];
  t = [];
  e = e.filter(e => {
    e.o.st();
    return 0;
  });
  let rE = D.c('div');
  rE.className = 'r';

  let mh = (mw = mx = my = -Infinity);
  let [x, y] = r.s || [2.5, 2.5];

  let h = (w = 0);
  r.w.forEach(([len, dir, ...d]) => {
    let e = D.c('div');
    e.className = 'w ' + dir + (d[0] || '') + (r.f ? ' F' : '');
    e.dataset.x = x * 200;
    e.dataset.y = y * 200;
    e.dataset.w = len * 200;
    if (d.length === 4) {
      e.dataset.r = d[1];
      e.dataset.px = d[2];
      e.dataset.py = d[3];
    }

    e.style.width = `${len * 200}px`;
    e.style.setProperty('--x', `${x * 200}px`);
    e.style.setProperty('--y', `${y * 200}px`);
    rE.appendChild(e);

    switch (dir) {
      case 'N':
        x -= len;
        w += len;
        wH.push(e);
        break;
      case 'S':
        x += len;
        wH.push(e);
        break;
      case 'E':
        y -= len;
        h += len;
        wV.push(e);
        break;
      case 'W':
        y += len;
        wV.push(e);
        break;
    }

    mx = M.t(mx, x);
    my = M.t(my, y);
  });
  mh = M.t(mh, h);
  mw = M.t(mw, w);

  w = [...wH, ...wV];

  let fE = D.c('div');
  fE.className = 'f';
  fE.style.width = `${mw * 200}px`;
  fE.style.height = `${mh * 200}px`;
  fE.style.setProperty('--w', `${mw * 200}px`);
  fE.style.setProperty('--h', `${mh * 200}px`);
  fE.style.setProperty('--x', `${mx * 200}px`);
  fE.style.setProperty('--y', `${my * 200}px`);
  rE.appendChild(fE);

  r.t?.forEach(_t => {
    if (!_t.g) {
      let cT = _cT(_t);
      t.push(cT);
      rE.appendChild(cT.e);
    }
  });
  r.e?.forEach(_e => {
    if (_e.l > 0) {
      let cE = _cE(_e);
      e.push(cE);
      rE.appendChild(cE.e);
    }
  });

  D.g('g').appendChild(rE);
};

_cR(r[0]);

D.a('click', () => {
  if(p.a > 0) {
    _p(a$);
    p.a--;
  }
});

let _rG = () => {
  r = JSON.parse(rB);
  p.b = 0;
  p.s = 10;
  p.l = 100;
  p.a = 20;
  p.R = 0;
  p.X = X;
  p.Y = Y;
  D.body.classList = '';
  _cR(r[0]);
};

let _hW = () => {
  D.body.classList = 'W';
  p.b = 1;
};

let _hL = () => {
  D.body.classList = 'L';
  p.b = 1;
};
})()
