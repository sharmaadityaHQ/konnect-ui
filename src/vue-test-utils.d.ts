import type { DOMWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

declare module '@vue/test-utils' {
  // Augment VueWrapper class instance type via interface merging
  export interface VueWrapper<_VM = unknown, _T extends ComponentPublicInstance = _VM & ComponentPublicInstance> {
    findTestId(dataTestid: string): DOMWrapper<Element>
  }
}