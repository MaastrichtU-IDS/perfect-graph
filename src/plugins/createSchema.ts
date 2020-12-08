import * as R from 'unitx/ramda'
import { toJSONSchema } from 'unitx/to-json-schema'

export const createSchema = (itemList: object[]) => {
  let required: string[] = []
  let baseSchema = { properties: { } }
  itemList.map((item: object) => {
    const keys = Object.keys(item)
    if (R.isEmpty(required)) {
      required = keys
      // @ts-ignore
      baseSchema = toJSONSchema(item)
      return
    }
    const schema = toJSONSchema(item)
    baseSchema.properties = {
      ...baseSchema.properties,
      ...schema.properties,
    }
    required = R.intersection(required, keys)
  })
  return {
    ...baseSchema,
    required,
  }
}
