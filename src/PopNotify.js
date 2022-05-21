/* 
   PopNotify.js
   author @ZiuChen
   release under MIT license
*/

const closeBtnSvg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>`

class Notify {
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
    dangerouslyUseHTMLString,
  }) {
    this.title = title
    this.content = content
    this.type = type || "info"
    this.fadeTime = fadeTime === undefined ? 4500 : fadeTime
    this.position = position || "top-right"
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
    this._id = "nid" + new Date().getTime()
    this._selector = "#" + this._id
    this._closed = false
    this._offset = 25
    this.create()
      .then(() => this.initOffset())
      .then(() => PopNotify.queue[this.position].push(this))
      .then(() => this.anime("active"))
      .then(() => sleep(this.fadeTime))
      .then(() => this.fadeTime !== 0 && !this._closed && this.close(this))
  }
  create() {
    return new Promise((res) => {
      let notify = document.createElement("div")
      let title = document.createElement("div")
      let closeBtn = document.createElement("div")
      let firstLine = document.createElement("div")
      let content = document.createElement("div")
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
      title.className = "PopNotify_title"
      content.className = "PopNotify_content"
      closeBtn.className = "PopNotify_closeBtn"
      closeBtn.innerHTML = closeBtnSvg
      closeBtn.onclick = (e) => {
        e.stopPropagation() // prevent event Propagation
        this.close(this)
      }
      closeBtn.setAttribute("style", `display: ${this.showClose ? "" : "none"}`)
      notify.id = this._id
      notify.onclick = this.onClick
      firstLine.className = "PopNotify_first-line"
      firstLine.append(title, closeBtn)
      notify.append(firstLine, content)
      document.querySelector("body").append(notify)
      return res()
    })
  }
  initOffset() {
    return new Promise((res) => {
      const GAP = 16
      let queue = PopNotify.queue[this.position]
      let length = queue.length
      let lastNotify = queue[length - 1]
      if (lastNotify === undefined) {
        this._offset = 25 + this.offset // first notify in queue
      } else {
        this._offset =
          queue[length - 1]._offset +
          GAP +
          document.querySelector(lastNotify._selector).offsetHeight
      }
      document.querySelector(this._selector).style[this.position.split("-")[0]] =
        this._offset + "px"
      return res()
    })
  }
  async anime(status) {
    let el = document.querySelector(this._selector)
    return await sleep(0).then((res) => {
      el.className += " " + status
      return res
    })
  }
  close(notify) {
    if (this._closed) return
    if (!notify) notify = this
    this._closed = true
    return notify
      .anime("fade")
      .then(() => sleep(500)) // wait for fade anime
      .then(() => this.onClose())
      .then(() => PopNotify._updateOffset(notify))
      .then((res) => {
        document.querySelector(this._selector).remove()
        let index = PopNotify.queue[this.position].indexOf(this)
        PopNotify.queue[this.position].splice(index, 1)
        delete this
        return res
      })
  }
}

let PopNotify = {
  queue: {
    "top-left": [],
    "top-right": [],
    "bottom-left": [],
    "bottom-right": [],
  },
  notify: function (option) {
    return new Notify(option)
  },
  success: function (option) {
    option.type = "success"
    return new Notify(option)
  },
  error: function (option) {
    option.type = "error"
    return new Notify(option)
  },
  info: function (option) {
    option.type = "info"
    return new Notify(option)
  },
  warning: function (option) {
    option.type = "warning"
    return new Notify(option)
  },
  _updateOffset: function (n) {
    // The `_offset` of each notify is assigned to the `_offset` of the previous notify
    // trigger from `n`, anime from `n` to the end
    return new Promise((res) => {
      let pos = n.position
      let queue = PopNotify.queue[pos]
      for (let i = queue.length - 1; i > 0; i--) {
        let notify = queue[i]
        if (notify._id === n._id) return res() // only anime notifies after `n`
        queue[i]._offset = queue[i - 1]._offset
        document.querySelector(notify._selector).style[pos.split("-")[0]] = notify._offset + "px"
      }
      return res()
    })
  },
}

async function sleep(timeout) {
  return new Promise((res) => {
    setTimeout(() => {
      return res()
    }, timeout)
  })
}

window.PopNotify = PopNotify
