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
yarn add perfect-graph unitx-ui unitx
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
