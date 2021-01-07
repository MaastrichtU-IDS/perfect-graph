const React = require('react')
const { create } = require('unitx-docs-pack/storybook/theming');
// const GithubEdit = require('unitx-docs-pack/components/GithubEdit').default
const R = require('unitx/lib/ramda');
const { StageDecorator } = require('../src/story');
const { ApplicationProvider, } = require('unitx-ui')

const SECTION_NAME_LIST =  ['intro','components', 'layoutengine', 'plugins', 'support', 'collaboration']
// Option defaults:
export const parameters = {
  options: {
    storySort: (a, b) => {
      const sectionA = a[1].id
      const sectionACategory = a[1].id.split('-')[0];
      const sectionB = b[1].id
      const sectionBCategory = b[1].id.split('-')[0];
      const sectionAIndex = R.findIndex(R.equals(sectionACategory))(SECTION_NAME_LIST)
      const sectionBIndex = R.findIndex(R.equals(sectionBCategory))(SECTION_NAME_LIST)
      return R.cond([
        [
          R.allPass([
            () =>R.isNegative(sectionAIndex),
            () => sectionBIndex >= 0,
          ]),
          R.always(-1)
        ],
        [
          R.allPass([
            () =>R.isNegative(sectionBIndex),
            () => sectionAIndex >= 0,
          ]),
          R.always(1)
        ],
        [
          R.allPass([
            () =>sectionAIndex >= 0,
            () => sectionBIndex >= 0,
            () => sectionAIndex !== sectionBIndex,
          ]),
          R.always(sectionBIndex > sectionAIndex ? -1 : 1)
        ],
        [
          R.allPass([
            () =>sectionAIndex >= 0,
            () => sectionBIndex >= 0,
            () => sectionAIndex === sectionBIndex,
          ]),
          R.always(sectionA.localeCompare(sectionB))
        ],
        [R.T, () => sectionA.localeCompare(sectionB)]
      ])('')
    },
    sortStoriesByKind: false,
    theme: create({
      base: 'light',
      brandTitle: 'PerfectGraph',
      // brandUrl: 'https://necolas.github.io/react-native-web'
      // To control appearance:
      // brandImage: 'http://url.of/some.svg',
    }),
    panelPosition: 'bottom',
    showPanel: false,
  }
}

export const decorators = [
  (Story, {parameters}) => {
    // const relativePath = parameters.fileName.replace('../../../../', '')
    return (
      <ApplicationProvider>
        <Story />
      </ApplicationProvider>
    )
  },
];