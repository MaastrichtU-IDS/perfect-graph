import React from 'react'
import * as R from 'colay/ramda'
import { Graph } from '../../src/components'
import { ProfileTemplate } from './components/Profile'
import { GraphEditor,  } from '../../src/components/GraphEditor'
import { useController } from '../../src/plugins/controller'


export default (props) => {
  const {
    width,
    height,
  } = props
  const [controllerProps, controller] = useController({
    ...data,
    // nodes: [],
    // edges: [],
    // events: RECORDED_EVENTS,
    graphConfig: {
      // layout: Graph.Layouts.cose,
      // zoom: 0.2,
      nodes: {},
    },
    dataBar: {
      isOpen: true,
    },
    settingsBar: {
      isOpen: true,
    },
    actionBar: {
      isOpen: true,
    },
  })
  return (
    <GraphEditor
        {...controllerProps}
        // extraData={[configRef.current]}
        style={{ width, height }}
        renderNode={(info) => {
          const { item } = info
          return (
              <ProfileTemplate
                {...item.data}
              />
          )
        }}
      />
  )
}

const data = {
  nodes: [
    {
      id: '1',
      data: {
        type: 'Person',
        name: 'Turgay Saba',
        image: 'https://media-exp1.licdn.com/dms/image/C4D03AQHWbPkMXlD9Lg/profile-displayphoto-shrink_800_800/0/1519223271518?e=1634169600&v=beta&t=RlvxibvdYY8mh-xA2sinTzdn7rUaB7U6y95X8zeUi5s',
        story: 'Full-stack Developer',
        link: 'https://www.linkedin.com/in/turgaysaba/',
      } ,
      position: {
        x: 100,
        y: 100,
      }
    },
    {
      id: '2',
      data: {
        type: 'Person',
        name: 'Michel Dumontier',
        image: 'https://media-exp1.licdn.com/dms/image/C5603AQHEl4p2uoPcMA/profile-displayphoto-shrink_800_800/0/1517329980954?e=1634169600&v=beta&t=8IjYoqNYMsuObOySpQOAaV7xQCRMGnax6Eh0TiHdcbM',
        story: 'Distinguished Professor',
        link: 'https://www.linkedin.com/in/dumontier/',
      } ,
      position: {
        x: 600,
        y: 600,
      }
    },
    {
      id: '3',
      data: {
        type: 'University',
        name: 'Maastricht University',
        image: 'https://media-exp1.licdn.com/dms/image/C4D0BAQFA1gR1FvG8aQ/company-logo_200_200/0/1588059465102?e=1636588800&v=beta&t=V6e-agtjpkYRX4XIDiWHzOOQ9bR3WgLNhOTLtoObvK4',
        story: 'University',
        link: 'https://www.linkedin.com/school/maastricht-university/mycompany/',
      } ,
      position: {
        x: 400,
        y: 400,
      }
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: '1',
      target: '3',
    },
    {
      id: 'edge-2',
      source: '2',
      target: '3',
    },
  ]
}