import React from "react";
import { View } from "colay-ui";
import cytoscape from 'cytoscape'
import euler from 'cytoscape-euler'
import cola from 'cytoscape-cola'
import dagre from 'cytoscape-dagre'
import spread from 'cytoscape-spread'
import {
  Animation,
  ConvertRDF,
  GraphDefault,
  GraphEditorDefault,
  GraphEditorOnline
} from "./components";

spread(cytoscape)
cytoscape.use(dagre)
cytoscape.use(euler)
cytoscape.use(cola)

const Tabs = {
  GraphDefault: GraphDefault,
  // Animation: Animation,
  // ConvertRDF: ConvertRDF,
  // GraphEditorDefault: GraphEditorDefault,
  // GraphEditorOnline: GraphEditorOnline
};
function App() {
  const [selectedTab, setSelectedTab] = React.useState("GraphDefault");
  const Element = Tabs[selectedTab];
  return (
    <div className="App">
      <View
        style={{
          flexDirection: "row"
        }}
      >
        {Object.keys(Tabs).map((title) => (
          <button onClick={() => setSelectedTab(title)}>{title}</button>
        ))}
      </View>
      <div
        style={{
          width: "100vw",
          height: "95vh"
        }}
      >
        {<Element />}
      </div>
    </div>
  );
}

export default App;
