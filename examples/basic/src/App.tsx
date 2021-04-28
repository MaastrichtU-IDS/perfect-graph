import React from 'react';
import './App.css';

import { 
  Animation,
  ConvertRDF,
  GraphDefault,
  GraphEditorDefault,
  GraphEditorOnline
} from './components'

const Tabs = {
  'Animation': Animation,
  'ConvertRDF': ConvertRDF,
  'GraphDefault': GraphDefault,
  'GraphEditorDefault': GraphEditorDefault,
  'GraphEditorOnline': GraphEditorOnline,
}
function App() {
  const [selectedTab, setSelectedTab] = React.useState('GraphDefault') 
  return (
    <div className="App">
      <header className="App-header">
        {
          Object.keys(Tabs).map((title) => (
            <button
              onClick={() => setSelectedTab(title)}
            >{title}</button>
          ))
        }
      </header>
      <div
        style={{
          width: '100vw',
          height: '95vh'
        }}
      >
        {
          Tabs[selectedTab]
        }
      </div>
    </div>
  );
}

export default App;
