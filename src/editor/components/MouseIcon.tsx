// import React, { Component } from 'react'
// import { ViewPropTypes } from 'react-native'
// import utils from '@utils'
// import AddIcon from '@views/Components/IconIosAdd'
// import DeleteIcon from '@views/Components/IconIosRemove'
// import IconMdGitMerge from '@views/Components/IconMdGitMerge'
// import AddConnectionIcon from '@views/Components/IconVectorLine'

// class NewNode extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       open: false,
//       mode: null,
//     }
//     this.iconPosition = { x: 0, y: 0 }
//   }

//   componentDidMount() {
//     this.mouseListener = utils.dom.mouse.addListener((event) => {
//       const margin = utils.dom.dimensions.window.width / 250
//       this.iconPosition = { x: event.pageX + margin, y: event.pageY + margin }
//       if (!this.icon) return
//       utils.dom.updateStyle(this.icon, { left: `${this.iconPosition.x}px`, top: `${this.iconPosition.y}px` })
//     })
//   }

//   componentWillUnmount() {
//     utils.dom.mouse.removeListener(this.mouseListener)
//   }

//   render() {
//     const {
//       props: { style },
//       state: { mode },
//       iconPosition: { x, y },
//     } = this
//     if (!mode) return null
//     switch (mode) {
//       case 'add':
//         return (
//           <AddIcon
//             IconIosAdd={{
//               ref: c => this.icon = c,
//               style: {
//                 position: 'fixed',
//                 left: `${x}px`,
//                 top: `${y}px`,
//               },
//             }}
//           />
//         )
//       case 'delete':
//         return (
//           <DeleteIcon
//             IconIosRemove={{
//               ref: c => this.icon = c,
//               style: {
//                 position: 'fixed',
//                 left: `${x}px`,
//                 top: `${y}px`,
//               },
//             }}
//           />
//         )
//       case 'cluster':
//         return (
//           <IconMdGitMerge
//             IconMdGitMerge={{
//               ref: c => this.icon = c,
//               style: {
//                 position: 'fixed',
//                 left: `${x}px`,
//                 top: `${y}px`,
//               },
//             }}
//           />
//         )
//       case 'addConnection':
//         return (
//           <AddConnectionIcon
//             IconVectorLine={{
//               ref: c => this.icon = c,
//               style: {
//                 position: 'fixed',
//                 left: `${x}px`,
//                 top: `${y}px`,
//               },
//             }}
//           />
//         )
//       default: return null
//     }
//   }

//   changeMode = (mode) => {
//     this.setState({ mode })
//   }
// }

// NewNode.propTypes = {
//   style: ViewPropTypes.style,
// }
// NewNode.defaultProps = {
//   style: {},
// }


// export default NewNode

