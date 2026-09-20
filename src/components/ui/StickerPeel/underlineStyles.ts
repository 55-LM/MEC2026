/** Hand-drawn marker underline path sets (viewBox 0 0 300 32). */
export type UnderlineStyle =
  | 'single'
  | 'multi'
  | 'double'
  | 'loop'
  | 'scribble'
  | 'cross'
  | 'vee'
  | 'wave'
  | 'zigzag'
  | 'thinLoop';

export interface UnderlinePath {
  d: string;
  strokeWidth?: number;
  opacity?: number;
}

export const UNDERLINE_STYLES: Record<UnderlineStyle, UnderlinePath[]> = {
  /* Soft single marker stroke + light echo */
  single: [
    {
      d: 'M 5 17 C 30 13, 60 19, 95 15 S 150 12, 190 17 S 240 19, 275 14 S 290 15, 295 16',
      strokeWidth: 3.1,
      opacity: 1,
    },
    {
      d: 'M 9 19 C 42 16, 80 20, 120 17 S 175 15, 220 18 S 260 16, 292 18',
      strokeWidth: 1.5,
      opacity: 0.4,
    },
  ],

  /* Overlapping marker strokes */
  multi: [
    {
      d: 'M 6 20 C 45 16, 95 22, 145 17 S 210 15, 270 19 S 290 18, 296 17',
      strokeWidth: 2.7,
      opacity: 0.95,
    },
    {
      d: 'M 9 16 C 50 20, 100 14, 155 18 S 215 20, 275 16 S 292 15, 294 17',
      strokeWidth: 2.3,
      opacity: 0.7,
    },
    {
      d: 'M 12 18 C 58 15, 112 19, 162 16 S 228 17, 280 20 S 290 18, 293 16',
      strokeWidth: 1.9,
      opacity: 0.45,
    },
  ],

  /* Two soft parallel strokes */
  double: [
    {
      d: 'M 7 12 C 50 10, 110 14, 170 11 S 240 9, 293 13',
      strokeWidth: 2.3,
      opacity: 1,
    },
    {
      d: 'M 10 13 C 55 12, 115 15, 175 12 S 245 11, 290 14',
      strokeWidth: 1.15,
      opacity: 0.38,
    },
    {
      d: 'M 9 22 C 55 20, 120 24, 180 20 S 250 19, 292 23',
      strokeWidth: 2.2,
      opacity: 0.9,
    },
    {
      d: 'M 12 23 C 60 22, 125 25, 185 21 S 255 20, 288 22',
      strokeWidth: 1.1,
      opacity: 0.32,
    },
  ],

  /* Soft elongated loop */
  loop: [
    {
      d: 'M 22 15 C 50 8, 120 6, 180 7 S 260 9, 284 14 C 292 18, 284 24, 248 25 S 90 26, 36 22 C 16 20, 14 17, 22 15',
      strokeWidth: 2.2,
      opacity: 1,
    },
    {
      d: 'M 28 16 C 58 10, 128 9, 188 10 S 255 11, 276 15',
      strokeWidth: 1.15,
      opacity: 0.38,
    },
  ],

  /* Soft back-and-forth scribble */
  scribble: [
    {
      d: 'M 6 21 L 292 19 L 12 16 L 288 15 L 14 14 L 286 17 L 16 19 L 284 20',
      strokeWidth: 2.7,
      opacity: 0.9,
    },
    {
      d: 'M 10 19 L 286 17 L 18 15 L 284 16 L 22 20 L 280 18',
      strokeWidth: 2,
      opacity: 0.48,
    },
  ],

  /* Thin elongated loop */
  thinLoop: [
    {
      d: 'M 18 15 C 55 9, 130 8, 200 9 S 270 11, 286 14 C 292 17, 280 21, 230 22 S 70 22, 28 19 C 14 17, 12 16, 18 15',
      strokeWidth: 1.7,
      opacity: 1,
    },
  ],

  /* Soft crossed strokes */
  cross: [
    {
      d: 'M 8 11 C 70 14, 150 17, 292 21',
      strokeWidth: 2.3,
      opacity: 1,
    },
    {
      d: 'M 11 12 C 80 15, 160 17, 288 20',
      strokeWidth: 1.15,
      opacity: 0.38,
    },
    {
      d: 'M 10 22 C 80 19, 160 15, 292 11',
      strokeWidth: 2.3,
      opacity: 0.92,
    },
    {
      d: 'M 14 21 C 90 18, 170 15, 290 12',
      strokeWidth: 1.1,
      opacity: 0.32,
    },
  ],

  /* Soft meeting V */
  vee: [
    {
      d: 'M 6 12 C 60 14, 120 16, 155 18',
      strokeWidth: 2.35,
      opacity: 1,
    },
    {
      d: 'M 9 13 C 65 15, 125 17, 152 18',
      strokeWidth: 1.15,
      opacity: 0.38,
    },
    {
      d: 'M 294 12 C 240 14, 180 16, 145 18',
      strokeWidth: 2.35,
      opacity: 0.92,
    },
    {
      d: 'M 291 13 C 235 15, 175 17, 148 18',
      strokeWidth: 1.15,
      opacity: 0.32,
    },
  ],

  /* Soft wavy hills */
  wave: [
    {
      d: 'M 0 16 C 12 9, 26 9, 38 16 S 62 23, 76 16 S 100 9, 114 16 S 138 23, 152 16 S 176 9, 190 16 S 214 23, 228 16 S 252 9, 266 16 S 286 11, 300 15',
      strokeWidth: 2.45,
      opacity: 1,
    },
    {
      d: 'M 0 17 C 14 11, 28 11, 40 17 S 64 23, 78 17 S 102 11, 116 17 S 140 23, 154 17 S 178 11, 192 17 S 216 23, 230 17 S 254 11, 268 17 S 288 13, 300 16',
      strokeWidth: 1.25,
      opacity: 0.38,
    },
  ],

  /* Soft zigzag */
  zigzag: [
    {
      d: 'M 5 16 L 20 10 L 36 19 L 52 9 L 68 20 L 85 9 L 102 20 L 118 11 L 135 19 L 152 9 L 168 20 L 185 10 L 202 18 L 218 9 L 235 20 L 252 11 L 268 17 L 284 10 L 296 15',
      strokeWidth: 2.2,
      opacity: 1,
    },
    {
      d: 'M 8 17 L 22 12 L 38 18 L 54 11 L 70 19 L 87 11 L 104 19 L 120 13 L 137 18 L 154 11 L 170 19 L 187 12 L 204 17 L 220 11 L 237 19 L 254 13 L 270 16 L 286 12 L 294 16',
      strokeWidth: 1.15,
      opacity: 0.38,
    },
  ],
};
