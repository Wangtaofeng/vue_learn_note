export default function getList (index) {
  return new Promise(resolve => {
    let res = []
    for (let i = index; i < index + 15; i++) {
      res[i - 1] = { image_url: `/static/img/${i}.png`, tittle: `这是第${i}张图片` }
    }
    return resolve(res)
  })
}