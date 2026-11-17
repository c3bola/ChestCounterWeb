export type PlayerAnalyticsSummary = {
  player_id: number
  epic_id: string | null
  display_name: string | null
  matches_played: number
  wins: number | null
  kills: number | null
  team_kills: number | null
  average_placement: number | null
  container_interactions_observed: number
  classified_container_interactions: number
  unclassified_container_interactions: number
  ammo_boxes_observed: number
  food_boxes_observed: number
  other_containers_observed: number
  destroyed_containers_observed: number
  treasure_events_observed: number
  average_interactions_per_covered_match: number | null
  average_chests_per_covered_match: number | null
  record_interactions_in_match: number | null
  record_chests_in_match: number | null
  matches_with_container_coverage: number
  first_match_at: string | null
  last_match_at: string | null
  container_categories: PlayerContainerCategory[]
  playlists: PlayerAnalyticsPlaylist[]
  daily_history: PlayerAnalyticsDaily[]
}

export type PlayerContainerCategory = {
  category: string
  observed_interactions: number
  percentage: number
}

export type PlayerAnalyticsPlaylist = {
  playlist: string | null
  matches_played: number
  interactions_observed: number
  chests_observed: number
  matches_with_container_coverage: number
  average_interactions_per_covered_match: number | null
  average_chests_per_covered_match: number | null
  record_interactions_in_match: number | null
  record_chests_in_match: number | null
  wins: number | null
}

export type PlayerAnalyticsDaily = {
  date: string
  matches_played: number
  matches_with_container_coverage: number
  container_interactions_observed: number | null
  chests_observed: number | null
  treasure_events_observed: number
}

export type PlayerAnalyticsHistoryItem = {
  match_id: number
  match_player_id: number
  match_start_at: string | null
  playlist: string | null
  map_info: string | null
  placement: number | null
  kills: number | null
  team_kills: number | null
  total_players: number | null
  container_interactions_observed: number
  classified_container_interactions: number
  destroyed_containers_observed: number
  treasure_events_observed: number
  container_data_covered: boolean
}

export type PlayerTeammate = {
  player_id: number
  epic_id: string | null
  display_name: string | null
  matches_together: number
  last_shared_match_at: string | null
}

export type PlayerTreasureEvent = {
  id: number
  match_id: number
  match_start_at: string | null
  playlist: string | null
  prize_id: string | null
  source_container: string | null
  time_seconds: number | null
  player_name: string | null
  classification: 'unclassified'
  player_attribution: 'direct'
}

export type PlayerAnalyticsPage<T> = {
  items: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://api.fortcards.me/api/v1/'
).replace(/\/+$/, '')

function record(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser um objeto.`)
  }
  return value as Record<string, unknown>
}

function integer(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser um inteiro seguro.`)
  }
  return value
}

function nullableInteger(value: unknown, context: string): number | null {
  return value === null ? null : integer(value, context)
}

function nullableNumber(value: unknown, context: string): number | null {
  if (value === null) return null
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser numérico ou nulo.`)
  }
  return value
}

function nullableString(value: unknown, context: string): string | null {
  if (value === null) return null
  if (typeof value !== 'string') {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser texto ou nulo.`)
  }
  return value
}

function list<T>(value: unknown, context: string, decode: (item: unknown, context: string) => T): T[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser uma lista.`)
  }
  return value.map((item, index) => decode(item, `${context}[${index}]`))
}

function decodeCategory(value: unknown, context: string): PlayerContainerCategory {
  const item = record(value, context)
  const percentage = item.percentage
  if (typeof percentage !== 'number' || !Number.isFinite(percentage)) {
    throw new TypeError(`Resposta inválida da API: ${context}.percentage deve ser numérico.`)
  }
  return {
    category: requiredString(item.category, `${context}.category`),
    observed_interactions: integer(item.observed_interactions, `${context}.observed_interactions`),
    percentage,
  }
}

function requiredString(value: unknown, context: string): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser texto.`)
  }
  return value
}

function decodePlaylist(value: unknown, context: string): PlayerAnalyticsPlaylist {
  const item = record(value, context)
  return {
    playlist: nullableString(item.playlist, `${context}.playlist`),
    matches_played: integer(item.matches_played, `${context}.matches_played`),
    interactions_observed: integer(item.interactions_observed, `${context}.interactions_observed`),
    chests_observed: integer(item.chests_observed, `${context}.chests_observed`),
    matches_with_container_coverage: integer(item.matches_with_container_coverage, `${context}.matches_with_container_coverage`),
    average_interactions_per_covered_match: nullableNumber(item.average_interactions_per_covered_match, `${context}.average_interactions_per_covered_match`),
    average_chests_per_covered_match: nullableNumber(item.average_chests_per_covered_match, `${context}.average_chests_per_covered_match`),
    record_interactions_in_match: nullableInteger(item.record_interactions_in_match, `${context}.record_interactions_in_match`),
    record_chests_in_match: nullableInteger(item.record_chests_in_match, `${context}.record_chests_in_match`),
    wins: nullableInteger(item.wins, `${context}.wins`),
  }
}

function decodeDaily(value: unknown, context: string): PlayerAnalyticsDaily {
  const item = record(value, context)
  return {
    date: requiredString(item.date, `${context}.date`),
    matches_played: integer(item.matches_played, `${context}.matches_played`),
    matches_with_container_coverage: integer(item.matches_with_container_coverage, `${context}.matches_with_container_coverage`),
    container_interactions_observed: nullableInteger(item.container_interactions_observed, `${context}.container_interactions_observed`),
    chests_observed: nullableInteger(item.chests_observed, `${context}.chests_observed`),
    treasure_events_observed: integer(item.treasure_events_observed, `${context}.treasure_events_observed`),
  }
}

function decodeSummary(value: unknown): PlayerAnalyticsSummary {
  const item = record(value, 'playerAnalyticsSummary')
  return {
    player_id: integer(item.player_id, 'playerAnalyticsSummary.player_id'),
    epic_id: nullableString(item.epic_id, 'playerAnalyticsSummary.epic_id'),
    display_name: nullableString(item.display_name, 'playerAnalyticsSummary.display_name'),
    matches_played: integer(item.matches_played, 'playerAnalyticsSummary.matches_played'),
    wins: nullableInteger(item.wins, 'playerAnalyticsSummary.wins'),
    kills: nullableInteger(item.kills, 'playerAnalyticsSummary.kills'),
    team_kills: nullableInteger(item.team_kills, 'playerAnalyticsSummary.team_kills'),
    average_placement: nullableNumber(item.average_placement, 'playerAnalyticsSummary.average_placement'),
    container_interactions_observed: integer(item.container_interactions_observed, 'playerAnalyticsSummary.container_interactions_observed'),
    classified_container_interactions: integer(item.classified_container_interactions, 'playerAnalyticsSummary.classified_container_interactions'),
    unclassified_container_interactions: integer(item.unclassified_container_interactions, 'playerAnalyticsSummary.unclassified_container_interactions'),
    ammo_boxes_observed: integer(item.ammo_boxes_observed, 'playerAnalyticsSummary.ammo_boxes_observed'),
    food_boxes_observed: integer(item.food_boxes_observed, 'playerAnalyticsSummary.food_boxes_observed'),
    other_containers_observed: integer(item.other_containers_observed, 'playerAnalyticsSummary.other_containers_observed'),
    destroyed_containers_observed: integer(item.destroyed_containers_observed, 'playerAnalyticsSummary.destroyed_containers_observed'),
    treasure_events_observed: integer(item.treasure_events_observed, 'playerAnalyticsSummary.treasure_events_observed'),
    average_interactions_per_covered_match: nullableNumber(item.average_interactions_per_covered_match, 'playerAnalyticsSummary.average_interactions_per_covered_match'),
    average_chests_per_covered_match: nullableNumber(item.average_chests_per_covered_match, 'playerAnalyticsSummary.average_chests_per_covered_match'),
    record_interactions_in_match: nullableInteger(item.record_interactions_in_match, 'playerAnalyticsSummary.record_interactions_in_match'),
    record_chests_in_match: nullableInteger(item.record_chests_in_match, 'playerAnalyticsSummary.record_chests_in_match'),
    matches_with_container_coverage: integer(item.matches_with_container_coverage, 'playerAnalyticsSummary.matches_with_container_coverage'),
    first_match_at: nullableString(item.first_match_at, 'playerAnalyticsSummary.first_match_at'),
    last_match_at: nullableString(item.last_match_at, 'playerAnalyticsSummary.last_match_at'),
    container_categories: list(item.container_categories, 'container_categories', decodeCategory),
    playlists: list(item.playlists, 'playlists', decodePlaylist),
    daily_history: list(item.daily_history, 'daily_history', decodeDaily),
  }
}

function decodeHistoryItem(value: unknown, context: string): PlayerAnalyticsHistoryItem {
  const item = record(value, context)
  if (typeof item.container_data_covered !== 'boolean') {
    throw new TypeError(`Resposta inválida da API: ${context}.container_data_covered deve ser booleano.`)
  }
  return {
    match_id: integer(item.match_id, `${context}.match_id`),
    match_player_id: integer(item.match_player_id, `${context}.match_player_id`),
    match_start_at: nullableString(item.match_start_at, `${context}.match_start_at`),
    playlist: nullableString(item.playlist, `${context}.playlist`),
    map_info: nullableString(item.map_info, `${context}.map_info`),
    placement: nullableInteger(item.placement, `${context}.placement`),
    kills: nullableInteger(item.kills, `${context}.kills`),
    team_kills: nullableInteger(item.team_kills, `${context}.team_kills`),
    total_players: nullableInteger(item.total_players, `${context}.total_players`),
    container_interactions_observed: integer(item.container_interactions_observed, `${context}.container_interactions_observed`),
    classified_container_interactions: integer(item.classified_container_interactions, `${context}.classified_container_interactions`),
    destroyed_containers_observed: integer(item.destroyed_containers_observed, `${context}.destroyed_containers_observed`),
    treasure_events_observed: integer(item.treasure_events_observed, `${context}.treasure_events_observed`),
    container_data_covered: item.container_data_covered,
  }
}

function decodeTeammate(value: unknown, context: string): PlayerTeammate {
  const item = record(value, context)
  return {
    player_id: integer(item.player_id, `${context}.player_id`),
    epic_id: nullableString(item.epic_id, `${context}.epic_id`),
    display_name: nullableString(item.display_name, `${context}.display_name`),
    matches_together: integer(item.matches_together, `${context}.matches_together`),
    last_shared_match_at: nullableString(item.last_shared_match_at, `${context}.last_shared_match_at`),
  }
}

function decodeTreasure(value: unknown, context: string): PlayerTreasureEvent {
  const item = record(value, context)
  if (item.classification !== 'unclassified' || item.player_attribution !== 'direct') {
    throw new TypeError(`Resposta inválida da API: ${context} contém uma classificação desconhecida.`)
  }
  return {
    id: integer(item.id, `${context}.id`),
    match_id: integer(item.match_id, `${context}.match_id`),
    match_start_at: nullableString(item.match_start_at, `${context}.match_start_at`),
    playlist: nullableString(item.playlist, `${context}.playlist`),
    prize_id: nullableString(item.prize_id, `${context}.prize_id`),
    source_container: nullableString(item.source_container, `${context}.source_container`),
    time_seconds: nullableNumber(item.time_seconds, `${context}.time_seconds`),
    player_name: nullableString(item.player_name, `${context}.player_name`),
    classification: 'unclassified',
    player_attribution: 'direct',
  }
}

async function requestJson(endpoint: string): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, { headers: { Accept: 'application/json' } })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Falha de comunicação com a API em ${endpoint}: ${detail}`)
  }
  if (!response.ok) {
    throw new Error(`Falha HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''} em ${endpoint}.`)
  }
  return response.json()
}

async function requestData(endpoint: string): Promise<unknown> {
  const envelope = record(await requestJson(endpoint), 'response')
  if (envelope.success !== true) {
    throw new TypeError('Resposta inválida da API: success deve ser true.')
  }
  return envelope.data
}

function playerPath(playerId: number, section: string, page?: number): string {
  if (!Number.isSafeInteger(playerId) || playerId < 1) {
    throw new RangeError('O identificador do jogador deve ser um inteiro positivo.')
  }
  const params = new URLSearchParams()
  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) {
      throw new RangeError('A página deve ser um inteiro entre 1 e 1.000.000.')
    }
    params.set('page', String(page))
    params.set('page_size', '10')
  }
  const query = params.toString()
  return `/analytics/players/${playerId}/${section}${query ? `?${query}` : ''}`
}

export async function getPlayerAnalyticsSummary(playerId: number): Promise<PlayerAnalyticsSummary> {
  return decodeSummary(await requestData(playerPath(playerId, 'summary')))
}

async function getPlayerAnalyticsPage<T>(
  playerId: number,
  section: 'history' | 'teammates' | 'treasures',
  page: number,
  decode: (item: unknown, context: string) => T,
): Promise<PlayerAnalyticsPage<T>> {
  const envelope = record(await requestJson(playerPath(playerId, section, page)), `${section}Response`)
  if (envelope.success !== true) {
    throw new TypeError(`Resposta inválida da API: ${section}Response.success deve ser true.`)
  }
  const pagination = record(envelope.pagination, `${section}Response.pagination`)
  return {
    items: list(envelope.data, `${section}Response.data`, decode),
    page: integer(pagination.page, `${section}Response.pagination.page`),
    page_size: integer(pagination.page_size, `${section}Response.pagination.page_size`),
    total: integer(pagination.total, `${section}Response.pagination.total`),
    total_pages: integer(pagination.total_pages, `${section}Response.pagination.total_pages`),
  }
}

export function getPlayerAnalyticsHistory(playerId: number, page: number) {
  return getPlayerAnalyticsPage(playerId, 'history', page, decodeHistoryItem)
}

export function getPlayerAnalyticsTeammates(playerId: number, page: number) {
  return getPlayerAnalyticsPage(playerId, 'teammates', page, decodeTeammate)
}

export function getPlayerAnalyticsTreasures(playerId: number, page: number) {
  return getPlayerAnalyticsPage(playerId, 'treasures', page, decodeTreasure)
}
