class CPlayer {
  constructor() {
    var osc_sin = function (value) {
      return Math.sin(value * 6.283184);
    };

    var osc_saw = function (value) {
      return 2 * (value % 1) - 1;
    };

    var osc_square = function (value) {
      return value % 1 < 0.5 ? 1 : -1;
    };

    var osc_tri = function (value) {
      var v2 = (value % 1) * 4;
      if (v2 < 2) return v2 - 1;
      return 3 - v2;
    };

    var getnotefreq = function (n) {
      return 0.003959503758 * 2 ** ((n - 128) / 12);
    };

    var createNote = function (instr, n, rowLen) {
      var osc1 = mOscillators[instr.i[0]],
        o1vol = instr.i[1],
        o1xenv = instr.i[3] / 32,
        osc2 = mOscillators[instr.i[4]],
        o2vol = instr.i[5],
        o2xenv = instr.i[8] / 32,
        noiseVol = instr.i[9],
        attack = instr.i[10] * instr.i[10] * 4,
        sustain = instr.i[11] * instr.i[11] * 4,
        release = instr.i[12] * instr.i[12] * 4,
        releaseInv = 1 / release,
        expDecay = -instr.i[13] / 16,
        arp = instr.i[14],
        arpInterval = rowLen * 2 ** (2 - instr.i[15]);

      var noteBuf = new Int32Array(attack + sustain + release);

      var c1 = 0,
        c2 = 0;

      var j, j2, e, t, rsample, o1t, o2t;

      for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
        if (j2 >= 0) {
          arp = (arp >> 8) | ((arp & 255) << 4);
          j2 -= arpInterval;

          o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
          o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
        }

        e = 1;
        if (j < attack) {
          e = j / attack;
        } else if (j >= attack + sustain) {
          e = (j - attack - sustain) * releaseInv;
          e = (1 - e) * 3 ** (expDecay * e);
        }

        c1 += o1t * e ** o1xenv;
        rsample = osc1(c1) * o1vol;

        c2 += o2t * e ** o2xenv;
        rsample += osc2(c2) * o2vol;

        if (noiseVol) {
          rsample += (2 * Math.random() - 1) * noiseVol;
        }

        noteBuf[j] = (80 * rsample * e) | 0;
      }

      return noteBuf;
    };

    var mOscillators = [osc_sin, osc_square, osc_saw, osc_tri];

    var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;

    this.init = function (song) {
      mSong = song;

      mLastRow = song.endPattern;
      mCurrentCol = 0;

      mNumWords = song.rowLen * song.patternLen * (mLastRow + 1) * 2;

      mMixBuf = new Int32Array(mNumWords);
    };

    this.generate = function () {
      var i, j, b, p, row, col, n, cp, k, t, lfor, e, x, rsample, rowStartSample, f, da;

      var chnBuf = new Int32Array(mNumWords),
        instr = mSong.songData[mCurrentCol],
        rowLen = mSong.rowLen,
        patternLen = mSong.patternLen;

      var low = 0,
        band = 0,
        high;
      var lsample,
        filterActive = false;

      var noteCache = [];

      for (p = 0; p <= mLastRow; ++p) {
        cp = instr.p[p];

        for (row = 0; row < patternLen; ++row) {
          var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
          if (cmdNo) {
            instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

            if (cmdNo < 17) {
              noteCache = [];
            }
          }

          var oscLFO = mOscillators[instr.i[16]],
            lfoAmt = instr.i[17] / 512,
            lfoFreq = 2 ** (instr.i[18] - 9) / rowLen,
            fxLFO = instr.i[19],
            fxFilter = instr.i[20],
            fxFreq = (instr.i[21] * 43.23529 * 3.141592) / 44100,
            q = 1 - instr.i[22] / 255,
            dist = instr.i[23] * 1e-5,
            drive = instr.i[24] / 32,
            panAmt = instr.i[25] / 512,
            panFreq = (6.283184 * 2 ** (instr.i[26] - 9)) / rowLen,
            dlyAmt = instr.i[27] / 255,
            dly = (instr.i[28] * rowLen) & ~1;
          rowStartSample = (p * patternLen + row) * rowLen;

          for (col = 0; col < 4; ++col) {
            n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
            if (n) {
              if (!noteCache[n]) {
                noteCache[n] = createNote(instr, n, rowLen);
              }

              var noteBuf = noteCache[n];
              for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                chnBuf[i] += noteBuf[j];
              }
            }
          }

          for (j = 0; j < rowLen; j++) {
            k = (rowStartSample + j) * 2;
            rsample = chnBuf[k];

            if (rsample || filterActive) {
              f = fxFreq;
              if (fxLFO) {
                f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
              }
              f = 1.5 * Math.sin(f);
              low += f * band;
              high = q * (rsample - band) - low;
              band += f * high;
              rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

              if (dist) {
                rsample *= dist;
                rsample = rsample < 1 ? (rsample > -1 ? osc_sin(rsample * 0.25) : -1) : 1;
                rsample /= dist;
              }

              rsample *= drive;

              filterActive = rsample * rsample > 1e-5;

              t = Math.sin(panFreq * k) * panAmt + 0.5;
              lsample = rsample * (1 - t);
              rsample *= t;
            } else {
              lsample = 0;
            }

            if (k >= dly) {
              lsample += chnBuf[k - dly + 1] * dlyAmt;

              rsample += chnBuf[k - dly] * dlyAmt;
            }

            chnBuf[k] = lsample | 0;
            chnBuf[k + 1] = rsample | 0;

            mMixBuf[k] += lsample | 0;
            mMixBuf[k + 1] += rsample | 0;
          }
        }
      }

      mCurrentCol++;
      return mCurrentCol / mSong.numChannels;
    };

    this.createWave = function () {
      var headerLen = 44;
      var l1 = headerLen + mNumWords * 2 - 8;
      var l2 = l1 - 36;
      var wave = new Uint8Array(headerLen + mNumWords * 2);
      wave.set([
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

      for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
        var y = mMixBuf[i];
        y = y < -32767 ? -32767 : y > 32767 ? 32767 : y;
        wave[idx++] = y & 255;
        wave[idx++] = (y >> 8) & 255;
      }

      return wave;
    };
  }
}

const playSound = (song, loop = false) => {
  const cplayer = new CPlayer();
  cplayer.init(song);
  cplayer.generate();
  const wave = cplayer.createWave();
  const audio = document.createElement('audio');
  audio.src = URL.createObjectURL(new Blob([wave], { type: 'audio/wav' }));
  audio.play();
  if (loop) audio.onended = () => audio.play();
};

const bg = {
  songData: [
    {
      i: [
        2, 192, 128, 0, 2, 192, 140, 18, 0, 0, 158, 119, 158, 0, 0, 0, 0, 0, 0, 0, 2, 5, 0, 0, 128,
        0, 0, 24, 8,
      ],
      p: [1],
      c: [{ n: [108, , , , , , , , 116, , , , , , , , , , , , 101], f: [] }],
    },
  ],
  rowLen: 22050,
  patternLen: 32,
  endPattern: 0,
  numChannels: 1,
};

playSound(bg, true);

const arrowSound = {
  songData: [
    {
      i: [
        3, 0, 128, 0, 0, 55, 128, 0, 64, 36, 19, 5, 47, 87, 0, 0, 1, 55, 7, 0, 2, 67, 115, 124, 255,
        67, 6, 39, 1,
      ],
      p: [1],
      c: [{ n: [146], f: [] }],
    },
  ],
  rowLen: 5513,
  patternLen: 10,
  endPattern: 0,
  numChannels: 1,
};

const killSound = {
  songData: [
    {
      i: [
        0, 255, 116, 64, 0, 255, 120, 0, 64, 255, 31, 6, 73, 0, 0, 0, 0, 0, 8, 0, 2, 14, 0, 10, 200,
        0, 0, 0, 0,
      ],
      p: [1],
      c: [{ n: [122], f: [] }],
    },
  ],
  rowLen: 5513,
  patternLen: 10,
  endPattern: 0,
  numChannels: 1,
};

const shotSound = {
  songData: [
    {
      i: [
        3, 255, 106, 64, 0, 255, 92, 15, 160, 0, 5, 12, 103, 0, 12, 7, 3, 130, 11, 0, 2, 255, 0, 2,
        200, 83, 5, 0, 1,
      ],
      p: [1],
      c: [{ n: [134], f: [] }],
    },
  ],
  rowLen: 5513,
  patternLen: 10,
  endPattern: 0,
  numChannels: 1,
};

const treatSound = {
  songData: [
    {
      i: [
        2, 138, 116, 0, 2, 138, 128, 4, 0, 0, 47, 48, 128, 63, 124, 3, 0, 139, 4, 1, 2, 64, 160, 3,
        128, 147, 4, 0, 5,
      ],
      p: [1],
      c: [{ n: [170], f: [] }],
    },
  ],
  rowLen: 5513,
  patternLen: 10,
  endPattern: 0,
  numChannels: 1,
};

let rooms = [
  {
    // 0
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 1, 0, 200],
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
      [1, 'N', ' D', 2, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 0, 0, 1000],
      [2, 'S'],
      [5, 'W'],
    ],
    enemies: [{ x: 0, y: -400, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 2
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 3, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 1, 0, 1000],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 3
    walls: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 4, -400, 600],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 7, 400, 600],
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
      [1, 'N', ' D', 5, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 3, 400, 600],
      [2, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 5
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 6, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 4, 0, 1000],
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
      [1, 'S', ' D', 5, 0, 1000],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 10, 400, 600],
      [2, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 7
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 8, 0, 200],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 3, -400, 600],
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
      [1, 'N', ' D', 9, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 7, 0, 1000],
      [2, 'S'],
      [5, 'W'],
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
      [1, 'E', ' D', 10, -400, 600],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 8, 0, 1000],
      [2, 'S'],
      [5, 'W'],
    ],
    enemies: [{ x: 0, y: 0, hp: 100, speed: 5, strength: 1, t: 'D' }],
  },
  {
    // 10
    walls: [
      [2, 'N'],
      [1, 'N', ' D G', 11, 0, 200],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 6, -400, 600],
      [2, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 9, 400, 600],
      [2, 'W'],
    ],
  },
  {
    // 11
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 12, 0, 100],
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
      [1, 'N', ' D', 13, 0, 200],
      [3, 'N'],
      [3, 'E'],
      [3, 'E'],
      [3, 'S'],
      [1, 'S', ' D', 11, 0, 1000],
      [3, 'S'],
      [3, 'W'],
      [3, 'W'],
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
      [1, 'N', ' D G', 14, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 12, 0, 1100],
      [2, 'S'],
      [5, 'W'],
    ],
  },
  {
    // 14
    walls: [
      [5, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 15, -400, 600],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 18, 400, 600],
      [2, 'W'],
    ],
  },
  {
    // 15
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 16, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 14, 400, 600],
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
      [1, 'N', ' D', 17, 0, 200],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 15, 0, 1000],
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
      [1, 'S', ' D', 16, 0, 1000],
      [2, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 21, 400, 600],
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
      [1, 'N', ' D', 19, 0, 200],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 14, -400, 600],
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
      [1, 'N', ' D', 20, 0, 200],
      [5, 'N'],
      [5, 'E'],
      [5, 'S'],
      [1, 'S', ' D', 18, 0, 1000],
      [2, 'S'],
      [5, 'W'],
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
      [1, 'E', ' D', 21, -400, 600],
      [2, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 19, 0, 1000],
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
      [1, 'N', ' D G', 22, 0, 200],
      [2, 'N'],
      [2, 'E'],
      [1, 'E', ' D', 17, -400, 600],
      [2, 'E'],
      [5, 'S'],
      [2, 'W'],
      [1, 'W', ' D', 20, 400, 600],
      [2, 'W'],
    ],
  },
  {
    // 22
    walls: [
      [2, 'N'],
      [1, 'N', ' D', 23, 0, 100],
      [2, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D G C'],
      [2, 'S'],
      [1, 'W'],
      [1, 'W', ' D R', 25, 0, 600],
      [3, 'W'],
    ],
  },
  {
    // 23
    start: [3.5, 3],
    walls: [
      [3, 'N'],
      [1, 'N', ' D', 24, 0, 200],
      [3, 'N'],
      [3, 'E'],
      [3, 'E'],
      [3, 'S'],
      [1, 'S', ' D', 22, 0, 1000],
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
      [5, 'N'],
      [5, 'E'],
      [2, 'S'],
      [1, 'S', ' D', 23, 0, 1100],
      [2, 'S'],
      [5, 'W'],
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
      [7, 'N'],
      [7, 'E'],
      [7, 'S'],
      [7, 'W'],
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

const calcDist = obj => {
  const distX = (Math.abs(player.posX - obj.x) - 90) / 200;
  const distY = (Math.abs(600 - player.posY - obj.y) - 90) / 200;
  return Math.max(distX * distX + distY * distY, 1);
};
const MAX_HP = {
  D: 100,
  B: 400,
  V: 2000,
};
const S = {
  D: 1,
  B: 10,
  V: 0,
};
const shotMe = obj => {
  playSound(shotSound);
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
    playSound(killSound);
  }, dist * 100);
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
  const jumpI =
    obj.j &&
    setInterval(() => {
      obj.x = -obj.x;
      obj.y = -obj.y;
    }, 15000);

  let shotI;
  const shotT = setTimeout(() => {
    shotMe(obj);
    shotI = setInterval(() => {
      shotMe(obj);
    }, 3000);
  }, 3000 - d * 1000);

  elem.addEventListener('click', () => {
    if (player.a <= 0) return;
    const dist = Math.max(calcDist(obj), 1);
    obj.hp -= player.s / dist;
    elem.style.setProperty('--hp', `${(50 * obj.hp) / MAX_HP[obj.t]}px`);
    if (obj.hp <= 0) {
      obj.stop();
      player.s += S[obj.t];
      elem.parentNode.removeChild(elem);
      playSound(killSound);

      if (obj.t === 'V') handleWin();
    }
  });

  obj.stop = () => {
    clearInterval(shotT);
    clearInterval(shotI);
    clearInterval(moveI);
    if (obj.j) clearInterval(jumpI);
  };

  return { elem, obj };
};

const createTreat = obj => {
  const elem = document.createElement('div');
  elem.className = `t ${obj.t}`;

  elem.style.setProperty('--x', `${obj.x}px`);
  elem.style.setProperty('--y', `${obj.y}px`);

  return { elem, obj };
};

let walls = [];
let wallsH = [];
let wallsV = [];
let enemies = [];
let treats = [];

const P_X = 0;
const P_Y = 200;

const controller = {
  shift: {
    pressed: false,
  },
  arrowleft: {
    pressed: false,
    action: () => {
      player.rot -= 0.04;
    },
    shiftAction: () => {
      player.moveDistV(-1, Math.cos);
      player.moveDistH(1, Math.sin);
    },
  },
  arrowright: {
    pressed: false,
    action: () => (player.rot += 0.04),
    shiftAction: () => {
      player.moveDistV(1, Math.cos);
      player.moveDistH(-1, Math.sin);
    },
  },
  arrowup: {
    pressed: false,
    action: () => {
      player.moveDistV(1, Math.sin);
      player.moveDistH(1, Math.cos);
    },
  },
  arrowdown: {
    pressed: false,
    action: () => {
      player.moveDistV(-1, Math.sin);
      player.moveDistH(-1, Math.cos);
    },
  },
};
controller.a = { ...controller.arrowleft };
controller.d = { ...controller.arrowright };
controller.w = { ...controller.arrowup };
controller.s = { ...controller.arrowdown };

const player = {
  rot: 0,
  _hp: 100,
  _s: 10,
  _a: 20,
  posX: P_X,
  posY: P_Y,
  block: false,

  get hp() {
    return this._hp;
  },
  set hp(_hp) {
    if (_hp <= 0) handleLose();
    this._hp = Math.max(Math.min(100, _hp), 0);
    document.getElementById('h').style.setProperty('--w', `${this._hp}%`);
  },

  get s() {
    return this._s;
  },
  set s(_s) {
    document.getElementById('s').innerText = _s;
    this._s = _s;
  },

  get a() {
    return this._a;
  },
  set a(_a) {
    if (_a < 0 || player.block) return;
    playSound(arrowSound);
    document.getElementById('a').innerText = _a;
    this._a = _a;
  },

  moveDistH: (t, tg) => {
    const dist = t * 10 * tg(player.rot);
    for (let i = 0; i < wallsH.length; i++) {
      const wall = wallsH[i];

      const pY = player.posY - 600;
      if (Math.abs(pY - +wall.dataset.y + dist) > 50) continue;

      const isS = wall.classList.contains('S');
      const isD = wall.classList.contains('D') && !wall.classList.contains('C');
      const pX = (player.posX + +wall.dataset.x) * (isS ? -1 : 1);

      if (pX > -50 && +wall.dataset.w - pX > -50) {
        if (isD) {
          player.posX = +wall.dataset.px;
          player.posY = +wall.dataset.py;
          createRoom(rooms[+wall.dataset.r]);
        }
        return;
      }
    }

    player.posY += dist;
  },
  moveDistV: (t, tg) => {
    const dist = t * 10 * tg(player.rot);
    for (let i = 0; i < wallsV.length; i++) {
      const wall = wallsV[i];

      if (Math.abs(player.posX + +wall.dataset.x + dist) > 50) continue;

      const isE = wall.classList.contains('E');
      const isD = wall.classList.contains('D') && !wall.classList.contains('C');
      const pY = (player.posY - 600 - +wall.dataset.y) * (isE ? -1 : 1);

      if (pY > -50 && +wall.dataset.w - pY > -50) {
        if (isD) {
          player.posX = +wall.dataset.px;
          player.posY = +wall.dataset.py;
          createRoom(rooms[+wall.dataset.r]);
        }
        return;
      }
    }

    player.posX += dist;
  },
};

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'escape') resetGame();
  if (controller[key]) {
    controller[key].pressed = true;
  }
});

document.addEventListener('keyup', event => {
  const key = event.key.toLowerCase();
  if (controller[key]) {
    controller[key].pressed = false;
  }
});

const executeMoves = () => {
  if (player.block) return;
  Object.keys(controller).forEach(key => {
    controller[key].pressed &&
      ((controller['shift'].pressed && controller[key].shiftAction) || controller[key].action)?.();
  });
  document.documentElement.style.setProperty('--rot', `${player.rot}rad`);
  document.documentElement.style.setProperty('--posX', `${player.posX}px`);
  document.documentElement.style.setProperty('--posY', `${player.posY}px`);
};

const calculateShadow = () => {
  walls.forEach(element => {
    let pXL = (pYR = player.posX + +element.dataset.x);
    let pYL = (pXR = player.posY - 600 - +element.dataset.y);
    const w = +element.dataset.w;
    switch (element.classList[1]) {
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
    const alphaL = Math.min(1, Math.sqrt(pXL * pXL + pYL * pYL) / 1500);
    const alphaR = Math.min(1, Math.sqrt(pXR * pXR + pYR * pYR) / 1500);
    element.style.setProperty('--sAL', alphaR);
    element.style.setProperty('--sAR', alphaL);
  });
};

const executeEnemyMoves = () => {
  enemies.forEach(({ obj, elem }) => {
    elem.style.setProperty('--x', `${obj.x}px`);
    elem.style.setProperty('--y', `${obj.y}px`);
  });
};

const getTreat = () => {
  treats = treats.filter(({ obj, elem }) => {
    const distX = player.posX - obj.x;
    const distY = 600 - player.posY - obj.y;
    if (Math.abs(distX) < 50 && Math.abs(distY) < 50) {
      switch (obj.t) {
        case 'A':
          player.a += 10;
          break;
        case 'F':
          if (player.hp >= 100) return true;
          player.hp += 10;
          break;
      }
      obj.g = true;
      elem.parentNode.removeChild(elem);
      playSound(treatSound);

      return false;
    }
    return true;
  });
};

const animate = () => {
  executeMoves();
  calculateShadow();
  executeEnemyMoves();
  getTreat();
  window.requestAnimationFrame(animate);
};
window.requestAnimationFrame(animate);

const createRoom = room => {
  document.getElementById('g').innerHTML = '';
  walls = [];
  wallsH = [];
  wallsV = [];
  treats = [];
  enemies = enemies.filter(enemy => {
    enemy.obj.stop();
    return false;
  });
  const roomElem = document.createElement('div');
  roomElem.className = 'r';

  let mh = (mw = mx = my = -Infinity);
  let [x, y] = room.start || [2.5, 2.5];

  let h = (w = 0);
  room.walls.forEach(([len, dir, ...d]) => {
    const wallElem = document.createElement('div');
    wallElem.className = 'w ' + dir + (d[0] || '') + (room.f ? ' F' : '');
    wallElem.dataset.x = x * 200;
    wallElem.dataset.y = y * 200;
    wallElem.dataset.w = len * 200;
    if (d.length === 4) {
      wallElem.dataset.r = d[1];
      wallElem.dataset.px = d[2];
      wallElem.dataset.py = d[3];
    }

    wallElem.style.width = `${len * 200}px`;
    wallElem.style.setProperty('--x', `${x * 200}px`);
    wallElem.style.setProperty('--y', `${y * 200}px`);
    roomElem.appendChild(wallElem);

    switch (dir) {
      case 'N':
        x -= len;
        w += len;
        wallsH.push(wallElem);
        break;
      case 'S':
        x += len;
        wallsH.push(wallElem);
        break;
      case 'E':
        y -= len;
        h += len;
        wallsV.push(wallElem);
        break;
      case 'W':
        y += len;
        wallsV.push(wallElem);
        break;
    }

    mx = Math.max(mx, x);
    my = Math.max(my, y);
  });
  mh = Math.max(mh, h);
  mw = Math.max(mw, w);

  walls = [...wallsH, ...wallsV];

  const floorElem = document.createElement('div');
  floorElem.className = 'f';
  floorElem.style.width = `${mw * 200}px`;
  floorElem.style.height = `${mh * 200}px`;
  floorElem.style.setProperty('--w', `${mw * 200}px`);
  floorElem.style.setProperty('--h', `${mh * 200}px`);
  floorElem.style.setProperty('--x', `${mx * 200}px`);
  floorElem.style.setProperty('--y', `${my * 200}px`);
  roomElem.appendChild(floorElem);

  room.treats?.forEach(treat => {
    if (!treat.g) {
      const cTreat = createTreat(treat);
      treats.push(cTreat);
      roomElem.appendChild(cTreat.elem);
    }
  });
  room.enemies?.forEach(enemy => {
    if (enemy.hp > 0) {
      const cEnemy = createEnemy(enemy);
      enemies.push(cEnemy);
      roomElem.appendChild(cEnemy.elem);
    }
  });

  document.getElementById('g').appendChild(roomElem);
};

createRoom(rooms[0]);

document.addEventListener('click', () => {
  player.a--;
});

const resetGame = () => {
  rooms = JSON.parse(roomsBU);
  player.block = false;
  player.s = 10;
  player.hp = 100;
  player.a = 20;
  player.rot = 0;
  player.posX = P_X;
  player.posY = P_Y;
  document.body.classList = '';
  createRoom(rooms[0]);
};

const handleWin = () => {
  document.body.classList = 'W';
  player.block = true;
};

const handleLose = () => {
  document.body.classList = 'L';
  player.block = true;
};
