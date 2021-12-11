import React from 'react'
import { Link } from 'react-router-dom'
import styles from 'ts/components/header.module.scss'

export default (props) => {
  return (
    <div className={styles['header-content']}>
      <Link to="/" className={styles['header-content__logo']}>
        <div className={styles['header-content__logo']}></div>
      </Link>
      <input type="text" className={styles['header-content__search']} />
      <div className={styles['header-content__name']}>Mfecane</div>
      <div className={styles['header-content__face']}></div>
    </div>
  )
}
