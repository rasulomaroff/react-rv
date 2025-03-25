import { rv } from './rv'

describe('rv function', () => {
    it('returns the default value if called with no arguments', () => {
        const val = rv(2)

        expect(val()).toBe(2)
        expect(val()).toBe(2)
    })

    it('sets another value if argument is passed', () => {
        const val = rv(2)

        expect(val(3)).toBe(3)
        expect(val()).toBe(3)
    })

    it('does not update value if equal function returns true', () => {
        const val = rv(2, { eq: (a, b) => a % 2 === b % 2 })

        expect(val(4)).toBe(2) // Since 2 and 4 are both even, eq function prevents update
        expect(val()).toBe(2)
    })

    it('updates value if equal function returns false', () => {
        const val = rv(2, { eq: (a, b) => a % 2 === b % 2 })

        expect(val(3)).toBe(3) // 2 is even, 3 is odd, so the value updates
        expect(val()).toBe(3)
    })

    it('it uses default comparator when "false" is passed, while the global comparator is set initially', () => {
        const val = rv(2, { eq: (a, b) => a % 2 === b % 2 })

        expect(val(4, { eq: false })).toBe(4)
    })

    it('uses custom comparator instead of global one', () => {
        // always not equal, thus, settings new state
        const val = rv(2, { eq: () => false })

        expect(val(4, { eq: () => true })).toBe(2)
    })

    it('calls listeners when value changes', () => {
        const val = rv(2)
        const listener = vi.fn()

        val.on(listener)

        val(3)
        expect(listener).toHaveBeenCalledExactlyOnceWith(3)
    })

    it('allows to pass the default listener', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = vi.fn(() => {})

        const val = rv(2, { on: listener })

        val.on(listener)

        val(3)
        expect(listener).toHaveBeenCalledExactlyOnceWith(3)
    })

    it('does not call listeners if value does not change', () => {
        const val = rv(2)
        const listener = vi.fn()

        val.on(listener)

        val(2)
        expect(listener).not.toHaveBeenCalled()
    })

    it('removes listener correctly', () => {
        const val = rv(2)
        const listener = vi.fn()

        const unsubscribe = val.on(listener)

        unsubscribe()

        val(3)
        expect(listener).not.toHaveBeenCalled()
    })

    it('allows to initiate value with a function', () => {
        const val = rv.fn(() => 30)

        expect(val()).toBe(30)
    })
})
