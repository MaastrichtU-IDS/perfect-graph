type InteractionPointerEvents =
  | 'pointerdown'
  | 'pointercancel'
  | 'pointerup'
  | 'pointertap'
  | 'pointerupoutside'
  | 'pointermove'
  | 'pointerover'
  | 'pointerout'
type InteractionTouchEvents = 'touchstart' | 'touchcancel' | 'touchend' | 'touchendoutside' | 'touchmove' | 'tap'
type InteractionMouseEvents =
  | 'rightdown'
  | 'mousedown'
  | 'rightup'
  | 'mouseup'
  | 'rightclick'
  | 'click'
  | 'rightupoutside'
  | 'mouseupoutside'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
type InteractionPixiEvents = 'added' | 'removed'

export type InteractionEventTypes =
  | InteractionPointerEvents
  | InteractionTouchEvents
  | InteractionMouseEvents
  | InteractionPixiEvents
