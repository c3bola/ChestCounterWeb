const playlistLabels: Record<string, string> = {
  Playlist_NoBuildBR_Squad: 'Trocação esquadrões',
  Playlist_NoBuildBR_Trio: 'Trocação trios',
  Playlist_NoBuildBR_Duo: 'Trocação duplas',
}

export function playlistLabel(playlist: string | null): string {
  if (playlist === null) return 'Não informada'
  return playlistLabels[playlist] ?? playlist.replace(/[_-]+/g, ' ')
}
