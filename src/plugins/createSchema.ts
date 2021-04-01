import * as R from 'colay/ramda'
import mergeAllOf from 'json-schema-merge-allof'
import toJSONSchema from 'to-json-schema'

export const createSchema = (itemList: any[]) => {
  const options = {
    objects: { additionalProperties: false },
    arrays: { mode: 'tuple' },
  }
  return {
    ...toJSONSchema(R.mergeAll(itemList), options),
    title: 'Filter'
  }
  const allOf = itemList.map((item) => {
    console.log('b', item)
    let baseSchema
    try {
      baseSchema = toJSONSchema(item, options)
    } catch (error) {
      baseSchema = null
    }
    return baseSchema
  }).filter((item) => item !== null)
  const schema = {
    type: ['object'],
    // additionalProperties: {
    //   type: 'string',
    //   minLength: 5
    // },
    title: 'Filter',
    allOf,
  }
  return mergeAllOf(schema)
}
// export const createSchema = (itemList: object[]) => {
//   let required: string[] = []
//   let baseSchema = { properties: { } }
//   itemList.map((item: object) => {
//     const keys = Object.keys(item)
//     if (R.isEmpty(required)) {
//       required = keys
//       // @ts-ignore
//       baseSchema = toJSONSchema(item)
//       return
//     }
//     const schema = toJSONSchema(item)
//     baseSchema.properties = {
//       ...baseSchema.properties,
//       ...schema.properties,
//     }
//     required = R.intersection(required, keys)
//   })
//   return {
//     ...baseSchema,
//     required,
//   }
// }
