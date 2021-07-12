import React from 'react'
import * as R from 'unitx/ramda'
import { Artist,Category,Song } from './components'
import { Graph } from '../../src/components'
import { ApplicationProvider } from 'unitx-ui'


type Props = {
  skipLoadingScreen: boolean;
}

const TYPE_MAP = {
  Artist: 'Artist',
  Category: 'Category',
  Song: 'Song',
}
const AppContainer = () => {
  const [data, setData] = React.useState({
    nodes: [
         { 
           id: 1,
            position: { x: 10, y: 10 },
            data: {
              type: TYPE_MAP.Song,
              imageURL: 'https://images.unsplash.com/photo-1519139116361-2ea84d04a4aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
              url: 'https://feeds.soundcloud.com/stream/265755166-unminus-please-wait.mp3'
            }
          },
         { 
           id: 2,
           position: { x: 300, y: 100 },
           data: {
            type: TYPE_MAP.Category,
            name: 'Classical',
            description: `Whereas most popular styles are usually written in song form, classical music is noted for its development of highly sophisticated instrumental musical forms, like the concerto, symphony and sonata.`,
            imageURL:  'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
           }
          },
       ],
    edges: [
         { id: 51, source: 1, target: 2 }
       ]
  })

  return (
    <ApplicationProvider>
      <Graph 
        style={{ width: '100%', height: '100%'}}
        {...data}
        renderNode={({ item: { data: { type , ...rest } } }) => {
          return R.cond([
            [R.equals(TYPE_MAP.Song), () => <Song {...rest}/>],
            [R.equals(TYPE_MAP.Category), () => <Category {...rest}/>],
          ])(type)
        }}
      />
    </ApplicationProvider>
  )
}


export default ({ skipLoadingScreen }: Props) => (
  <AppContainer />
)

