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
    this.position = position || "top-left"
    this.customClass = customClass || undefined
    this.onClick =
      onClick ||
      function () {
        this.close(this)
      }
    this.onClose = onClose || function () {}
    this.offset = offset || 0
    this.showClose = showClose || true
    this.dangerouslyUseHTMLString = dangerouslyUseHTMLString || false
    this._className = `PopNotify ${this.type} ${this.position}`
    this._id = "nid" + new Date().getTime()
    this._selector = "#" + this._id
    this._closed = false
    this._offset = 25
    this.create()
      .then(() => this.initOffset())
      .then(() => {
        return PopNotify.queue[this.position].push(this)
      })
      .then(() => this.anime("active"))
      .then(() => sleep(this.fadeTime))
      .then(() => {
        return this.fadeTime !== 0 && !this._closed && this.close(this)
      })
      .then(() => {
        return console.log(PopNotify.queue[this.position]) // FIXME: Debugging
      })
  }
  create() {
    return new Promise((res, rej) => {
      let notify = document.createElement("div")
      let title = document.createElement("h2")
      let closeBtn = document.createElement("div")
      let firstLine = document.createElement("div")
      let content = document.createElement("p")
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
    return new Promise((res, rej) => {
      const GAP = 16
      let queue = PopNotify.queue[this.position]
      let length = queue.length
      let lastNotify = queue[length - 1]
      if (lastNotify === undefined) {
        this._offset = 25
      } else {
        this._offset =
          this.offset +
          queue[length - 1]._offset +
          GAP +
          document.querySelector(lastNotify._selector).offsetHeight
      }
      console.log("this._offset " + this._offset)
      document.querySelector(this._selector).style[
        this.position.split("-")[0]
      ] = this._offset + "px"
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
      .then((res) => {
        this.onClose()
        return res
      })
      .then(() => sleep(500))
      .then(() => PopNotify.update(notify))
      .then((res) => {
        document.querySelector(this._selector).remove()
        let index = PopNotify.queue[this.position].indexOf(this)
        PopNotify.queue[this.position].splice(index, 1)
        console.log(PopNotify.queue[this.position])
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
  update: function (n) {
    // The `_offset` of each notify is assigned to the `_offset` of the previous notify
    // trigger from `n`, anime from `n` to the end
    return new Promise(async (res, rej) => {
      for (let pos in PopNotify.queue) {
        let queue = PopNotify.queue[pos]
        for (let i = queue.length - 1; i > 0; i--) {
          let notify = queue[i]
          console.log(i)
          if (notify._id === n._id) return res()
          // only anime notifies after `n`
          queue[i]._offset = queue[i - 1]._offset
          document.querySelector(notify._selector).style[pos.split("-")[0]] =
            notify._offset + "px"
        }
        for (let notify of queue) {
          // add anime for all notify at one time
          notify
            .anime("move")
            .then(() => sleep(200))
            .then(() =>
              document.querySelector(notify._selector).classList.remove("move")
            )
        }
      }
      return res()
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

window.PopNotify = PopNotify
