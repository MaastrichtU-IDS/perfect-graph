import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
const storybookUrl = 'http://localhost:9009'
initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl,
  }),
})
// import path from 'path';
// import pupDevices from 'puppeteer/lib/esm/puppeteer/common/DeviceDescriptors';
// import initStoryshots from '@storybook/addon-storyshots';
// import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

// const storybookUrl = 'http://localhost:9009'//path.resolve('public');
// const supportedDevices = new Set(['iPad', 'iPhone 5', 'iPhone 6', 'iPhone 7 Plus']);

// function createGetMatchOptions({ name }) {
//   return () => ({
//     customSnapshotsDir: path.resolve('__image_snapshots__', name),
//   });
// }

// function createCustomizePage(pupDevice) {
//   return function(page) {
//     return page.emulate(pupDevice);
//   }
// }

// for (let supportedDevice of supportedDevices) {
//   const pupDevice = pupDevices[supportedDevice];

//   if (!pupDevice) {
//     continue;
//   }

//   const getMatchOptions = createGetMatchOptions(pupDevice);
//   const customizePage = createCustomizePage(pupDevice);

//   initStoryshots({
//     framework: 'html',
//     suite: `Image storyshots: ${pupDevice.name}`,
//     test: imageSnapshot({
//       storybookUrl,
//       getMatchOptions,
//       customizePage,
//     })
//   });
// }

// initStoryshots({
//   framework: 'html',
//   suite: 'Image storyshots: Wide',
//   test: imageSnapshot({
//     storybookUrl,
//     getMatchOptions: createGetMatchOptions({ name: 'Wide' }),
//     customizePage: page => page.setViewport({ width: 1920, height: 1200 }),
//   }),
// });
