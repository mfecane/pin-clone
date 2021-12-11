import React from 'react'

import styles from 'ts/components/MainGrid.module.scss'
import CollectionThumbnail from 'ts/components/collection-thumb'

const MainGrid = ({ items }) => {
  let itemsContent = items.map((item, index) => (
    <CollectionThumbnail item={item} key={index} index={index} />
  ))

  return <div className={styles['main-grid']}>{itemsContent}</div>
}

export default MainGrid
