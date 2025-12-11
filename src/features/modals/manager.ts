export interface ScrimOptions {
  enterDelay?: number
  exitDelay?: number
  enterDuration?: number
  exitDuration?: number
  backgroundColor?: string
  opacity?: number
}

interface ScopeState {
  modals: Set<string>
  originalScrollPosition: number
  scrimOptions: ScrimOptions | null
}

class GlobalModalManager {
  private static instance: GlobalModalManager

  private scopes = new Map<string, ScopeState>()
  private scrollbarWidth: number = 0

  // iOS Safari state
  private readonly isIOSSafari: boolean
  private iosBackdrop: HTMLElement | null = null
  private originalBodyPosition: string = ''

  private constructor() {
    this.isIOSSafari = this.detectIOSSafari()
    this.scrollbarWidth = this.calculateScrollbarWidth()
  }

  public static getInstance(): GlobalModalManager {
    if (!GlobalModalManager.instance) {
      GlobalModalManager.instance = new GlobalModalManager()
    }
    return GlobalModalManager.instance
  }

  // ===========================================================================
  // DETECTION & CALCULATION
  // ===========================================================================

  private detectIOSSafari(): boolean {
    if (typeof window === 'undefined') return false
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) && 'ontouchend' in document
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)
    return isIOS && isSafari
  }

  private calculateScrollbarWidth(): number {
    if (typeof window === 'undefined') return 0
    return window.innerWidth - document.documentElement.clientWidth
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  public openModal(modalId: string, scopeId: string = 'body', scrimOptions?: ScrimOptions): void {
    let scope = this.scopes.get(scopeId)

    if (!scope) {
      scope = {
        modals: new Set(),
        originalScrollPosition: 0,
        scrimOptions: null,
      }
      this.scopes.set(scopeId, scope)
    }

    const wasEmpty = scope.modals.size === 0
    scope.modals.add(modalId)

    if (scrimOptions) {
      scope.scrimOptions = scrimOptions
    }

    if (wasEmpty) {
      this.lockScope(scopeId, scope)
    }
  }

  public closeModal(modalId: string, scopeId: string = 'body'): void {
    const scope = this.scopes.get(scopeId)
    if (!scope || !scope.modals.has(modalId)) return

    scope.modals.delete(modalId)

    if (scope.modals.size === 0) {
      this.unlockScope(scopeId, scope)
      this.scopes.delete(scopeId)
    }
  }

  public getOpenModalsCount(scopeId: string = 'body'): number {
    return this.scopes.get(scopeId)?.modals.size ?? 0
  }

  public isModalOpen(modalId: string, scopeId: string = 'body'): boolean {
    return this.scopes.get(scopeId)?.modals.has(modalId) ?? false
  }

  public hasActiveBodyLock(): boolean {
    return this.getOpenModalsCount('body') > 0
  }

  public getScrimOptions(scopeId: string = 'body'): ScrimOptions | null {
    return this.scopes.get(scopeId)?.scrimOptions ?? null
  }

  public getAllScopes(): Record<string, number> {
    const result: Record<string, number> = {}
    this.scopes.forEach((scope, scopeId) => {
      result[scopeId] = scope.modals.size
    })
    return result
  }

  public getActiveModals(): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    this.scopes.forEach((scope, scopeId) => {
      result[scopeId] = Array.from(scope.modals)
    })
    return result
  }

  // ===========================================================================
  // SCOPE LOCKING
  // ===========================================================================

  private lockScope(scopeId: string, scope: ScopeState): void {
    if (scopeId === 'body') {
      this.lockBody()
    } else {
      this.lockElement(scopeId, scope)
    }
  }

  private unlockScope(scopeId: string, scope: ScopeState): void {
    if (scopeId === 'body') {
      this.unlockBody()
    } else {
      this.unlockElement(scopeId, scope)
    }
  }

  private lockBody(): void {
    // Scrollbar width'i yeniden hesapla (viewport değişmiş olabilir)
    this.scrollbarWidth = this.calculateScrollbarWidth()

    if (this.isIOSSafari) {
      this.lockBodyIOS()
    } else {
      this.lockBodyStandard()
    }
  }

  private unlockBody(): void {
    if (this.isIOSSafari) {
      this.unlockBodyIOS()
    } else {
      this.unlockBodyStandard()
    }
  }

  private lockBodyStandard(): void {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${this.scrollbarWidth}px`
  }

  private unlockBodyStandard(): void {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }

  private lockBodyIOS(): void {
    this.originalBodyPosition = document.body.style.position

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'relative'

    this.iosBackdrop = document.createElement('div')
    this.iosBackdrop.id = 'ios-modal-backdrop'
    Object.assign(this.iosBackdrop.style, {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'var(--color-white)',
      zIndex: '999',
    })

    document.body.appendChild(this.iosBackdrop)
  }

  private unlockBodyIOS(): void {
    if (this.iosBackdrop?.parentNode) {
      this.iosBackdrop.parentNode.removeChild(this.iosBackdrop)
      this.iosBackdrop = null
    }

    document.body.style.overflow = ''
    document.body.style.position = this.originalBodyPosition
    this.originalBodyPosition = ''
  }

  private lockElement(scopeId: string, scope: ScopeState): void {
    const element = document.getElementById(scopeId)
    if (!element) return

    scope.originalScrollPosition = element.scrollTop
    element.style.overflow = 'hidden'
  }

  private unlockElement(scopeId: string, scope: ScopeState): void {
    const element = document.getElementById(scopeId)
    if (!element) return

    element.style.overflow = ''
    element.scrollTop = scope.originalScrollPosition
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  public reset(): void {
    if (this.iosBackdrop?.parentNode) {
      this.iosBackdrop.parentNode.removeChild(this.iosBackdrop)
      this.iosBackdrop = null
    }

    this.scopes.clear()

    document.body.style.position = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''

    document.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
      element.style.overflow = ''
    })
  }
}

export const modalManager = GlobalModalManager.getInstance()
