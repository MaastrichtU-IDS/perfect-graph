export const animationOptions = {
  // // Whether to animate while running the layout
  // // true : Animate continuously as the layout is running
  // // false : Just show the end result
  // // 'end' : Animate with the end result, from the initial positions to the end positions
  animate: 'end',

  // // Easing of the animation for animate:'end'
  animationEasing: 'linear',

  // // The duration of the animation for animate:'end'
  animationDuration: 1000,

  // // A function that determines whether the node should be animated
  // // All nodes animated by default on animate enabled
  // // Non-animated nodes are positioned immediately when the layout starts
  // animateFilter: (node, i) => true,
  animateFilter: () => true,

  // // The layout animates only after this many milliseconds for animate:true
  // // (prevents flashing on fast runs)
  animationThreshold: 250,

} as const
