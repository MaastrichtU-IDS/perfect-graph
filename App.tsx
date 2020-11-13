import React from 'react'
import * as R from 'unitx/ramda'
import { ApplicationProvider, Icon,Text, useWhyDidUpdate } from 'unitx-ui'
import { GraphEditor } from './src/components/GraphEditor'
import { Graph } from './src/components'
import { Text as PIXIText, Sprite } from '@inlet/react-pixi'
import MusicGraph from './examples/Music'
import CaseLawExplorerGraph from './examples/CaseLawExplorer'
import {useController} from './src/plugins/controller'
import {getLabel} from './src/utils'
import { SECOND_FILTER_SCHEMA} from './examples/CaseLawExplorer/constants'
// import './src/plugins/dataConverter'
// import './src/plugins/parseContext'
import App from './src/App'
// import './src/machine/config'
// import { store, sender, useSelector } from './src/machine'
// import './src/useLogic'




type Props = {
  skipLoadingScreen: boolean;
}
// {nodes: new Array(1000).fill(0).map((_, index) => (
//   {  position: { x: index, y: index }, data:  {
//   id: `${index}`,
//   }}
// )),
// edges: new Array(999).fill(0).map((_, index) => (
//   {  data: { id : `edge:${index}`, source: `${index}`,  target: `${index+1}` }
//   }
// )),}

const COUNT = 10
const data = {
  nodes: new Array(COUNT).fill(0).map((_, index) => (
    { id: `${index}`, position: { x: index * 100, y: index * 100 },  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
  )),
  edges: new Array(COUNT - 1).fill(0).map((_,index) => (
    { id: `edge:${index}`, source: `${index}`,  target: `${index+1}`,  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
  )),
}
const AppContainer = () => {
  // const [controllerProps] = useController({
  //   nodes: [
  //        { id: '1',  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]},
  //        { id: '2' , data: []},
  //      ],
  //   edges: [
  //        { id: '51', source: '1', target:  '2',  }
  //      ]
  // },)
  const [controllerProps] = useController(data)
  // const [data, setData] = React.useState({
  //   nodes: [
  //        { id: 1, position: { x: 10, y: 10 } , data: []},
  //        { id: 2, position: { x: 300, y: 100 } , data: []},
  //      ],
  //   edges: [
  //        { id: 51, source: 1, target: 2,  }
  //      ]
  // })

  // useWhyDidUpdate('Heyy', controllerProps)
  return (
    <ApplicationProvider>
      {/* <App /> */}
      <GraphEditor
        style={{ width: '100%', height: '100%'}}
        {...controllerProps}
        filterBar={{
          ...controllerProps.filterBar,
          ...SECOND_FILTER_SCHEMA
        }}
        dataBar={{
          ...controllerProps.dataBar,
          // editable: false
        }}
        graphConfig={{
          nodes: {
            '1': {
              position: { x: 10, y: 10 },
              renderEvents: ['select']
              // renderEvents: ['select', 'position']
            },
            '2': {
              position: { x: 300, y: 100 },
              // renderEvents: ['select']
            }
          },
          layout: Graph.Layouts.cose
        }}
        renderNode={({ item, label, element })=> (
          // <Sprite
          //   image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
          //   // scale={{ x: 0.5, y: 0.5 }}
          // />
          <Graph.View style={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: element.selected() ? 'red' : 'blue'
          }}
          >
            <Graph.Text>{label}</Graph.Text>
            {/* <Graph.Text>{element.position().x}</Graph.Text> */}
          </Graph.View>
        )}
        draw
        // onElementSelected={({ item}) => {
        //   console.log('selection',item)
        // }}
        // {...data}
        // onEvent={(info) => {
        //   console.log('event', info)
        // }}
        // onEventAdditional={(info) => {
        //   console.log('eventAdd', info)
        // }}
      />
    </ApplicationProvider>
  )
}

export default ({ skipLoadingScreen }: Props) => {
  return (
    // <App/>
      <AppContainer />
      // <CaseLawExplorerGraph />
      // <StoreProvider
      //   store={store.store}
      //   context={store.StoreContext}
      // >
      //   <AppContainer />
      // </StoreProvider>
  )
}


// const AppContainer = () => {
//   const applicationRef = React.useRef(null)
//   const _ = React.useEffect(() => {
//     sender.idle.INITIALIZE({
//       navigationRef: R.path(['current', 'navigation'])(applicationRef),
//     })
//   },
//   [])
//   const appSettings = useSelector(({ settings }) => ({
//     theme: settings.theme,
//     designSystem: settings.designSystem,
//     isLoading: settings.initialized,
//   }))
//   return (
//     // <Storybook/>
//     <Application
//       ApplicationContainer={{
//         ref: applicationRef,
//         ...appSettings,
//       }}
//     />
//   )
// }