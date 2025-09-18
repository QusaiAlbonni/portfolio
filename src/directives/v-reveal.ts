import type { DirectiveBinding, Directive } from 'vue'

export interface RevealOptions {
  enter?: string
  initial?: string
  transition?: string
  threshold?: number
}

const DEFAULT = {
  enter: 'opacity-100 translate-y-0',
  initial: 'opacity-0 translate-y-6',
  transition: 'transition-all duration-700 ease-out',
  threshold: 0.15
}

const vReveal: Directive<HTMLElement, RevealOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RevealOptions>) {
    const val = binding.value ?? {}
    const enterClass = val.enter ?? DEFAULT.enter
    const initialClass = val.initial ?? DEFAULT.initial
    const transitionClass = val.transition ?? DEFAULT.transition
    const threshold = val.threshold ?? DEFAULT.threshold

    initialClass.split(/\s+/).forEach(c => { if (c) el.classList.add(c) })
    transitionClass.split(/\s+/).forEach(c => { if (c) el.classList.add(c) })

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            enterClass.split(/\s+/).forEach(c => { if (c) el.classList.add(c) })
            initialClass.split(/\s+/).forEach(c => { if (c) el.classList.remove(c) })
            if (binding.modifiers && binding.modifiers.once) obs.unobserve(el)
          } else if (!binding.modifiers || !binding.modifiers.once) {
            initialClass.split(/\s+/).forEach(c => { if (c) el.classList.add(c) })
            enterClass.split(/\s+/).forEach(c => { if (c) el.classList.remove(c) })
          }
        })
      },
      { threshold }
    )

    ;(el as any).__vRevealObserver = observer
    observer.observe(el)
  },

  unmounted(el: HTMLElement) {
    const obs = (el as any).__vRevealObserver as IntersectionObserver | undefined
    if (obs) {
      obs.disconnect()
      delete (el as any).__vRevealObserver
    }
  }
}

export default vReveal
