import React from 'react'
import * as R from 'unitx/ramda'
import docsComponents, { createCodeComponent } from 'unitx-docs-pack/components'
import * as defaultComponents from '../src/components';
import GraphEditor from '../src/editor/components/GraphEditor';
const components = {
  ...defaultComponents,
  GraphEditor,
}


export default {
  ...components,
  ...docsComponents,
  code: createCodeComponent(components),
}

// import React from 'react'
// import {
//   TouchableOpacity, Text, View, Clipboard,
// } from 'react-native'
// import {
//   LiveProvider, LiveEditor, LiveError, LivePreview,
// } from 'react-live'
// import theme from 'prism-react-renderer/themes/vsDark'
// import MonacoEditor from 'monaco-editor'
// // @ts-ignore
// import { mdx } from '@mdx-js/react'
// import Highlight, { defaultProps } from 'prism-react-renderer'

// const components = {
//   MonacoEditor,
//   React,
//   mdx,
//   ...defaultComponents
// }

// type CodeComponentProps = {
//   children: string;
//   className: string;
//   live: boolean;
// }
// const CodeComponent = (props: CodeComponentProps) => {
//   const { children, className, live } = props
//   const language = className?.replace(/language-/, '')
//   return live
//     ? (
//       <View style={{ marginTop: 40, backgroundColor: 'black' }}>
//         <LiveProvider
//           code={children}
//           scope={components}
//           // transformCode={code => '/** @jsx mdx */' + code}
//           theme={theme}
//         >
//           <LivePreview />
//           <View>
//             <LiveEditor />
//             <CopyButton>{children}</CopyButton>
//           </View>
//           <LiveError />
//         </LiveProvider>
//       </View>
//     )
//     : (
//       <View>
//         <CopyButton>{children}</CopyButton>
//         <Highlight
//           {...defaultProps}
//           code={children.trim()}
//           // @ts-ignore
//           language={language ?? 'javascript'}
//           theme={theme}
//         >
//           {({
//             className, style, tokens, getLineProps, getTokenProps,
//           }) => (
//             <pre
//               className={className}
//               style={{ ...style, padding: '20px' }}
//             >
//               {tokens.map((line, i) => (
//                 <div
//                   key={`${i}`}
//                   {...getLineProps({ line, key: i })}
//                 >
//                   {line.map((token, key) => (
//                     <span
//                       key={`${key}`}
//                       {...getTokenProps({ token, key })}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </pre>
//           )}
//         </Highlight>
//       </View>
//     )
// }

// const CopyButton = ({ children }: { children: string}) => (
//   <TouchableOpacity
//     style={{
//       position: 'absolute',
//       right: 10,
//       top: 17,
//       borderColor: 'white',
//       borderWidth: 1,
//       borderRadius: 20,
//       paddingHorizontal: 10,
//     }}
//     onPress={() => Clipboard.setString(children.trim())}
//   >
//     <Text style={{ color: 'white' }}>Copy</Text>
//   </TouchableOpacity>
// )

// export default {
//   ...components,
//   code: CodeComponent,
// }
