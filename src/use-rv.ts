// using this package to support all react versions starting from 16.8 where hooks were just introduced
import { useSyncExternalStore } from 'use-sync-external-store/shim'

import type { Rv } from './types'

/**
 * Subscribes to a reactive variable and provides its current value,
 * updating the state when the variable is updated.
 *
 * @template T The type of the reactive variable's value.
 * @param rv The reactive variable to subscribe to.
 *
 * @returns The current value of the reactive variable.
 *
 * @example
 * ```tsx
 * import React from 'react'
 * import { rv, useRv } from 'react-rv'
 *
 * const counter = rv(0)
 *
 * const Counter = () => {
 *     const value = useRv(counter)
 *     return (
 *         <div>
 *             <p>Count: {value}</p>
 *             <button onClick={() => counter(value + 1)}>Increment</button>
 *         </div>
 *     )
 * }
 * ```
 */
export const useRv = <T>(rv: Rv<T>): T => useSyncExternalStore(rv.on, rv, rv)
