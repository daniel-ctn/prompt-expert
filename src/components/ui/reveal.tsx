'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

const BASE_DELAY_STEP = 0.04

function getEnterOffset(axis: 'x' | 'y', distance: number) {
  if (axis === 'x') {
    return { x: distance, y: 0 }
  }

  return { x: 0, y: distance }
}

export function FadeIn({
  children,
  className,
  delay = 0,
  distance = 18,
  axis = 'y',
  once = true,
  amount = 0.2,
  ...props
}: HTMLMotionProps<'div'> & {
  delay?: number
  distance?: number
  axis?: 'x' | 'y'
  once?: boolean
  amount?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const offset = prefersReducedMotion
    ? { x: 0, y: 0 }
    : getEnterOffset(axis, distance)

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: prefersReducedMotion ? 0.12 : 0.32,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({
  children,
  className,
  delay = 0,
  stagger = BASE_DELAY_STEP,
  once = true,
  amount = 0.15,
  ...props
}: HTMLMotionProps<'div'> & {
  delay?: number
  stagger?: number
  once?: boolean
  amount?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: prefersReducedMotion ? 0 : stagger,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  distance = 16,
  ...props
}: HTMLMotionProps<'div'> & {
  distance?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: prefersReducedMotion ? 0 : distance,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: prefersReducedMotion ? 0.12 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverScale({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { scale: 1.01, y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
      transition={{
        duration: prefersReducedMotion ? 0.12 : 0.18,
        ease: 'easeOut',
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
