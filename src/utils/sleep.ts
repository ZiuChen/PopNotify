export default async function (timeout: number) {
  return new Promise((res) => {
    setTimeout(() => {
      return res(true)
    }, timeout)
  })
}
