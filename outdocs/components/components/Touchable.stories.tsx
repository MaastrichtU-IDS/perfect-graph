
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const Touchable = () => (
      <>
        <MDX components={components}>
          {`## Usage
To use Text on Graph
Check example

\`\`\`js live=true
<Graph
  style={{ width: '100%', height: 250 }}
  nodes={[
    {
      id: 1,
      position: { x: 10, y: 10 },
      data: { city: 'Amsterdam' }
    },
    {
      id: 2,
      position: { x: 300, y: 10 },
      data: { city: 'Maastricht' }
    },
  ]}
  edges={[
    { id: 51, source: 1, target: 2 }
  ]}
  renderNode={({ item: { data } }) => (
    <Graph.Touchable
      onPress={() => alert('Pressed!!')}
      onLongPress={() => alert('LongPressed!!')}
    >
      <Graph.View
         style={{ width: 100, height: 100,  }}
       >
         <Graph.Text
            style={{ fontSize: 18 }}
          >
           {data.city}
          </Graph.Text>
       </Graph.View>
    </Graph.Touchable>
)}
/>
\`\`\``}
        </MDX>
        <TSDoc relativePath={'/components/components/Touchable.tsx'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: Touchable,
      title: 'Components/components',
    };
  