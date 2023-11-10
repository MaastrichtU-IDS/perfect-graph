import React from 'react'
import {StyleSheet} from 'react-native'
import {Graph} from '../../../src/components'

export type ArtistProps = {
  name: string
  description: string
  imageURL: string
}

export default (props: ArtistProps) => {
  const {name, description, imageURL} = props
  return (
    <Graph.View style={styles.container}>
      <Graph.Image source={{uri: imageURL}} style={styles.image} />
      <Graph.Text style={styles.title}>{name}</Graph.Text>
      <Graph.Text style={styles.description}>{description}</Graph.Text>
    </Graph.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    flexDirection: 'column-reverse',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    display: 'none'
  },
  title: {
    fontSize: 24
  },
  description: {
    fontSize: 20
  }
})
