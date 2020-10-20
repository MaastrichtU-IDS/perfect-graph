
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const View = () => (
      <>
        <MDX components={components}>
          {`## Usage
To use View on Graph
Check example

\`\`\`js live=true
<Graph
  style={{ width: '100%', height: 250 }}
  nodes={[
    {
      id: 1,
      position: { x: 10, y: 10 },
      data: { color: 'red' }
    },
    {
      id: 2,
      position: { x: 300, y: 10 },
      data: { color: 'blue' }
    },
  ]}
  edges={[
    { id: 51, source: 1, target: 2 }
  ]}
  renderNode={({ item: { data } }) => (
    <Graph.View
      style={{ width: 100, height: 100, backgroundColor: data.color }}
    />
)}
/>
\`\`\``}
        </MDX>
        <TSDoc relativePath={'src/components/components/View'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: View,
      title: 'components/View',
    };
  