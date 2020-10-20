// import { defineMachineConfig, createUpdateAction } from 'unitx/xstate'

// const serviceNames = {}
// const eventNames = {
//   EXIT: 'EXIT',
//   ADD_NODE: 'ADD_NODE',
//   SELECT_ELEMENT: 'SELECT_ELEMENT',
//   CHANGE_PROJECT_MODE: 'CHANGE_PROJECT_MODE',
//   DELETE_NODE: 'DELETE_NODE',
//   DELETE_EDGE: 'DELETE_EDGE',
//   DELETE_DATA_ITEM: 'DELETE_DATA_ITEM',
//   UPDATE_DATA_ITEM: 'UPDATE_DATA_ITEM',
//   ADD_DATA_ITEM: 'ADD_DATA_ITEM',
// }
// const updaterActionNames = {}
// export default defineMachineConfig({
//   initial: 'idle',
//   id: 'studio',
//   context: {},
//   invoke: {
//     src: serviceNames.studio.subscribeElementData,
//   },
//   states: {
//     idle: {
//     },
//     exit: {
//       invoke: {
//         src: createService(() => ({
//           navigation: {
//             type: 'navigate',
//             name: 'Home',
//           },
//         })),
//         onDone: {
//           actions: [updaterActionNames.updateMachine],
//           target: '#home',
//         },
//       },
//     },
//   },
//   on: {
//     EXIT: '.exit',
//     SELECT_ELEMENT: {
//       actions: createUpdateAction(({
//         event: {
//           data: {
//             elementID, projectID, elementType,
//           },
//         },
//       }) => ({
//         store: {
//           model: 'Project',
//           data: {
//             selectedElementID: elementID,
//             selectedElementType: elementType,
//           },
//           where: {
//             id: projectID,
//           },
//         },
//       })),
//     },
//     ADD_NODE: {
//       actions: createUpdateAction(({ event: { data: { element, projectID } } }) => ({
//         store: {
//           model: 'Project',
//           data: {
//             nodes: {
//               create: {
//                 ...element,
//                 data: [],
//                 position: {
//                   create: element.position,
//                 },
//               },
//             },
//           },
//           where: {
//             id: projectID,
//           },
//         },
//       })),
//     },
//     DELETE_NODE: {
//       actions: createUpdateAction(({ event: { data: { id, projectID } } }) => ({
//         store: {
//           model: 'Project',
//           data: {
//             nodes: {
//               delete: {
//                 id,
//               },
//             },
//             edges: {
//               deleteMany: {
//                 OR: [
//                   {
//                     target: id,
//                   },
//                   {
//                     source: id,
//                   },
//                 ],
//               },
//             },
//           },
//           where: {
//             id: projectID,
//           },
//         },
//       })),
//     },
//     DELETE_EDGE: {
//       actions: createUpdateAction(({ event: { data: { id, projectID } } }) => ({
//         store: {
//           model: 'Project',
//           data: {
//             edges: {
//               delete: {
//                 id,
//               },
//             },
//           },
//           where: {
//             id: projectID,
//           },
//         },
//       })),
//     },
//     DELETE_DATA_ITEM: {
//       actions: createUpdateAction(({
//         event: {
//           data: {
//             id,
//             elementType,
//             elementID,
//           },
//         },
//       }) => ({
//         store: elementType === 'Node'
//           ? ({
//             model: 'Node',
//             data: {
//               data: { delete: { id } },
//             },
//             where: {
//               id: elementID,
//             },
//           })
//           : ({
//             model: 'Edge',
//             data: {
//               data: { delete: { id } },
//             },
//             where: {
//               id: elementID,
//             },
//           }),
//       })),
//     },
//     UPDATE_DATA_ITEM: {
//       actions: createUpdateAction(
//         ({
//           event: {
//             data: {
//               id, elementType, elementID, dataItem = {},
//             },
//           },
//         }) => ({
//           store: elementType === 'Node'
//             ? ({
//               model: 'Node',
//               data: {
//                 data: {
//                   update: {
//                     data: {
//                       ...dataItem,
//                       ...(dataItem.value ? { value: dataItem.value } : {}),
//                     },
//                     where: {
//                       id,
//                     },
//                   },
//                 },
//               },
//               where: {
//                 id: elementID,
//               },
//             })
//             : ({
//               model: 'Edge',
//               data: {
//                 data: {
//                   update: {
//                     data: {
//                       ...dataItem,
//                       ...(dataItem.value ? { value: dataItem.value } : {}),
//                     },
//                     where: {
//                       id,
//                     },
//                   },
//                 },
//               },
//               where: {
//                 id: elementID,
//               },
//             }),
//         }),
//       ),
//     },
//     ADD_DATA_ITEM: {
//       actions: createUpdateAction(
//         ({
//           event: {
//             data: {
//               elementType, elementID, dataItem = {},
//             },
//           },
//         }) => ({
//           store: elementType === 'Node'
//             ? ({
//               model: 'Node',
//               data: {
//                 data: {
//                   create: {
//                     ...dataItem,
//                     value: {
//                       value: dataItem.value,
//                     },
//                   },
//                 },
//               },
//               where: {
//                 id: elementID,
//               },
//             })
//             : ({
//               model: 'Edge',
//               data: {
//                 data: {
//                   create: {
//                     ...dataItem,
//                     value: {
//                       value: dataItem.value,
//                     },
//                   },
//                 },
//               },
//               where: {
//                 id: elementID,
//               },
//             }),
//         }),
//       ),
//     },
//     CHANGE_PROJECT_MODE: {
//       actions: createUpdateAction(({ event: { data: { projectID, mode } } }) => ({
//         store: {
//           model: 'Project',
//           data: {
//             mode,
//           },
//           where: {
//             id: projectID,
//           },
//         },
//       })),
//     },
//   },
// })
