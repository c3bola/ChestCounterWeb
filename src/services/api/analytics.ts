export type AnalyticsScreenTotals = {
  identified_players: number
  matches_recorded: number
  container_interactions_observed: number
  treasure_events_observed: number
}

export type AnalyticsScreenPlayer = {
  position: number
  player_id: number
  display_name: string | null
  matches_played: number
  container_interactions_observed: number
  treasure_events_observed: number
}

export type AnalyticsHomeEventType =
  | 'container_interaction'
  | 'treasure_event'
  | 'prize_handler_grant'

export type AnalyticsHomeActivity = {
  id: string
  event_type: AnalyticsHomeEventType
  player_id: number | null
  player_name: string | null
  match_id: number
  observed_value: string | null
  received_at: string
  event_time_seconds: number | null
  description: string
}

export type AnalyticsHome = {
  totals: AnalyticsScreenTotals
  observed_interaction_ranking: AnalyticsScreenPlayer[]
  recent_activity: AnalyticsHomeActivity[]
}

export type AnalyticsScreenStatistics = {
  totals: AnalyticsScreenTotals
  matches_by_playlist: { playlist: string | null; matches_recorded: number }[]
}

export type AnalyticsScreenPlayers = {
  totals: AnalyticsScreenTotals
  items: AnalyticsScreenPlayer[]
  total: number
  page: number
  page_size: number
}

export type AnalyticsPlayerSort =
  | 'matches_played'
  | 'container_interactions_observed'
  | 'treasure_events_observed'

export class AnalyticsApiError extends Error {
  constructor(status: number, statusText: string, endpoint: string) {
    const message = status === 401
      ? `A API exige autenticação Bearer (HTTP 401) para ${endpoint}.`
      : `Falha HTTP ${status}${statusText ? ` ${statusText}` : ''} em ${endpoint}.`

    super(message)
    this.name = 'AnalyticsApiError'
  }
}

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://api.fortcards.me/api/v1/'
).replace(/\/+$/, '')

async function requestJson(endpoint: string): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, {
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Falha de comunicação com a API em ${endpoint}: ${detail}`)
  }

  if (!response.ok) {
    throw new AnalyticsApiError(response.status, response.statusText, endpoint)
  }

  return response.json()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function expectRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new TypeError(`Resposta inválida da API: ${context} deve ser um objeto.`)
  }

  return value
}

function readInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable: true,
): number | null
function readInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable?: false,
): number
function readInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable = false,
): number | null {
  const value = record[key]

  if (nullable && value === null) {
    return null
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new TypeError(`Resposta inválida da API: ${context}.${key} deve ser um inteiro.`)
  }

  return value
}

function readString(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable: true,
): string | null
function readString(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable?: false,
): string
function readString(
  record: Record<string, unknown>,
  key: string,
  context: string,
  nullable = false,
): string | null {
  const value = record[key]

  if (nullable && value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new TypeError(`Resposta inválida da API: ${context}.${key} deve ser texto.`)
  }

  return value
}

function readNonNegativeInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
): number {
  const value = readInteger(record, key, context)

  if (value < 0) {
    throw new TypeError(`Resposta inválida da API: ${context}.${key} não pode ser negativo.`)
  }

  return value
}

function readPositiveInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
): number {
  const value = readInteger(record, key, context)

  if (value < 1) {
    throw new TypeError(`Resposta inválida da API: ${context}.${key} deve ser maior que zero.`)
  }

  return value
}

function decodeTotals(value: unknown, context = 'analyticsHome.totals'): AnalyticsScreenTotals {
  const record = expectRecord(value, context)

  return {
    identified_players: readNonNegativeInteger(record, 'identified_players', context),
    matches_recorded: readNonNegativeInteger(record, 'matches_recorded', context),
    container_interactions_observed: readNonNegativeInteger(record, 'container_interactions_observed', context),
    treasure_events_observed: readNonNegativeInteger(record, 'treasure_events_observed', context),
  }
}

function decodeRanking(value: unknown): AnalyticsScreenPlayer[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Resposta inválida da API: analyticsHome.observed_interaction_ranking deve ser uma lista.')
  }

  return value.map((item, index) => {
    const context = `analyticsHome.observed_interaction_ranking[${index}]`
    const record = expectRecord(item, context)

    return {
      position: readPositiveInteger(record, 'position', context),
      player_id: readInteger(record, 'player_id', context),
      display_name: readString(record, 'display_name', context, true),
      matches_played: readNonNegativeInteger(record, 'matches_played', context),
      container_interactions_observed: readNonNegativeInteger(record, 'container_interactions_observed', context),
      treasure_events_observed: readNonNegativeInteger(record, 'treasure_events_observed', context),
    }
  })
}

function decodeActivity(value: unknown): AnalyticsHomeActivity[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Resposta inválida da API: analyticsHome.recent_activity deve ser uma lista.')
  }

  return value.map((item, index) => {
    const context = `analyticsHome.recent_activity[${index}]`
    const record = expectRecord(item, context)
    const eventType = readString(record, 'event_type', context)
    const receivedAt = readString(record, 'received_at', context)
    const eventTimeSeconds = record.event_time_seconds

    if (eventType !== 'container_interaction' && eventType !== 'treasure_event' &&
      eventType !== 'prize_handler_grant') {
      throw new TypeError(`Resposta inválida da API: ${context}.event_type não é reconhecido.`)
    }

    if (Number.isNaN(Date.parse(receivedAt))) {
      throw new TypeError(`Resposta inválida da API: ${context}.received_at não é uma data válida.`)
    }

    if (eventTimeSeconds !== null &&
      (typeof eventTimeSeconds !== 'number' || !Number.isFinite(eventTimeSeconds))) {
      throw new TypeError(`Resposta inválida da API: ${context}.event_time_seconds deve ser numérico ou nulo.`)
    }

    return {
      id: readString(record, 'id', context),
      event_type: eventType,
      player_id: readInteger(record, 'player_id', context, true),
      player_name: readString(record, 'player_name', context, true),
      match_id: readInteger(record, 'match_id', context),
      observed_value: readString(record, 'observed_value', context, true),
      received_at: receivedAt,
      event_time_seconds: eventTimeSeconds,
      description: readString(record, 'description', context),
    }
  })
}

function decodeAnalyticsHome(value: unknown): AnalyticsHome {
  const envelope = expectRecord(value, 'analyticsHomeResponse')

  if (envelope.success !== true) {
    throw new TypeError('Resposta inválida da API: analyticsHomeResponse.success deve ser true.')
  }

  const data = expectRecord(envelope.data, 'analyticsHomeResponse.data')

  return {
    totals: decodeTotals(data.totals, 'analyticsScreenPlayers.totals'),
    observed_interaction_ranking: decodeRanking(data.observed_interaction_ranking),
    recent_activity: decodeActivity(data.recent_activity),
  }
}

function expectSuccessData(value: unknown, context: string): Record<string, unknown> {
  const envelope = expectRecord(value, `${context}Response`)

  if (envelope.success !== true) {
    throw new TypeError(`Resposta inválida da API: ${context}Response.success deve ser true.`)
  }

  return expectRecord(envelope.data, `${context}Response.data`)
}

function decodeAnalyticsScreenPlayers(value: unknown): AnalyticsScreenPlayers {
  const data = expectSuccessData(value, 'analyticsScreenPlayers')

  if (!Array.isArray(data.items)) {
    throw new TypeError('Resposta inválida da API: analyticsScreenPlayers.items deve ser uma lista.')
  }

  const items = data.items.map((item, index) => {
    const context = `analyticsScreenPlayers.items[${index}]`
    const record = expectRecord(item, context)

    return {
      position: readPositiveInteger(record, 'position', context),
      player_id: readInteger(record, 'player_id', context),
      display_name: readString(record, 'display_name', context, true),
      matches_played: readNonNegativeInteger(record, 'matches_played', context),
      container_interactions_observed: readNonNegativeInteger(record, 'container_interactions_observed', context),
      treasure_events_observed: readNonNegativeInteger(record, 'treasure_events_observed', context),
    }
  })
  const page = readPositiveInteger(data, 'page', 'analyticsScreenPlayers')
  const pageSize = readPositiveInteger(data, 'page_size', 'analyticsScreenPlayers')

  if (page > 1_000_000 || pageSize > 100) {
    throw new TypeError('Resposta inválida da API: analyticsScreenPlayers possui paginação fora dos limites documentados.')
  }

  return {
    totals: decodeTotals(data.totals, 'analyticsScreenPlayers.totals'),
    items,
    total: readNonNegativeInteger(data, 'total', 'analyticsScreenPlayers'),
    page,
    page_size: pageSize,
  }
}

function decodeAnalyticsScreenStatistics(value: unknown): AnalyticsScreenStatistics {
  const data = expectSuccessData(value, 'analyticsScreenStatistics')

  if (!Array.isArray(data.matches_by_playlist)) {
    throw new TypeError('Resposta inválida da API: analyticsScreenStatistics.matches_by_playlist deve ser uma lista.')
  }

  return {
    totals: decodeTotals(data.totals, 'analyticsScreenStatistics.totals'),
    matches_by_playlist: data.matches_by_playlist.map((item, index) => {
      const context = `analyticsScreenStatistics.matches_by_playlist[${index}]`
      const record = expectRecord(item, context)

      return {
        playlist: readString(record, 'playlist', context, true),
        matches_recorded: readNonNegativeInteger(record, 'matches_recorded', context),
      }
    }),
  }
}

export async function getAnalyticsHome(limit = 5): Promise<AnalyticsHome> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new RangeError('O limite da página inicial deve ser um inteiro entre 1 e 100.')
  }

  const params = new URLSearchParams({ limit: String(limit) })
  return decodeAnalyticsHome(await requestJson(`/analytics/screens/home?${params}`))
}

export async function getAnalyticsScreenStatistics(): Promise<AnalyticsScreenStatistics> {
  return decodeAnalyticsScreenStatistics(await requestJson('/analytics/screens/statistics'))
}

export async function getAnalyticsScreenPlayers(options: {
  screen: 'players' | 'ranking' | 'search'
  search?: string
  sort: AnalyticsPlayerSort
  page: number
  pageSize: number
}): Promise<AnalyticsScreenPlayers> {
  const { screen, search, sort, page, pageSize } = options

  if (!Number.isInteger(page) || page < 1 || page > 1_000_000) {
    throw new RangeError('A página deve ser um inteiro entre 1 e 1.000.000.')
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new RangeError('O tamanho da página deve ser um inteiro entre 1 e 100.')
  }

  if (screen === 'search' && (!search?.trim() || search.trim().length > 200)) {
    throw new RangeError('A busca deve conter entre 1 e 200 caracteres.')
  }

  const params = new URLSearchParams({
    sort,
    page: String(page),
    page_size: String(pageSize),
  })
  if (search?.trim()) {
    params.set('search', search.trim())
  }

  return decodeAnalyticsScreenPlayers(
    await requestJson(`/analytics/screens/${screen}?${params}`),
  )
}
