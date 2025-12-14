import { AnimatePresence, TargetAndTransition, Transition, VariantLabels } from 'framer-motion'
import * as m from 'framer-motion/m'
import { createPortal } from 'react-dom'
import { ModalComponentProps, ModalInstance, useGlobalModalStore } from './store'
import { SafePortal } from '@/components/safe-portal'

interface MotionConfig {
  initial?: boolean | TargetAndTransition | VariantLabels | undefined
  animate?: boolean | TargetAndTransition | VariantLabels | undefined
  exit?: TargetAndTransition | VariantLabels | undefined
  transition?: Transition<any> | undefined
}

export function ModalWrapperMotion() {
  const store = useGlobalModalStore()
  const motionStack = store.motionStack

  return (
    <SafePortal>
      <AnimatePresence mode="sync">
        {motionStack.map((modal) => (
          <ModalLayerMotion key={modal.id} modal={modal} />
        ))}
      </AnimatePresence>
    </SafePortal>
  )
}

function ModalLayerMotion({ modal }: { modal: ModalInstance }) {
  const { close } = useGlobalModalStore()

  const Component = modal.component

  const modalProps: ModalComponentProps & { motionConfig?: MotionConfig } = {
    ...modal.props,
    onClose: () => close(modal.id),
    motionConfig: modal.props.motionConfig as MotionConfig,
  }

  const defaultMotionConfig: MotionConfig = {
    initial: { opacity: 0, y: -200, scale: 0.5 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 200, scale: 1.25 },
    transition: { duration: 0.3, ease: 'easeOut' },
  }

  return (
    <m.div
      data-modal-id={modal.id}
      data-modal-layer
      role="dialog"
      aria-modal="true"
      style={{ zIndex: modal.zIndex }}
      className="pointer-events-none fixed inset-0 z-1000"
    >
      <m.div
        className="fixed inset-0 flex h-dvh w-screen items-center justify-center p-0 md:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <m.div
          className="absolute inset-0 bg-black/50"
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <m.div
          className="relative"
          style={{ pointerEvents: 'auto' }}
          {...(modalProps.motionConfig || defaultMotionConfig)}
        >
          <Component {...modalProps} />
        </m.div>
      </m.div>
    </m.div>
  )
}

export function useMotionModal() {
  const { open } = useGlobalModalStore()

  const openMotion = <T = unknown,>(
    component: React.ComponentType<ModalComponentProps>,
    props?: Record<string, unknown>,
    options?: {
      closeOnOutsideClick?: boolean
      motionConfig?: MotionConfig
    },
  ): Promise<T> => {
    return open<T>(
      component,
      {
        ...props,
        motionConfig: options?.motionConfig,
      },
      {
        closeOnOutsideClick: options?.closeOnOutsideClick,
        isMotion: true,
      },
    )
  }

  return { open: openMotion }
}
