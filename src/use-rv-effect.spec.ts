import { renderHook, act } from '@testing-library/react'
import { useRvEffect } from './use-rv-effect'
import { rv } from './rv'

describe('useRvEffect hook', () => {
    it('should listen to rv updates', () => {
        const handler = vi.fn()
        const counter = rv(0)

        renderHook(() => {
            useRvEffect(counter, handler)
        })

        act(() => {
            counter(1)
        })

        expect(handler).toHaveBeenCalledWith(1, 0)
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it(`should not be triggered if state didn't change`, () => {
        const handler = vi.fn()
        const counter = rv(0)

        renderHook(() => {
            useRvEffect(counter, handler)
        })

        // no change
        act(() => {
            counter(0)
        })

        expect(handler).not.toHaveBeenCalled()
    })

    it('always has the most recent scope', () => {
        const counter = rv(0)
        const values: number[] = []

        const { rerender } = renderHook(
            ({ multiplier }: { multiplier: number }) => {
                useRvEffect(counter, v => {
                    values.push(v * multiplier)
                })
            },
            { initialProps: { multiplier: 1 } },
        )

        act(() => {
            counter(2)
        })

        rerender({ multiplier: 10 })

        act(() => {
            counter(3)
        })

        expect(values).toEqual([2, 30])
    })

    it('should unsubscribe on unmount', () => {
        const handler = vi.fn()
        const counter = rv(0)

        const { unmount } = renderHook(() => {
            useRvEffect(counter, handler)
        })

        unmount()

        act(() => {
            counter(1)
        })

        expect(handler).not.toHaveBeenCalled()
    })

    it("doesn't trigger re-render when rv updates", () => {
        const counter = rv(0)
        const renderSpy = vi.fn()

        renderHook(() => {
            renderSpy()
            useRvEffect(counter, () => {})
        })

        expect(renderSpy).toHaveBeenCalledTimes(1)

        act(() => {
            counter(1)
        })

        expect(renderSpy).toHaveBeenCalledTimes(1) // no re-render
    })
})
