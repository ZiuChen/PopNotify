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
    showClose,
    dangerouslyUseHTMLString,
  }) {
    this.title = title
    this.content = content
    this.type = type || "info"
    this.fadeTime = fadeTime === undefined ? 4500 : fadeTime
    this.position = position || "top-left"
    this.customClass = customClass || undefined
    this.onClick =
      onClick ||
      function () {
        this.close(this)
      }
    this.onClose = onClose || function () {}
    this.showClose = showClose || true
    this.dangerouslyUseHTMLString = dangerouslyUseHTMLString || false
    this.className = `PopNotify ${this.type} ${this.position}`
    this.id = "nid" + new Date().getTime()
    this.selector = "#" + this.id
    this.closed = false
    this.create()
    this.anime("active")
      .then(() => sleep(this.fadeTime))
      .then(() => {
        return this.fadeTime !== 0 && !this.closed && this.close(this)
      })
  }
  create() {
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
      ? `${this.className} ${this.customClass}`
      : `${this.className}`
    title.className = "PopNotify_title"
    content.className = "PopNotify_content"
    closeBtn.className = "PopNotify_closeBtn"
    closeBtn.innerHTML = closeBtnSvg
    closeBtn.onclick = () => {
      this.close(this)
    }
    closeBtn.setAttribute("style", `display: ${this.showClose ? "" : "none"}`)
    notify.id = this.id
    notify.onclick = this.onClick
    firstLine.className = "PopNotify_first-line"
    firstLine.append(title, closeBtn)
    notify.append(firstLine, content)
    document.querySelector("body").append(notify)
  }
  async anime(status) {
    let el = document.querySelector(this.selector)
    return await sleep(0).then((res) => {
      el.className += " " + status
      return res
    })
  }
  close(notify) {
    if (this.closed) return
    if (!notify) notify = this
    this.closed = true
    return notify
      .anime("fade")
      .then((res) => {
        this.onClose()
        return res
      })
      .then(() => sleep(500))
      .then((res) => {
        document.querySelector(this.selector).remove()
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
    let notify = new Notify(option)
    this.queue[notify.position].push(notify)
    return notify
  },
  success: function (option) {
    option.type = "success"
    let notify = new Notify(option)
    return notify
  },
  error: function (option) {
    option.type = "error"
    let notify = new Notify(option)
    return notify
  },
  info: function (option) {
    option.type = "info"
    let notify = new Notify(option)
    return notify
  },
  warning: function (option) {
    option.type = "warning"
    let notify = new Notify(option)
    return notify
  },
}

async function sleep(timeout) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      return res()
    }, timeout)
  })
}

function Parser(string, selector) {
  return new DOMParser()
    .parseFromString(string, "text/html")
    .querySelectorAll(selector)
}
