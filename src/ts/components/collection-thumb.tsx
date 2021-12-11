import React from 'react'
import { Link } from 'react-router-dom'

import style from 'ts/components/collection-thumb.module.scss'

// TODO change images on hover

const CollectionThumbnail = ({ item, index }) => {
  let displayImagesCount = 3
  let itemStyles = style['item']
  let itemGridStyles = style['item__grid']

  switch (item.index) {
    case 0:
      displayImagesCount = 5
      itemGridStyles += ' ' + style['item--grid-5x']
      itemStyles += ' ' + style['item--grid-5x']
      break
    case 1:
      displayImagesCount = 3
      break
    case 2:
    default:
      displayImagesCount = 3
      break
  }

  let displayImages = item.images.slice(0, displayImagesCount)
  if (displayImages.length < displayImagesCount) {
    displayImages = displayImages.concat(
      new Array(displayImagesCount - displayImages.length).fill({
        src: undefined,
      })
    )
  }

  const imageContent = displayImages.map(({ src }, index) => {
    let imageGridStyles = style['item__image-container']

    if (displayImagesCount === 5 && index === 0) {
      imageGridStyles += ' ' + style['item-5-images__image--span-h-v']
    }

    if (displayImagesCount === 5 && index === 2) {
      imageGridStyles += ' ' + style['item-5-images__image--span-v']
    }

    if (displayImagesCount === 3 && index === 0) {
      imageGridStyles += ' ' + style['item-3-images__image-first']
    }

    let image

    if (src) {
      image = <img src={src} className={style['item__image']} />
    } else {
      image = <span></span>
    }

    return (
      <div className={imageGridStyles} key={index}>
        {image}
      </div>
    )
  })

  return (
    <Link to={`/collections/${index}`}>
      <div className={style['item']}>
        <div className={style['item__header-container']}>
          <div className={style['item__name']}>Lorem, ipsum dolor.</div>
          <div className={style['item__header-menu']}></div>
          <div className={style['item__count']}>{item.images.length} items</div>
        </div>
        <div className={itemGridStyles}>{imageContent}</div>
      </div>
    </Link>
  )
}

// inherit, combine, show all from existring +
// found items

export default CollectionThumbnail
