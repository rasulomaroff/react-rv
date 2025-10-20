import { renderHook } from '@testing-library/react'
import { useRvEffect } from './use-rv-effect'
import { rv } from './rv'

describe('useRvEffect hook', () => {
    it('should infer payload type correctly', () => {
        const counter = rv(0)

        renderHook(() => {
            useRvEffect(counter, (newVal, oldVal) => {
                expectTypeOf(newVal).toBeNumber()
                expectTypeOf(oldVal).toBeNumber()
            })
        })

        const stringVar = rv<'one' | 'two'>('one')

        renderHook(() => {
            useRvEffect(stringVar, (newVal, oldVal) => {
                expectTypeOf(newVal).toEqualTypeOf<'one' | 'two'>()
                expectTypeOf(oldVal).toEqualTypeOf<'one' | 'two'>()
            })
        })
    })
})
