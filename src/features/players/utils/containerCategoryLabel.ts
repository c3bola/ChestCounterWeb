const categoryLabels: Record<string, string> = {
  standard_chest: 'Baú padrão',
  buried_chest: 'Baú enterrado',
  rare_chest: 'Baú raro',
  relic_chest: 'Baú de relíquia',
  spirit_chest: 'Baú espiritual',
  ammo_box: 'Caixa de munição',
  food_box: 'Caixa de alimentos',
  loot_cannon: 'Canhão de saque',
  other_container: 'Outro contêiner',
  unclassified: 'Não classificado',
}

export function containerCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category.replace(/[_-]+/g, ' ')
}
