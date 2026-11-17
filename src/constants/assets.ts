const imagePath = `${import.meta.env.BASE_URL}assets/image/`
const dataPath = `${import.meta.env.BASE_URL}assets/data/`

export const assets = {
  background: `${imagePath}background.webp`,
  blueLineTop: `${imagePath}blue-line-top.webp`,
  footerBoat: `${imagePath}footer-boat.webp`,
  footerClouds: `${imagePath}footer-clouds.webp`,
  footerOcean: `${imagePath}footer-ocean.png`,
  footerOcean2: `${imagePath}footer-ocean-2.webp`, 
  footerBackground: `${imagePath}footer-background.png`, 
  iconsTileset: `${imagePath}icons_tileset.webp`,
  hallFame: `${imagePath}hall_fama.png`,
  headerHome: `${imagePath}header_home.jpg`,
  headerRanking: `${imagePath}ranking.jpg`,
  headerStatistics: `${imagePath}header_estatisticas.jpg`,
  headerPlayers: `${imagePath}header_player.jpg`,
  logo: `${imagePath}logo.png`,
  cosmeticsCatalog: `${dataPath}cosmetics.json`,
} as const