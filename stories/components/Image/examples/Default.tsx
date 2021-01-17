import React from 'react'
import { Code, Graph, Decorators } from '../../../index'

const DefaultElement = () => (
  <Decorators.StageDecorator>
      <Graph.Image
          style={{ width: 100, height: 100 }}
          source={{ 
            uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg'
          }}
        />
    </Decorators.StageDecorator>
)


export const Default = () => (
  <Code>
    {
    `<Decorators.StageDecorator>
      <Graph.Image
          style={{ width: 100, height: 100 }}
          source={{ 
            uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg'
          }}
        />
    </Decorators.StageDecorator>`
  }
  </Code>
  
  
)
