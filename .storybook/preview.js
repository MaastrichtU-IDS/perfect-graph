import React from 'react'
const { create } = require('colay-docs/storybook/theming');
const { GithubEdit, } = require('colay-docs')
const R = require('colay/lib/ramda');

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
            () =>sectionAIndex<0,
            () => sectionBIndex >= 0,
          ]),
          R.always(-1)
        ],
        [
          R.allPass([
            () =>sectionBIndex<0,
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
  },
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      mobile: {
        name: 'iPhone X',
        styles: {
          width: '375px',
          height: '812px',
        },
      },
      tablet: {
        name: 'iPad',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      laptop: {
        name: 'Laptop',
        styles: {
          width: '1024px',
          height: '768px',
        },
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1440px',
          height: '1024px',
        },
      },
    },
  },
}
const GITHUB_URL = ''

export const decorators = [
  (Story, {parameters}) => {
    const relativePath = parameters.fileName.replace('../../../../', '')
    return (
      <>
        <GithubEdit>
          {`${GITHUB_URL}/blob/master/${relativePath}`}
        </GithubEdit>
        <Story />
      </>
    )
  },
];


// import * as nextImage from 'next/image'

// // Replace next/image for Storybook
// Object.defineProperty(nextImage, 'default', {
//   configurable: true,
//   value: (props) => {
//     const { width, height } = props
//     const ratio = (height / width) * 100
//     return (
//       <div
//         style={{
//           paddingBottom: `${ratio}%`,
//           position: 'relative',
//         }}>
//         <img
//           style={{
//             objectFit: 'cover',
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//           }}
//           {...props}
//         />
//       </div>
//     )
//   },
// })