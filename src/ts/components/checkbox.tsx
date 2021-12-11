import React, { useState } from 'react'
import _uniqueId from 'lodash/uniqueId'

import styles from 'ts/components/checkbox.module.scss'

export default ({ label }) => {
  const [id] = useState(_uniqueId('prefix-'))

  return (
    <div className={styles['check-wrapper']}>
      <input type="checkbox" className={styles['styled-checkbox']} id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
