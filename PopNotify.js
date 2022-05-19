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
    customClass,
    onClick,
    onClose,
    showClose,
    dangerouslyUseHTMLString,
  }) {
    this._closed = false
    this._className = "PopNotify" + " " + type
    this._id = "nid" + new Date().getTime()
    this._selector = "#" + this._id
    this._title = title
    this._content = content
    this._type = type !== undefined ? type : "info"
    this._fadeTime = fadeTime !== undefined ? fadeTime : 4500
    this._customClass = customClass !== undefined ? customClass : undefined
    this._onClick =
      onClick !== undefined
        ? onClick
        : () => {
            this.close(this)
          }
    this._onClose = onClose !== undefined ? onClose : () => {}
    this._showClose = showClose !== undefined ? showClose : true
    this._dangerouslyUseHTMLString =
      dangerouslyUseHTMLString !== undefined ? dangerouslyUseHTMLString : false
    this.create()
    this.anime("active")
      .then(() => sleep(this._fadeTime))
      .then(() => {
        return this._fadeTime !== 0 && !this._closed && this.close(this)
      })
  }
  create() {
    let notify = document.createElement("div")
    let title = document.createElement("div")
    let closeBtn = document.createElement("div")
    let firstLine = document.createElement("div")
    let content = document.createElement("div")
    if (this._dangerouslyUseHTMLString) {
      title.innerHTML = this._title
      content.innerHTML = this._content
    } else {
      content.innerText = this._content
      title.innerText = this._title
    }
    if (this._customClass) {
      notify.className = this._className + " " + this._customClass
    } else {
      notify.className = this._className
    }
    title.className = "PopNotify_title"
    content.className = "PopNotify_content"
    closeBtn.className = "PopNotify_closeBtn"
    closeBtn.innerHTML = closeBtnSvg
    closeBtn.onclick = () => {
      this.close(this)
    }
    closeBtn.setAttribute("style", `display: ${this._showClose ? "" : "none"}`)
    notify.id = this._id
    notify.onclick = this._onClick
    firstLine.className = "PopNotify_first-line"
    firstLine.append(title, closeBtn)
    notify.append(firstLine, content)
    document.querySelector("body").append(notify)
  }
  async anime(status) {
    let el = document.querySelector(this._selector)
    return await sleep(0).then((res) => {
      el.setAttribute("class", el.className + " " + status)
      return res
    })
  }
  close(notify) {
    if (!notify) notify = this
    this._closed = true
    return notify
      .anime("fade")
      .then((res) => {
        this._onClose()
        return res
      })
      .then(() => sleep(500))
      .then((res) => {
        document.querySelector(this._selector).remove()
        return res
      })
  }
}

let PopNotify = {
  success: (option) => {
    return new Notify({
      title: option.title,
      content: option.content,
      type: "success",
      fadeTime: option.fadeTime,
      customClass: option.customClass,
      onClick: option.onClick,
      onClose: option.onClose,
      showClose: option.showClose,
      dangerouslyUseHTMLString: option.dangerouslyUseHTMLString,
    })
  },
  error: (option) => {
    return new Notify({
      title: option.title,
      content: option.content,
      type: "error",
      fadeTime: option.fadeTime,
      customClass: option.customClass,
      onClick: option.onClick,
      onClose: option.onClose,
      showClose: option.showClose,
      dangerouslyUseHTMLString: option.dangerouslyUseHTMLString,
    })
  },
  info: (option) => {
    return new Notify({
      title: option.title,
      content: option.content,
      type: "info",
      fadeTime: option.fadeTime,
      customClass: option.customClass,
      onClick: option.onClick,
      onClose: option.onClose,
      showClose: option.showClose,
      dangerouslyUseHTMLString: option.dangerouslyUseHTMLString,
    })
  },
  warning: (option) => {
    return new Notify({
      title: option.title,
      content: option.content,
      type: "warning",
      fadeTime: option.fadeTime,
      customClass: option.customClass,
      onClick: option.onClick,
      onClose: option.onClose,
      showClose: option.showClose,
      dangerouslyUseHTMLString: option.dangerouslyUseHTMLString,
    })
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
