import React from 'react'
import * as R from 'unitx/ramda'
import { ApplicationProvider, Icon,Text, useWhyDidUpdate } from 'unitx-ui'
import { GraphEditor } from './src/components/GraphEditor'
import { Graph } from './src/components'
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
const AppContainer = () => {
  const [controllerProps] = useController({
    nodes: [
         { id: '1', position: { x: 10, y: 10 } , data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]},
         { id: '2', position: { x: 300, y: 100 } , data: []},
       ],
    edges: [
         { id: '51', source: '1', target:  '2',  }
       ]
  },)
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
          editable: false
        }}
        renderNode={({item, label})=> (
          <Graph.View style={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50
          }}
          >
            <Graph.Text>{label}</Graph.Text>
          </Graph.View>
        )}
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