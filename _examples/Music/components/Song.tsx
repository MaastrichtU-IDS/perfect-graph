import React from 'react'
import  { StyleSheet } from 'react-native'
import {Graph } from '../../../src/components'
import { Audio } from 'expo-av'

export type SongProps = {
  url: string;
  imageURL: string;
}

const PLAY_IMAGE_URL = 'https://img.icons8.com/nolan/2x/play.png'
const PAUSE_IMAGE_URL = 'https://img.icons8.com/nolan/2x/pause.png'
export default (props: SongProps) => {
  const { url, imageURL } = props
  const [state, setState]= React.useState({ isPlaying: false })
  const soundObjectRef= React.useRef<Audio.Sound>(null)
  const play = React.useCallback(async () => {
    if (!soundObjectRef.current) {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        { uri: url },
        {  }
      )
      soundObjectRef.current = soundObject
    }
    await soundObjectRef.current.playAsync()
    setState({ isPlaying: true })
  }, [])
  const pause = React.useCallback(async () => {
    await soundObjectRef.current.pauseAsync()
    setState({ isPlaying: false })
  }, [])

  return (
    <Graph.View
      style={styles.container}
    >
      <Graph.Image 
         source={{ uri: imageURL}}
         style={styles.image}
      />
     <Graph.Touchable
      onPress={() => state.isPlaying ? pause() :  play()}
     >
      <Graph.View style={styles.innerContainer}>
        <Graph.Image 
            source={{ uri: state.isPlaying ? PAUSE_IMAGE_URL : PLAY_IMAGE_URL}}
            style={styles.icon}
          />
      </Graph.View>
     </Graph.Touchable>
    </Graph.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
  },
  innerContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  icon: {
    width: 30,
    height: 30,
  },
})