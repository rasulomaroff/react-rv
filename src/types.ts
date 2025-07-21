/**
 * A function that listens to reactive variable updates.
 *
 * @template T The type of the value being listened to.
 *
 * @param val The updated value of the reactive variable.
 * @param old The old value of the reactive variable.
 */
export type Listener<T> = (val: T, old: T) => void

/**
 * A function that cleans up event listener.
 */
export type CleanupFn = () => void

/**
 * A function to compare old and new values for equality.
 *
 * @template T The type of values being compared.
 *
 * @param oldValue The previous value.
 * @param newValue The new value to compare against.
 *
 * @returns `true` if values are considered equal, `false` otherwise.
 */
export type EqualFn<T> = (oldValue: T, newValue: T) => boolean

/**
 * Options for configuring a reactive variable.
 *
 * @template T The type of the reactive variable's value.
 */
export type RvOptions<T> = {
    /**
     * Custom equality function to determine if the value should update.
     * If set to `false`, the default equality function will be used.
     */
    eq?: false | EqualFn<T>
}

/**
 * A reactive variable (RV) function that allows getting, setting, and subscribing to changes.
 *
 * @template T The type of the stored value.
 */
export interface Rv<T> {
    /**
     * Retrieves the current value of the reactive variable.
     *
     * @returns The current value of type `T`.
     */
    (): T
    /**
     * Updates the value of the reactive variable.
     *
     * @param newValue The new value to set.
     * @param options Optional configuration for the update.
     *
     * @returns The updated value.
     */
    (newValue: T, options?: RvOptions<T>): T
    /**
     * Subscribes a listener to value changes.
     *
     * @param listener A callback function that is triggered when the value changes.
     *
     * @returns A cleanup function to remove the listener.
     */
    on: (listener: Listener<T>) => CleanupFn
    /**
     * Unsubscribes a listener from value changes.
     *
     * @param listener A callback function that is needed to be unsubscribed.
     */
    off: (listener: Listener<T>) => void
    /**
     * Returns the number of listeners for this reactive variable.
     *
     * @returns listener count.
     */
    size: () => number
}

/**
 * Configuration options for initializing a reactive variable.
 *
 * @template T The type of the reactive variable's value.
 */
export type RvInitOptions<T> = {
    /**
     * Custom equality function to determine if the value should update.
     */
    eq?: EqualFn<T>
    /**
     * A callback function triggered whenever the reactive variable is updated.
     *
     * @param val The new value of the reactive variable.
     */
    on?: Listener<T>
}

/**
 * A factory function for creating reactive variables.
 */
export interface RvInit {
    /**
     * Creates a reactive variable (RV), allowing value retrieval, updates, and subscriptions.
     *
     * @template T The type of the stored value.
     *
     * @param val The initial value of the reactive variable.
     * @param options Optional configuration for the reactive variable.
     *
     * @returns A reactive variable function that allows getting, setting, and listening for updates.
     */
    <T>(val: T, options?: RvInitOptions<T>): Rv<T>
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
    fn: <T>(init: () => T, options?: RvInitOptions<T>) => Rv<T>
}
