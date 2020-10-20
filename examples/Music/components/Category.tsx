import React from 'react'
import  { StyleSheet } from 'react-native'
import {Graph } from '../../../src/components'

export type CategoryProps = {
  name: string;
  description: string;
  imageURL: string;
}


export default (props: CategoryProps) => {
  const { name, description, imageURL } = props
  return (
    <Graph.View
      style={styles.container}
    >
      <Graph.Image 
         source={{ uri: imageURL}}
         style={styles.image}
      />
      <Graph.View style={styles.bottomBar}>
        <Graph.Text 
          style={styles.title}
        >
          {name}
        </Graph.Text>
        <Graph.Text 
          style={styles.description}
        >
          {description}
        </Graph.Text>
      </Graph.View>
    </Graph.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
  },
  image: {
    width: 200,
    height: 150,
  },
  bottomBar: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  title: {
    fontSize: 20,
    width: 100,
    color: 'white'
  },
  description: {
    fontSize: 15,
    width: 200,
    height: 30,
    color: 'white'
  },

})