export const getTextColorClass = (color?: string | null) => {
  switch (color) {
    case 'light':
      return 'text-white'
    case 'dark':
      return 'text-black'
    case 'primary':
      return 'text-primary'
    case 'secondary':
      return 'text-secondary'
    case 'accent':
      return 'text-accent'
    default:
      return ''
  }
}

export const getObjectPositionClass = (align?: string | null) => {
  switch (align) {
    case 'top-left':
      return 'object-left-top'
    case 'top-center':
      return 'object-top'
    case 'top-right':
      return 'object-right-top'
    case 'center-left':
      return 'object-left'
    case 'center':
      return 'object-center'
    case 'center-right':
      return 'object-right'
    case 'bottom-left':
      return 'object-left-bottom'
    case 'bottom-center':
      return 'object-bottom'
    case 'bottom-right':
      return 'object-right-bottom'
    default:
      return 'object-center'
  }
}
