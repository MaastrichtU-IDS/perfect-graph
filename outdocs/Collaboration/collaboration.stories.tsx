
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const collaboration = () => (
      <>
        <MDX components={components}>
          {`# Collaboration

Coming Soon!
`}
        </MDX>
        <TSDoc relativePath={'/Collaboration/collaboration.md'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: collaboration,
      title: 'Collaboration/collaboration',
    };
  