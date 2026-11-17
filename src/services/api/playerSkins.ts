import { assets } from '../../constants/assets'

export type PlayerSkin = {
  id: string
  name: string
  image: string
}

type CosmeticsCatalog = {
  outfits: PlayerSkin[]
  outfitsById: Map<string, PlayerSkin>
}

const storageKey = 'chest-counter.player-skins.v1'
const assignments = new Map<number, string>()
let assignmentsLoaded = false
let catalogPromise: Promise<CosmeticsCatalog> | undefined

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readAssignments(): void {
  if (assignmentsLoaded) return
  assignmentsLoaded = true

  try {
    const stored = globalThis.localStorage?.getItem(storageKey)
    if (!stored) return

    const parsed: unknown = JSON.parse(stored)
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.assignments)) return

    for (const [playerId, skinId] of Object.entries(parsed.assignments)) {
      const numericPlayerId = Number(playerId)
      if (Number.isSafeInteger(numericPlayerId) && numericPlayerId > 0 && typeof skinId === 'string') {
        assignments.set(numericPlayerId, skinId)
      }
    }
  } catch {
    assignments.clear()
  }
}

function saveAssignment(playerId: number, skinId: string): void {
  assignments.set(playerId, skinId)

  try {
    const storedAssignments: Record<string, string> = {}
    for (const [id, assignedSkinId] of assignments) {
      storedAssignments[String(id)] = assignedSkinId
    }
    globalThis.localStorage?.setItem(storageKey, JSON.stringify({
      version: 1,
      assignments: storedAssignments,
    }))
  } catch {
    // Keep the assignment in memory when browser storage is unavailable.
  }
}

async function loadCosmeticsCatalog(): Promise<CosmeticsCatalog> {
  const response = await fetch(assets.cosmeticsCatalog)
  if (!response.ok) {
    throw new Error(`Não foi possível carregar o catálogo local de cosméticos (${response.status}).`)
  }

  const payload: unknown = await response.json()
  if (!isRecord(payload) || !isRecord(payload.data) || !Array.isArray(payload.data.br)) {
    throw new Error('O catálogo local de cosméticos possui um formato inválido.')
  }

  const outfits: PlayerSkin[] = []
  for (const item of payload.data.br) {
    if (!isRecord(item) || !isRecord(item.type) || item.type.value !== 'outfit') continue
    if (typeof item.id !== 'string' || typeof item.name !== 'string' || !isRecord(item.images)) continue

    const image = [item.images.icon, item.images.smallIcon, item.images.featured]
      .find((url): url is string => typeof url === 'string' && /^https:\/\//i.test(url))

    if (image) outfits.push({ id: item.id, name: item.name, image })
  }

  if (outfits.length === 0) {
    throw new Error('O catálogo local não contém skins com imagem disponível.')
  }

  return {
    outfits,
    outfitsById: new Map(outfits.map((outfit) => [outfit.id, outfit])),
  }
}

function getCosmeticsCatalog(): Promise<CosmeticsCatalog> {
  if (!catalogPromise) {
    catalogPromise = loadCosmeticsCatalog().catch((error: unknown) => {
      catalogPromise = undefined
      throw error
    })
  }
  return catalogPromise
}

export async function resolvePlayerSkin(playerId: number, preferredSkinId?: string | null): Promise<PlayerSkin> {
  if (!Number.isSafeInteger(playerId) || playerId <= 0) {
    throw new RangeError('O identificador do jogador precisa ser um inteiro positivo.')
  }

  const catalog = await getCosmeticsCatalog()
  readAssignments()

  const preferred = preferredSkinId ? catalog.outfitsById.get(preferredSkinId) : undefined
  if (preferred) {
    saveAssignment(playerId, preferred.id)
    return preferred
  }

  const assignedSkinId = assignments.get(playerId)
  const assigned = assignedSkinId ? catalog.outfitsById.get(assignedSkinId) : undefined
  if (assigned) return assigned

  const randomIndex = Math.floor(Math.random() * catalog.outfits.length)
  const selected = catalog.outfits[randomIndex]
  if (!selected) {
    throw new Error('Não foi possível selecionar uma skin do catálogo local.')
  }

  saveAssignment(playerId, selected.id)
  return selected
}
