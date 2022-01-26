import * as R from 'colay/ramda'
// @ts-ignore
import toJSONSchema from 'to-json-schema'

export const createSchema = (itemList: any[]) => {
  const options = {
    objects: { additionalProperties: false },
    arrays: { mode: 'tuple' },
  }
  return {
    ...toJSONSchema(R.mergeAll(itemList), options),
    title: 'Filter',
  }
}