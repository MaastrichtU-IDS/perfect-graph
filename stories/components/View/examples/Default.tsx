import React from 'react'
import { Graph } from '../../../index'


export const Default = () => (
  <Graph.View
    style={{ 
      width: 200, 
      height: 200,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Graph.Text>Hello World!</Graph.Text>
  </Graph.View>
)
