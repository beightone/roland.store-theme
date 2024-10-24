/* eslint-disable vtex/prefer-early-return */
import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.css'

const formatTime = (time: number): string => {
  return time < 10 ? `0${time}` : time.toString()
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownProps {
  targetDate: string
  active: boolean
}

const Countdown = ({ targetDate: deadline, active }: CountdownProps) => {
  const targetDate = new Date(deadline).getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const savedTimeLeft = useRef<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!active) {
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance >= 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        const newTimeLeft = { days, hours, minutes, seconds }

        if (
          JSON.stringify(savedTimeLeft.current) !== JSON.stringify(newTimeLeft)
        ) {
          savedTimeLeft.current = newTimeLeft
          setTimeLeft(newTimeLeft)
        }
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate, active])

  if (!active || targetDate < new Date().getTime()) {
    return null
  }

  return (
    <div className={styles['countdown-wrapper']}>
      <div className={styles['time-container']}>
        <div className={styles.days}>
          <span className={styles.number}>{formatTime(timeLeft.days)}</span>
          <span className={styles.label}>Dias</span>
        </div>
        <div className={styles.separator} />
        <div className={styles.hours}>
          <span className={styles.number}>{formatTime(timeLeft.hours)}</span>
          <span className={styles.label}>Horas</span>
        </div>
        <div className={styles.separator} />
        <div className={styles.minutes}>
          <span className={styles.number}>{formatTime(timeLeft.minutes)}</span>
          <span className={styles.label}>Minutos</span>
        </div>
        <div className={styles.separator} />
        <div className={styles.seconds}>
          <span className={styles.number}>{formatTime(timeLeft.seconds)}</span>
          <span className={styles.label}>Segundos</span>
        </div>
      </div>
    </div>
  )
}

Countdown.schema = {
  title: 'Configuração - Countdown',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      type: 'string',
      widget: {
        'ui:widget': 'date-time',
      },
    },
    active: {
      title: 'Ativar contagem regressiva?',
      type: 'boolean',
    },
  },
}

export default Countdown
