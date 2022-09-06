const bg = {
  songData: [
    {
      i: [
        2, 192, 128, 0, 2, 192, 140, 18, 0, 0, 158, 119, 158, 0, 0, 0, 0, 0, 0, 0, 2, 5, 0, 0, 64,
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

playSong(bg, true);

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
