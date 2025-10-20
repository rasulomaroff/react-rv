import { useEffect, useRef } from 'react'
import type { Listener, Rv } from './types'

/**
 * React hook to subscribe to updates of a reactive variable.
 *
 * Note: callback is always using current scope.
 *
 * @example
 * ```ts
 * const counter = rv(0)
 *
 * useRvEffect(counter, (newVal, oldVal) => {
 *     console.table({ newVal, oldVal })
 * })
 * ```
 *
 * @param rv - The reactive variable to subscribe to.
 * @param f - A callback function triggered whenever the reactive variable is updated.
 *            The first and second arguments are the new and the old value of this `rv`.
 */
export function useRvEffect<T>(rv: Rv<T>, f: Listener<T>): void {
    const fnRef = useRef(f)
    fnRef.current = f

    useEffect(() => rv.on((...args) => fnRef.current(...args)), [rv])
}
