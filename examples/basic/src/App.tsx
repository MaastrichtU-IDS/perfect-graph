import React from "react";
import { View } from "colay-ui";
import "./App.css";

import {
  Animation,
  ConvertRDF,
  GraphDefault,
  GraphEditorDefault,
  GraphEditorOnline
} from "./components";

const Tabs = {
  Animation: Animation,
  ConvertRDF: ConvertRDF,
  GraphDefault: GraphDefault,
  GraphEditorDefault: GraphEditorDefault,
  GraphEditorOnline: GraphEditorOnline
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
