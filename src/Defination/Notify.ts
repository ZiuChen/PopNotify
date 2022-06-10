import sleep from '../utils/sleep'
import CloseBtnSvg from '../assets/CloseBtnSvg'
import PopNotify from './PopNotify'

class Notify {
  title
  content: string
  type: 'success' | 'error' | 'info' | 'warning'
  fadeTime: number
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  customClass: string | undefined
  onClick: () => void
  onClose: () => void
  offset: number
  showClose: boolean
  dangerouslyUseHTMLString: boolean
  _className: string
  _id: string
  _selector: string
  _closed: boolean
  _offset: number
  constructor({
    title,
    content,
    type,
    fadeTime,
    position,
    customClass,
    onClick,
    onClose,
    offset,
    showClose,
    dangerouslyUseHTMLString
  }: INotifyOption) {
    this.title = title
    this.content = content
    this.type = type || 'info'
    this.fadeTime = fadeTime === undefined ? 4500 : fadeTime
    this.position = position || 'top-right'
    this.customClass = customClass || undefined
    this.onClick =
      onClick == undefined
        ? () => {
            this.close(this)
          }
        : onClick
    this.onClose = onClose || function () {}
    this.offset = offset || 0
    this.showClose = showClose == undefined ? true : false
    this.dangerouslyUseHTMLString = dangerouslyUseHTMLString || false
    this._className = `PopNotify ${this.type} ${this.position}`
    this._id = 'nid' + new Date().getTime()
    this._selector = '#' + this._id
    this._closed = false
    this._offset = 25
    this.create()
      .then(() => this.initOffset())
      .then(() => window.PopNotify.queue[this.position].push(this))
      .then(() => this.anime('active'))
      .then(() => sleep(this.fadeTime))
      .then(() => this.fadeTime !== 0 && !this._closed && this.close(this))
  }
  create() {
    return new Promise((res) => {
      let notify = document.createElement('div')
      let title = document.createElement('div')
      let closeBtn = document.createElement('div')
      let firstLine = document.createElement('div')
      let content = document.createElement('div')
      if (this.dangerouslyUseHTMLString) {
        title.innerHTML = this.title
        content.innerHTML = this.content
      } else {
        content.innerText = this.content
        title.innerText = this.title
      }
      notify.className = this.customClass
        ? `${this._className} ${this.customClass}`
        : `${this._className}`
      title.className = 'PopNotify_title'
      content.className = 'PopNotify_content'
      closeBtn.className = 'PopNotify_closeBtn'
      closeBtn.innerHTML = CloseBtnSvg
      closeBtn.onclick = (e) => {
        e.stopPropagation() // prevent event Propagation
        this.close(this)
      }
      closeBtn.setAttribute('style', `display: ${this.showClose ? '' : 'none'}`)
      notify.id = this._id
      notify.onclick = this.onClick
      firstLine.className = 'PopNotify_first-line'
      firstLine.append(title, closeBtn)
      notify.append(firstLine, content)
      document.querySelector('body')?.append(notify)
      return res(true)
    })
  }
  initOffset() {
    return new Promise((res) => {
      const GAP = 16
      const queue = window.PopNotify.queue[this.position]
      let length = queue.length
      let lastNotify = queue[length - 1]
      if (lastNotify === undefined) {
        this._offset = 25 + this.offset // first notify in queue
      } else {
        const el = document.querySelector(
          lastNotify._selector
        ) as HTMLDivElement
        this._offset = queue[length - 1]._offset + GAP + el.offsetHeight
      }
      const n = document.querySelector(this._selector) as HTMLDivElement
      const p = this.position.split('-')[0]
      if (p === 'top') n.style.top = this._offset.toString() + 'px'
      else n.style.bottom = this._offset.toString() + 'px'
      return res(true)
    })
  }
  async anime(status: string) {
    let el: any = document.querySelector(this._selector)
    return await sleep(0).then((res) => {
      el.className += ' ' + status
      return res
    })
  }
  close(notify: any) {
    if (this._closed) return
    if (!notify) notify = this
    this._closed = true
    return notify
      .anime('fade')
      .then(() => sleep(500)) // wait for fade anime
      .then(() => this.onClose())
      .then(() => PopNotify._updateOffset(notify))
      .then((res: any) => {
        document.querySelector(this._selector)?.remove()
        let index = window.PopNotify.queue[this.position].indexOf(this)
        window.PopNotify.queue[this.position].splice(index, 1)
        // delete this
        return res
      })
  }
}

export default Notify
