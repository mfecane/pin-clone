import img1 from 'assets/images/albedo.jpg'
import img2 from 'assets/images/biba.jpg'
import img3 from 'assets/images/moto.jpg'
import img4 from 'assets/images/priestess.jpg'
import img5 from 'assets/images/dancer.jpg'
import img6 from 'assets/images/bastien.jpg'

const img = [img1, img2, img3, img4, img5, img6]

export default class Imageslist {
  collections = []
  length = 0

  constructor() {
    this.length = Math.floor(Math.random() * 30)
  }

  async createItems() {
    this.collections = await Promise.all(
      new Array(this.length)
        .fill(undefined)
        .map(async (el, index) => await this.createItem(index))
    )
  }

  async createItem(index: number) {
    let length = Math.floor(Math.random() * 50)

    let images = await Promise.all(
      new Array(length).fill(undefined).map(async () => {
        let src = img[Math.floor(Math.random() * img.length)]
        let [width, height] = await this.readImageDimensions(src)
        return {
          src,
          width,
          height,
        }
      })
    )

    return {
      index: index,
      images: images,
    }
  }

  getItems(from: number, num?: number) {
    if (!from && !num) {
      return this.collections.slice()
    }

    if (!num) {
      return this.collections.slice(from, this.collections.length - 1)
    }

    return this.collections.slice(from, num)
  }

  async readImageDimensions(src) {
    return new Promise((resolve, reject) => {
      let img = new Image()

      img.onload = function () {
        resolve([img.width, img.height])
      }

      img.onerror = function (e) {
        reject(e)
      }

      img.src = src
    })
  }
}
