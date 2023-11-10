export const LAYOUT_INFO = {
  cose: {
    title: 'cose',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/coseLayout.gif',
    content:
      'We present an algorithm for the layout of undirected compound graphs, relaxing restrictions of previously known algorithms in regards to topology and geometry. The algorithm is based on the traditional force-directed layout scheme with extensions to handle multi-level nesting, edges between nodes of arbitrary nesting levels, varying node sizes, and other possible application-specific constraints. Experimental results show that the execution time and quality of the produced drawings with respect to commonly accepted layout criteria are quite satisfactory. The algorithm has also been successfully implemented as part of a pathway integration and analysis toolkit named PATIKA, for drawing complicated biological pathways with compartmental constraints and arbitrary nesting relations to represent molecular complexes and various types of pathway abstractions.'
  },
  breadthfirst: {
    title: 'breadthfirst',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/breadthfirstLayout.gif',
    content: `Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key'[1]), and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.

    It uses the opposite strategy of depth-first search, which instead explores the node branch as far as possible before being forced to backtrack and expand other nodes.[2]`
  },
  concentric: {
    title: 'concentric',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/concentricLayout.gif',
    content:
      'The concentric layout can be made hierarchical by using the breadth-first search level as the metric. Though this results in a space-efficient result, it is less traditional than a typical top-down hierarchical layout.'
  },
  circle: {
    title: 'circle',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/circleLayout.gif',
    content:
      'The circle layout organises the nodes into a circle. By default, the nodes are placed clockwise from the 12 o’clock position, in the order that they are passed to the layout. You can control the order of the nodes by calling eles.sort().layout() or by ordering the elements as they are added to the graph. This layout helps to highlight the density of edges connected to different nodes, especially when the edges are made semitransparent.'
  },
  grid: {
    title: 'grid',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/gridLayout.gif',
    content:
      'The grid layout organises the nodes in a well-spaced grid. The nodes are placed from left to right and top to bottom, in the order they are passed to the layout. You can control the order by calling eles.sort().layout() or by ordering the elements as they are added to the graph. By default, the nodes are placed in a grid that fits the available viewport space well. If you can think of your nodes as being organised into several columns with one class of node per column — or similarly for rows — then the grid layout is a good fit. You can customise exactly which nodes go in which rows or columns. For example, a bipartite layout is just a two-column case of a grid layout.'
  },
  random: {
    title: 'random',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/randomLayout.gif',
    content: ''
  },
  euler: {
    title: 'euler',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/eulerLayout.gif',
    content:
      'The euler layout is a traditional force-directed algorithm. It is fairly fast. However, cola tends to give better results, and fcose tends to be both faster and higher quality.'
  },
  cise: {
    title: 'cise',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/ciseLayout.gif',
    content:
      'The cise layout organises the nodes into clusters. Each cluster is represented as a circle. Similar to the avsdf layout, this layout tries to avoid edge overlap within each circle. The clusters are positioned using a force-directed algorithm. If you have well defined clusters in your graph, the cise layout is a good fit.'
  },
  cola: {
    title: 'cola',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/colaLayout.gif',
    content:
      'The cola layout differentiates itself by allowing for setting constraints on top of the traditional force-directed physics simulation. If you want to set your own rules for how some nodes are organised, then cola is a good fit. This layout also tends to create smooth transitions in node position from one iteration to the next, so it is well suited to successive or infinite runs of the layout.'
  },
  dagre: {
    title: 'dagre',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/dagreLayout.gif',
    content:
      'The dagre layout is a traditional hierarchical layout. It looks like how people typically draw binary trees on a whiteboard: It has a nice inverted V shape from one level to the next. This should be one of the first layouts that you try if your graph is a DAG.'
  },
  avsdf: {
    title: 'avsdf',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/avsdfLayout.gif',
    content:
      'The avsdf layout is another circle layout. Whereas the circle layout is useful when you want to order the nodes yourself, the avsdf layout is useful when you want to automatically order the nodes to try to avoid edge overlap.'
  },
  spread: {
    title: 'spread',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/spreadLayout.gif',
    content:
      'The spread layout is a two-phased layout. First, it runs cose and then it spreads out the graph to fill out the viewport as much as possible. The spread layout is a good fit when you want the graph to be as spread out as possible while still having an overall force-directed organisation.'
  },
  klay: {
    title: 'klay',
    image: 'https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/klayLayout.gif',
    content:
      'The klay layout is a traditional hierarchical layout. It is the predecessor to the layered algorithm in elk. You may want to use klay for its smaller file size, if the layered algorithm of elk does not differ significantly for your dataset.'
  }
}
