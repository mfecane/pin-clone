import React from 'react'

import CollectionThumbnail from 'ts/components/collection-thumb'

import styles from 'ts/components/FirstRow.module.scss'

export default ({ items }) => {
  let itemsContent = items.map((item, index) => (
    <CollectionThumbnail item={item} key={index} index={index} />
  ))

  return (
    <>
      <div className={styles['upper-grid']}>{itemsContent}</div>
    </>
  )
}
