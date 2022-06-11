const POS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const TYPES = ['success', 'error', 'info', 'warning']
document.querySelector(`.notify`).onclick = () => {
  PopNotify.notify({
    title: 'PopNotify',
    content: 'As you can see, This is the Demo of PopNotify.'
  })
}
document.querySelector(`.p-notify`).onclick = () => {
  PopNotify.notify({
    title: 'PopNotify',
    content: 'As you can see, This is the Demo of PopNotify.',
    fadeTime: 0
  })
}
POS.forEach((p) => {
  document.querySelector(`.${p}`).onclick = () => {
    PopNotify.notify({
      title: 'PopNotify',
      content: 'As you can see, This is the Demo of PopNotify.',
      position: p
    })
  }
})
TYPES.forEach((t) => {
  document.querySelector(`.${t}`).onclick = () => {
    PopNotify[t]({
      title: 'PopNotify',
      content: 'As you can see, This is the Demo of PopNotify.'
    })
  }
})
document.querySelector(`.offset`).onclick = () => {
  PopNotify.notify({
    title: 'PopNotify',
    content: 'As you can see, This is the Demo of PopNotify.',
    offset: 200
  })
}
document.querySelector(`.html`).onclick = () => {
  PopNotify.notify({
    title: 'PopNotify',
    content: /* html */ `<a href="javascript:;">This is link in content.</a>`,
    dangerouslyUseHTMLString: true
  })
}
document.querySelector(`.close-btn`).onclick = () => {
  PopNotify.notify({
    title: 'PopNotify',
    content: 'As you can see, This is the Demo of PopNotify.',
    showClose: false
  })
}
setTimeout(() => {
  PopNotify.success({
    title: 'PopNotify',
    content: 'As you can see, This is the Demo of PopNotify.'
  })
}, 1000)
