export interface ModalInstance {
  id: string
  component: React.ComponentType<ModalComponentProps>
  props: Record<string, unknown>
  resolve?: (data?: unknown) => void
  reject?: (error?: unknown) => void
  zIndex: number
  createdAt: number
}

export interface ModalComponentProps {
  onClose: () => void
  [key: string]: unknown
}

export interface GlobalModalState {
  stack: ModalInstance[]
  nextZIndex: number
}

export interface GlobalModalActions {
  open: <T = unknown>(
    component: React.ComponentType<ModalComponentProps>,
    props?: Record<string, unknown>,
  ) => Promise<T>
  close: (id: string, data?: unknown) => void
  closeTop: (data?: unknown) => void
  clear: () => void
  isOpen: (id?: string) => boolean
  getTopModal: () => ModalInstance | null
}

export type GlobalModalStore = GlobalModalState & GlobalModalActions
