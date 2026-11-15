import type { Transition, Variants } from "framer-motion"

/** Shared easing: fast start, long soft landing. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const smooth: Transition = { duration: 0.7, ease: EASE_OUT }

/** Fade + rise, for use with whileInView / initial+animate. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: smooth },
}

/** Parent that staggers its children's `fadeUp`. */
export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Props for "animate once when scrolled into view". */
export const inView = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.3 },
} as const
