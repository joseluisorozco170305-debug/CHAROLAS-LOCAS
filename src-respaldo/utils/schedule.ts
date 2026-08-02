import { config } from '../data/config'
import { horarios } from '../data/horarios'

type DayName = keyof typeof horarios

const labels: Record<DayName, string> = {
  Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles', Thursday: 'Jueves',
  Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo',
}

const minutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getBusinessStatus() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: config.timezone,
    weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date())
  const day = parts.find(p => p.type === 'weekday')?.value as DayName
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? 0)
  const current = hour * 60 + minute
  const range = horarios[day]
  if (!range) return { open: false, text: day === 'Monday' ? 'Cerrado los lunes' : 'Cerrado' }
  const [start, end] = range
  if (current >= minutes(start) && current < minutes(end)) return { open: true, text: 'Abierto ahora' }
  if (current < minutes(start)) return { open: false, text: `Abre hoy a las ${start}` }
  return { open: false, text: 'Cerrado por hoy' }
}

export function getTodayName() {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: config.timezone, weekday: 'long' }).format(new Date()) as DayName
  return labels[day]
}

export function isWednesday() {
  return new Intl.DateTimeFormat('en-US', { timeZone: config.timezone, weekday: 'long' }).format(new Date()) === 'Wednesday'
}
