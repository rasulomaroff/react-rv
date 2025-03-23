import type { CleanupFn, EqualFn, Listener, Rv, RvOptions } from './types'

/** guard for type-safety */
const isEmpty = (val: unknown[]): val is [] => val.length === 0

const defaultEq = <T>(oldValue: T, newValue: T): boolean => oldValue === newValue

/**
 * Creates a reactive variable (RV), allowing value retrieval, updates, and subscriptions.
 *
 * @template T The type of the stored value.
 * @param val The initial value of the reactive variable.
 * @param options Optional configuration for the reactive variable.
 *
 * @returns A reactive variable function that allows getting, setting, and listening for updates.
 */
export function rv<T>(val: T, options?: Partial<{ eq: EqualFn<T> }>): Rv<T> {
    const { eq = defaultEq } = options ?? {}

    const listeners = new Set<Listener<T>>()

    const fn: Rv<T> = (...args: [] | [newValue: T, options?: RvOptions<T>]): T => {
        if (isEmpty(args)) return val

        const [newValue, options] = args

        let eqfn: EqualFn<T> = eq

        if (typeof options?.eq !== 'undefined') {
            eqfn = options.eq === false ? defaultEq : options.eq
        }

        if (eqfn(val, newValue)) return val

        val = newValue

        listeners.forEach(cb => cb(newValue))

        return val
    }

    fn.on = (listener): CleanupFn => {
        listeners.add(listener)

        return () => {
            listeners.delete(listener)
        }
    }

    return fn
}
