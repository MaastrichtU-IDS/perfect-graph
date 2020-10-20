export type _config = {
  output: '/Users/turgaysaba/Desktop/projects/perfect-graph-reference/machine/store/creator';
}

export type InitialState = {
  settings: Settings;
  projectInfoList?: ProjectInfo[];
  projectList?: Project[];
  machineState: any;
  user?: User;
}

type Settings = {
  initialized: boolean;
  appName: string;
  isDev: boolean;
  endpoint: string;
  socketEndpoint: string;
  theme: 'dark'|'light';
  designSystem: 'eva'|'material';
}

type User = {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  phoneNumber?: string;
  photoURL?: string;
}

type ProjectInfo = {
  name: string;
  image: string;
  description: string;
}

type Project = {
  name: string;
  image: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  selectedElementID?: string;
  selectedElementType?: 'Node' | 'Edge';
  mode?: 'ADD' | 'DELETE' | 'CLUSTER';
}

type Node = {
  label: string;
  data: DataItem[];
  position: Position;
}

type Position= {
  x: number;
  y: number;
}

type Edge = {
  label: string;
  source: string;
  target: string;
  data: DataItem[];
}

type DataItem = {
  key: string;
  type: string;
  value: any;
}
