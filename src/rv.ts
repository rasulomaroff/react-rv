import type { CleanupFn, EqualFn, Listener, Rv, RvInitOptions, RvOptions } from './types'

const defaultEq = <T>(oldValue: T, newValue: T): boolean => oldValue === newValue

/**
 * Creates a reactive variable (RV), allowing value retrieval, updates, and subscriptions.
 *
 * @template T The type of the stored value.
 *
 * @param val The initial value of the reactive variable.
 * @param opts Optional configuration for the reactive variable.
 *
 * @returns A reactive variable function that allows getting, setting, and listening for updates.
 *
 * @example
 * ```ts
 * // initialize a state variable with initial value set to 0
 * const positiveVar = rv(0, {
 *     // all options are optional
 *
 *     // define custom `eq` function that will be run on every value set to determine
 *     // whether or not value is going to be updated
 *     eq: (oldValue, newValue) => newValue > oldValue && newValue >= 0,
 *
 *     // define callback that's going to be run on every change
 *     on: (newValue, oldValue) => {}
 * })
 *
 * // alternatively, there's a handy function initializer
 * // all options are identical
 * const positiveVar = rv.fn(() => 0)
 *
 * // call variable function with no arguments to get its current value
 * const currentValue = positiveVar()
 *
 * // call variable function passing an argument in order to set it
 * // Won't trigger an update because the values are "equal" under this custom rule.
 * positiveVar(-3, {
 *     // override the initial `eq` function for this update call.
 *     eq: (oldValue, newValue) => newValue > oldValue
 *     // additionally, you can disable initial `eq` function by passing `false` here
 *     // it will use a default `eq` function which is just a strict check: `===`
 *     eq: false // in this case, update WILL happen
 * })
 *
 * // you can also subscribe to value without using any hooks
 * const unsubscribe = positiveVar.on((newValue, oldValue) => console.log(newValue, oldValue))
 *
 * positiveVar(4) // logs: 4
 *
 * unsubscribe()
 *
 * positiveVar(5) // there will be no logs
 * ```
 */
export function rv<T>(val: T, opts?: RvInitOptions<T>): Rv<T> {
    const { eq = defaultEq, on } = opts ?? <RvInitOptions<T>>{}

    const listeners = new Set<Listener<T>>()

    if (on) listeners.add(on)

    const fn: Rv<T> = (...args: [] | [newValue: T, opts?: RvOptions<T>]): T => {
        if (args.length === 0) return val

        const [newValue, opts] = args

        let eqfn: EqualFn<T> = eq

        if (typeof opts?.eq !== 'undefined') {
            eqfn = opts.eq === false ? defaultEq : opts.eq
        }

        if (eqfn(val, newValue)) return val

        const oldValue = val
        val = newValue

        listeners.forEach(cb => cb(newValue, oldValue))

        return val
    }

    fn.off = (f): void => void listeners.delete(f)
    fn.size = (): number => listeners.size

    fn.on = (listener): CleanupFn => {
        listeners.add(listener)

        return () => {
            listeners.delete(listener)
        }
    }

    return fn
}

/**
 * Creates a reactive variable from an initializer function.
 * The function is immediately executed to determine the initial value.
 *
 * @template T The type of the stored value.
 *
 * @param init A function that returns the initial value.
 * @param options Optional configuration for equality comparison and event listeners.
 *
 * @returns A reactive variable function.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
rv.fn = <T>(init: () => T, options?: RvInitOptions<T>) => rv(init(), options)
