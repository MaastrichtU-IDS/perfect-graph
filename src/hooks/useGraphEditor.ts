import { createProvider } from 'colay-ui'
import {
  OnEvent,
  GraphConfig,
  GraphEditorConfig,
  GraphLabelData,
  EditorMode,
  RecordedEvent,
  EventHistory,
  Playlist,
  NodeElement,
  GraphEditorProps,
} from '@type'

export type GraphEditor = {
  onEvent?: OnEvent;
  graphConfig?: GraphConfig;
  config?: GraphEditorConfig;
  label?: GraphLabelData;
  selectedElementIds?: string[] | null;
  mode?: EditorMode;
  events?: RecordedEvent[]
  eventHistory?: EventHistory;
  playlists?: Playlist[];
  localDataRef: {
    initialized: false;
    targetNode: NodeElement | null;
    props: GraphEditorProps;
    issuedClusterId: string|null;
    newClusterBoxSelection: {
      elementIds: string[];
    };
  };
  localNetworkStatistics?: any;
}

const {
  Context,
  Provider,
  useProvider,
} = createProvider<GraphEditor>({
  // @ts-ignore
  value: {},
})

export const GraphEditorContext = Context
export const GraphEditorProvider = Provider
export const useGraphEditor = () => {
  const [value] = useProvider()
  return value
}
