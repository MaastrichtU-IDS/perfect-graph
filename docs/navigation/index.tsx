import React from 'react';
import LinkingConfiguration from './LinkingConfiguration';
import {
  Animation,
  ConvertRDF,
  GraphDefault,
  GraphEditorDefault,
  GraphEditorOnline
} from '../components'
import { NavigationCreator } from './NavigationCreator'


const pages = {
  GraphDefault: GraphDefault,
  GraphEditorDefault: GraphEditorDefault,
}

export default function Navigation() {
  return (
    <NavigationCreator
      pages={pages}
      initialRouteName={'GraphDefault'}
      LinkingConfiguration={LinkingConfiguration}
      // tabBar={()=>null}
    />
  );
}

