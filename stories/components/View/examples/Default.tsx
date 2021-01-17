import React from 'react'
import { Code, Graph, Decorators } from '../../../index'

const DefaultElement = () => (
  <Decorators.StageDecorator>
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
      </Decorators.StageDecorator>
)

export const Default = () => (
  <Code>
    {
      `<Decorators.StageDecorator>
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
      </Decorators.StageDecorator>`
    }
  </Code>
)
