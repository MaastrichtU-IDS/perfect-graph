# PerfectGraph

## Motivation

We want to build a collaborative Knowledge Graph Editor. To achive that goal we need a Graph Visualizer on a web browser and it needs to have a declarative rendering. Because in imperative style we need to call appropriate api functions respect to the data changes like addNode, deleteNode etc. But we just want to change JSON data (node and edge information) and render elements respectively to the changes.

## Usage

First, install <a href="https://nodejs.org/en/download/" target="_blank">Nodejs</a> and <a href="https://classic.yarnpkg.com/en/docs/install/" target="_blank">Yarn</a> to your working environment. Then

```js
yarn global add expo-cli
```

Then,

```js
expo init my-project
cd my-project
yarn add perfect-graph colay colay-ui
```

After you can write this command to the terminal in your project directory

```js
yarn web
```

So let's start coding

```js
import { Graph } from "perfect-graph";

function MyGraph() {
  return (
    <Graph
      style={{ width: "100%", height: 250 }}
      nodes={[
        { id: 1, position: { x: 10, y: 10 } },
        { id: 2, position: { x: 300, y: 100 } },
      ]}
      edges={[{ id: 51, source: 1, target: 2 }]}
    />
  );
}
```

Furthermore please refer to the Components Section.

To use Graph : yarn add colay colay-ui immer
 
To use GraphEditor you need to install material-ui packages. We use the latest version: yarn add @mui/icons-material @mui/material @mui/styles @emotion/react @emotion/styled react-beautiful-dnd @rjsf/core @rjsf/material-ui

To have json editor: yarn add brace jsoneditor jsoneditor-react

To use rdf based operation please install the required dependencies: yarn add jsonld jsonld-context-parser n3 rdf-literal rdflib

To use layouts, please install the required dependencies:
yarn add cytoscape-avsdf cytoscape-cise cytoscape-cola cytoscape-d3-force cytoscape-dagre cytoscape-euler cytoscape-fcose cytoscape-klay cytoscape-spread

To support material-ui v5 with @rjsf/material-ui, we need to add some special configuration until they have fully support for v5

// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
        dangerouslyAddModulePathsToTranspile: ['@rjsf/material-ui']
    }
}, argv);
  return config;
};

// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "plugins": [
      [
        "module-resolver",
        {
          "extensions": [
            ".js",
            ".jsx",
            ".es",
            ".es6",
            ".mjs",
            ".ts",
            ".tsx",
          ],
          "alias": {
            '@material-ui/core': '@mui/material',
            '@material-ui/icons': '@mui/icons-material',
            '@material-ui/styles': '@mui/styles',
          }
        }
      ],
    ]
  };
};


If the PIXI.js renderer takes a lot time to render all elements and blocks the UI then consider on:
  - Decreasing the view resolution and settings quality
In example when a huge data chunk imported to perfect-graph, if the view quality is very high ; then PIXI.js will block (to render the elements with high view quality) the UI thread and cause strange issues. Set low view quality settings before importing the data chunk and let Adaptive Performance Optimizer do the rest of the optimization.

- If there is an error: Can not set readonly 'x' of '#Object' 
 That could be related with position ; If you use cy.$(id).position() in somewhere and store it that can cause an issue. Use cy.$(id).position().x , cy.$(id).position().y