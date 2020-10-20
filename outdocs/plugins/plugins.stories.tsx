
  import React from 'react';
  import MDX from 'unitx-docs-pack/mdx-runtime'
  import { TSDoc } from 'unitx-docs-pack'
  import * as R from 'unitx/ramda';
  import * as UnitxUI from 'unitx-ui';
  import components from '@storybookComponents';

  export const plugins = () => (
      <>
        <MDX components={components}>
          {`# Plugins

Coming Soon!
`}
        </MDX>
        <TSDoc relativePath={'/plugins/plugins.md'} root="/tsdoc" title="Types"/>
      </>
    )
    export default {
      component: plugins,
      title: 'plugins/plugins',
    };
  