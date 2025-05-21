import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import styles from './index.css'

const CustomFlagSeminovos = () => {
  const { query } = useRuntime()
  const [showFlag, setShowFlag] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query?.sc === '2') {
        setShowFlag(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [query?.sc])

  if (!showFlag) return null

  return <div className={styles.customFlagSeminovos}>Seminovo</div>
}

export default CustomFlagSeminovos
