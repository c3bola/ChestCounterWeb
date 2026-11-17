type TilesetCrop = {
  x: number
  y: number
  width: number
  height: number
  scale: number
  offsetX: number
  offsetY: number
}

// MANUAL TILESET ADJUSTMENT: crops are based on each icon's visible bounds in the 1774x887 source.
export const tilesetIcons = {
  chest: { x: 56, y: 31, width: 250, height: 233, scale: 1, offsetX: 0, offsetY: 0 },
  llama: { x: 390, y: 32, width: 179, height: 236, scale: 1, offsetX: 0, offsetY: 0 },
  bus: { x: 658, y: 17, width: 184, height: 264, scale: 1, offsetX: 0, offsetY: 0 },
  trophy: { x: 916, y: 47, width: 214, height: 210, scale: 1, offsetX: 0, offsetY: 0 },
  rifle: { x: 1190, y: 47, width: 255, height: 201, scale: 1, offsetX: 0, offsetY: 0 },
  star: { x: 1491, y: 34, width: 243, height: 227, scale: 1, offsetX: 0, offsetY: 0 },
  chart: { x: 54, y: 302, width: 220, height: 190, scale: 1, offsetX: 0, offsetY: 0 },
  blueprint: { x: 344, y: 295, width: 249, height: 190, scale: 1, offsetX: 0, offsetY: 0 },
  team: { x: 635, y: 306, width: 232, height: 171, scale: 1, offsetX: 0, offsetY: 0 },
  crown: { x: 921, y: 295, width: 222, height: 181, scale: 1, offsetX: 0, offsetY: 0 },
  knight: { x: 1239, y: 281, width: 163, height: 213, scale: 1, offsetX: 0, offsetY: 0 },
  gem: { x: 1504, y: 317, width: 216, height: 165, scale: 1, offsetX: 0, offsetY: 0 },
  gamepad: { x: 42, y: 529, width: 245, height: 162, scale: 1, offsetX: 0, offsetY: 0 },
  calendar: { x: 366, y: 513, width: 197, height: 191, scale: 1, offsetX: 0, offsetY: 0 },
  stopwatch: { x: 649, y: 511, width: 190, height: 193, scale: 1, offsetX: 0, offsetY: 0 },
  target: { x: 933, y: 505, width: 197, height: 197, scale: 1, offsetX: 0, offsetY: 0 },
  layers: { x: 1224, y: 523, width: 202, height: 171, scale: 1, offsetX: 0, offsetY: 0 },
  swords: { x: 1514, y: 516, width: 209, height: 178, scale: 1, offsetX: 0, offsetY: 0 },
  player: { x: 95, y: 712, width: 142, height: 153, scale: 1.08, offsetX: 0, offsetY: 0 },
  addPlayer: { x: 379, y: 726, width: 175, height: 142, scale: 1, offsetX: 0, offsetY: 0 },
  share: { x: 669, y: 736, width: 157, height: 133, scale: 1, offsetX: 0, offsetY: 0 },
  previous: { x: 964, y: 727, width: 138, height: 136, scale: 1, offsetX: 0, offsetY: 0 },
  next: { x: 1244, y: 727, width: 142, height: 136, scale: 1, offsetX: 0, offsetY: 0 },
  network: { x: 1527, y: 721, width: 149, height: 149, scale: 1, offsetX: 0, offsetY: 0 },
} as const satisfies Record<string, TilesetCrop>

export type TilesetIconName = keyof typeof tilesetIcons
