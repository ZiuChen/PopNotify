import Notify from './Notify'
import type TNotify from './Notify'

const PopNotify = {
  queue: {
    'top-left': [] as any[],
    'top-right': [] as any[],
    'bottom-left': [] as any[],
    'bottom-right': [] as any[]
  },
  notify: function (option: INotifyOption) {
    return new Notify(option)
  },
  success: function (option: INotifyOption) {
    option.type = 'success'
    return new Notify(option)
  },
  error: function (option: INotifyOption) {
    option.type = 'error'
    return new Notify(option)
  },
  info: function (option: INotifyOption) {
    option.type = 'info'
    return new Notify(option)
  },
  warning: function (option: INotifyOption) {
    option.type = 'warning'
    return new Notify(option)
  },
  _updateOffset: function (n: TNotify) {
    // The `_offset` of each notify is assigned to the `_offset` of the previous notify
    // trigger from `n`, anime from `n` to the end
    return new Promise((res) => {
      let pos = n.position
      let queue = window.PopNotify.queue[pos]
      for (let i = queue.length - 1; i > 0; i--) {
        let notify = queue[i]
        if (notify._id === n._id) return res(true) // only anime notifies after `n`
        queue[i]._offset = queue[i - 1]._offset
        document.querySelector(notify._selector).style[pos.split('-')[0]] =
          notify._offset + 'px'
      }
      return res(true)
    })
  }
}

export default PopNotify
