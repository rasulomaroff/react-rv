import { act, renderHook } from '@testing-library/react'
import { useRv } from './use-rv'
import { rv } from './rv'
import { useRef } from 'react'

describe('useRv hook', () => {
    it('returns the default value of the reactive variable', () => {
        const val = rv(3)
        const spy = vi.spyOn(val, 'on')

        const hookResult = renderHook(() => useRv(val))

        expect(hookResult.result.current).toBe(3)
        expect(spy).toBeCalledTimes(1)
    })

    it('reacts to the variable update with the state update', () => {
        const val = rv(3)
        const spy = vi.spyOn(val, 'on')

        const hookResult = renderHook(() => useRv(val))

        expect(hookResult.result.current).toBe(3)

        act(() => {
            val(6)
        })

        expect(hookResult.result.current).toBe(6)
        expect(spy).toBeCalledTimes(1)
    })

    it('reacts to multiple state updates', () => {
        const val = rv('hello')
        const spy = vi.spyOn(val, 'on')

        const hookResult = renderHook(() => useRv(val))

        expect(hookResult.result.current).toBe('hello')

        act(() => {
            val('there')
        })

        expect(hookResult.result.current).toBe('there')
        expect(spy).toBeCalledTimes(1)

        act(() => {
            val('world')
        })

        expect(hookResult.result.current).toBe('world')
        expect(spy).toBeCalledTimes(1)
    })

    it('does not update the state if the passed value is the same (primitive)', () => {
        const val = rv(true)

        const hookResult = renderHook(() => {
            const renderCount = useRef(0)
            renderCount.current++

            const state = useRv(val)

            return { state, renderCount: renderCount.current }
        })

        expect(hookResult.result.current.state).toBe(true)
        expect(hookResult.result.current.renderCount).toBe(1)

        act(() => {
            val(false)
        })

        expect(hookResult.result.current.state).toBe(false)
        expect(hookResult.result.current.renderCount).toBe(2)

        act(() => {
            val(false)
        })
        act(() => {
            val(false)
        })

        expect(hookResult.result.current.state).toBe(false)
        // still 2 after using the same value
        expect(hookResult.result.current.renderCount).toBe(2)

        act(() => {
            val(true)
        })

        expect(hookResult.result.current.renderCount).toBe(3)
        expect(hookResult.result.current.state).toBe(true)
    })
})
