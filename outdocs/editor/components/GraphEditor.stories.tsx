
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const GraphEditor = () => (
      <>
        <MDX components={components}>
          {`## Usage
To create a GraphEditor easily, you can just pass data and render methods.
Check example

\`\`\`js live=true
function MyGraphEditor() {
  const [data, setData] = React.useState({
    nodes: [
         { id: 1, position: { x: 10, y: 10 } },
         { id: 2, position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: 51, source: 1, target: 2 }
       ]
  })
  return (
    <GraphEditor
       style={{ width: '100%', height: 250 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       nodes={data.nodes}
       edges={data.edges}
     />
  )
}
\`\`\``}
        </MDX>
        <TSDoc relativePath={'/editor/components/GraphEditor.tsx'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: GraphEditor,
      title: 'Components/editor/components',
    };
  