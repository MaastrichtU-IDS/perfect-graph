import React from 'react'
import { Code,  Decorators } from '../../../index'
import { Graph, } from '../../../../src/components'

const DefaultElement = () => (
  <Decorators.StageDecorator>
      <Graph.Text
          // style={{ width: 100, height: 100 }}
        >
          Heyy
      </Graph.Text>
    </Decorators.StageDecorator>
)

export const Default = () => (
  <Code>
    {
    `<Decorators.StageDecorator>
      <Graph.Text
          // style={{ width: 100, height: 100 }}
        >
          Heyy
      </Graph.Text>
    </Decorators.StageDecorator>`
    }
  </Code>
  
)
