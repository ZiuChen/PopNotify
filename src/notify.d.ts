declare interface INotifyOption {
  title: string
  content: string
  type?: 'success' | 'error' | 'info' | 'warning'
  fadeTime?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  customClass?: string | undefined
  onClick?: () => void
  onClose?: () => void
  offset?: number
  showClose?: boolean
  dangerouslyUseHTMLString?: boolean
}

declare interface Window {
  PopNotify: any
}
