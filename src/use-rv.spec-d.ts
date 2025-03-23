import { rv } from './rv'
import { useRv } from './use-rv'

describe('useRv hook', () => {
    it('infers the type of the variable correctly (primitive)', () => {
        const val = rv(2)

        const hookReturn = useRv(val)

        expectTypeOf(hookReturn).toBeNumber()
    })

    it('infers the type of the variable correctly (complex)', () => {
        type Obj = {
            name: string
            age: number
            data: Record<string, unknown>
        }

        const obj: Obj = {
            name: '',
            age: 0,
            data: {},
        }

        const val = rv(obj)

        const hookReturn = useRv(val)

        expectTypeOf(hookReturn).toMatchObjectType<Obj>()
    })
})
