import React from 'react'
import MDX from 'unitx-docs-pack/mdx-runtime'
import {TSDoc} from 'unitx-docs-pack'
import * as R from 'unitx/ramda'
import * as UnitxUI from 'unitx-ui'
import components from '@storybookComponents'

export const Flexbox = () => (
  <>
    <MDX components={components}>
      {`# Flex Layout
As we learned, if we want to change the position of a Graph Element , we need to add style.left and style.top . But what if we want to centeralize the element inside of its parent element. The solution is coming with Yoga Layout Engine. We implement it inside of the Graph. So you can use [alignItems, justifyContent, paddingTop, paddingBottom ...] just like another style property

\`\`\`js live=true
<Graph
  style={{ width: "100%", height: 250 }}
  nodes={[
    { id: 1, position: { x: 10, y: 10 } },
    { id: 2, position: { x: 300, y: 100 } },
  ]}
  edges={[{ id: 51, source: 1, target: 2 }]}
  renderNode={({ item }) => (
    <Graph.View
      style={{
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Graph.Text>Heyy</Graph.Text>
    </Graph.View>
  )}
/>
\`\`\`
`}
    </MDX>
  </>
)
export default {
  component: Flexbox,
  title: 'layoutEngine/Flexbox'
}
