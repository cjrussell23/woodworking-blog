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
