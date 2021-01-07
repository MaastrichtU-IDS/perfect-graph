
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const Profile = () => (
      <>
        <MDX components={components}>
          {`## Usage
To create a Profile View easily, you can just pass data and Profile Template.
Check example

\`\`\`js live=true
<Graph
  style={{ width: '100%', height: 250 }}
  nodes={[
    {
      id: 1,
      position: { x: 10, y: 10 },
      data: {
        name: 'Maastricht',
        image: 'https://images.pexels.com/photos/105599/pexels-photo-105599.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        story: \`Maastricht, a university city on the southern tip of the Netherlands, is distinguished by its medieval-era architecture and vibrant cultural scene.\`
      }
    },
    {
      id: 2,
      position: { x: 600, y: 10 },
      data: {
        name: 'Amsterdam',
        image: 'https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        story: \`Amsterdam is the Netherlands’ capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades.\`
      }
    },
  ]}
  edges={[
    { id: 51, source: 1, target: 2 }
  ]}
  renderNode={({ item: { data } }) => (
   <Graph.ProfileTemplate
     name={data.name}
     image={data.image}
     story={data.story}
   />
)}
/>
\`\`\``}
        </MDX>
        <TSDoc relativePath={'src/components/templates/Profile'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: Profile,
      title: 'components/templates',
    };
  