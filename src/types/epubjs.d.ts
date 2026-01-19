declare module 'epubjs' {
  export interface BookOptions {
    openAs?: string
    encoding?: string
    replacements?: string
  }

  export interface RenditionOptions {
    width?: number | string
    height?: number | string
    ignoreClass?: string
    manager?: string
    view?: string
    flow?: string
    layout?: string
    spread?: string
    minSpreadWidth?: number
    stylesheet?: string
    resizeOnOrientationChange?: boolean
    script?: string
    infinite?: boolean
    overflow?: string
    snap?: boolean
    defaultDirection?: string
    allowScriptedContent?: boolean
  }

  export interface Location {
    start: { cfqi: number; cfi: string; displayed: { page: number; total: number } }
    end: { cfqi: number; cfi: string; displayed: { page: number; total: number } }
    atStart: boolean
    atEnd: boolean
  }

  export class Rendition {
    display(target?: string): Promise<void>
    resize(width?: number | string, height?: number | string): void
    spread(spread: string): void
    next(): Promise<void>
    prev(): Promise<void>
    on(event: string, listener: Function): void
    destroy(): void
    location: Location
  }

  export class Book {
    constructor(url?: string | ArrayBuffer, options?: BookOptions)
    renderTo(element: string | HTMLElement, options?: RenditionOptions): Rendition
    destroy(): void
    ready: Promise<void>
  }

  function ePub(url?: string | ArrayBuffer, options?: BookOptions): Book
  export default ePub
}
