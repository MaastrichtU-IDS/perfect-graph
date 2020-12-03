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
import { RenderJSON,mockRenderJSON } from './src/components/RenderJSON'
// import { VIEW_CONFIG_SCHEMA } from './examples/CaseLawExplorer/constants'
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
  settingsBar: {
    // forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA],
  },
  graphConfig: {
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

    // layout: Graph.Layouts.cose,
  }
}
const AppContainer = () => {
  const [controllerProps] = useController({
    // ...PROFILE_GRAPH,
    ...data
  })
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
  console.log(controllerProps)
  return (
    <ApplicationProvider>
      {/* <App /> */}
      <GraphEditor
        style={{ width: '100%', height: '100%'}}
        {...controllerProps}
        renderNode={({ item, label, element })=> {
          // const itemDataMap = R.
          return (
            <RenderJSON 
            {...mockRenderJSON}
            context={{item, label, element}}
            />
            // <Sprite
            //   image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
            //   // scale={{ x: 0.5, y: 0.5 }}
            // />
            
            // <Graph.View style={{
            //   width: 100,
            //   height: 100,
            //   justifyContent: 'center',
            //   alignItems: 'center',
            //   // borderRadius: 50,
            //   // backgroundColor: element.selected() ? 'red' : 'blue'
            // }}
            // >
            //   <Graph.Text>{label}</Graph.Text>
            //   {/* <Graph.Text>{element.position().x}</Graph.Text> */}
            // </Graph.View>
          )
        }}
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
      // <AppContainer />
      <CaseLawExplorerGraph />
      // <StoreProvider
      //   store={store.store}
      //   context={store.StoreContext}
      // >
      //   <AppContainer />
      // </StoreProvider>
  )
}

const PROFILE_GRAPH = {
  nodes: [
    {
      id: '1',
      data: [
        {
          name: 'name',
          value: ['Maastricht']
        },
        {
          name: 'image',
          value: ['https://images.pexels.com/photos/105599/pexels-photo-105599.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500']
        },
        {
          name: 'story',
          value: ['Maastricht, a university city on the southern tip of the Netherlands, is distinguished by its medieval-era architecture and vibrant cultural scene.']
        },
      ]
    },
    {
      id: '2',
      data: [
        {
          name: 'name',
          value: ['Amsterdam']
        },
        {
          name: 'image',
          value: ['https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500']
        },
        {
          name: 'story',
          value: ['Amsterdam is the Netherlands’ capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades.']
        },
      ]
    }
  ],
  edges: [
    { id: '51', source: '1', target: '2' }
  ],
  graphConfig: {
    nodes: {
      '1': { position: { x: 100, y: 100} },
      '2': { position: { x: 500, y: 500} },
    },
  }
}


