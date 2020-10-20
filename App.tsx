import React from 'react'
import * as R from 'unitx/ramda'
import { ApplicationProvider, Icon,Text } from 'unitx-ui'
import { GraphEditor } from './src/editor/components'
import MusicGraph from './examples/Music'
import CaseLawExplorerGraph from './examples/CaseLawExplorer'
import './src/plugins/dataConverter'
import './src/plugins/parseContext'
import App from './src/App'
// import './src/machine/config'
// import { store, sender, useSelector } from './src/machine'
// import Application from './src/views/Application'
// import './src/useLogic'



type Props = {
  skipLoadingScreen: boolean;
}
const AppContainer = () => {
  const [data, setData] = React.useState({
    nodes: [
         { id: 1, position: { x: 10, y: 10 } },
         { id: 2, position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: 51, source: 1, target: 2 }
       ]
  })
  return (
    <ApplicationProvider>
      <GraphEditor 
        {...data}
      />
    </ApplicationProvider>
  )
}

export default ({ skipLoadingScreen }: Props) => {
  return (
    <App/>
      // <AppContainer />
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