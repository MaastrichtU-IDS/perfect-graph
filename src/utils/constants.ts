export const THEME = {
  backgroundColor: '#3287a8',
  fillColor: 0x2c3e50,
}
export const ElementType = {
  edge: 'edge',
  node: 'node',
} as const

export const ActionType = {
  add: 'addNode',
  delete: 'deleteNode',
  updateData: 'updateData',
} as const
