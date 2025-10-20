import { rv } from './rv'

describe('rv function', () => {
    it('infers the type of the variable correctly (primitive)', () => {
        const val = rv(2)

        expectTypeOf(val()).toBeNumber()
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

        expectTypeOf(val()).toMatchObjectType<Obj>()
    })

    it('infers variable type in a subscription parameter', () => {
        const val = rv(2, {
            on: (v, o) => {
                expectTypeOf(v).toBeNumber()
                expectTypeOf(o).toBeNumber()
            },
        })

        val.on((v, o) => {
            expectTypeOf(v).toBeNumber()
            expectTypeOf(o).toBeNumber()
        })
    })

    it('infers the type of the variable correctly (primitive) with a function initializer', () => {
        const val = rv.fn(() => 2)

        expectTypeOf(val()).toBeNumber()
    })

    it('infers the type of the variable correctly (complex) with a function initializer', () => {
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

        const val = rv.fn(() => obj)

        expectTypeOf(val()).toMatchObjectType<Obj>()
    })

    it('infers variable type in a subscription parameter', () => {
        const val = rv.fn(() => 3, {
            on: (v, o) => {
                expectTypeOf(v).toBeNumber()
                expectTypeOf(o).toBeNumber()
            },
        })

        val.on((v, o) => {
            expectTypeOf(v).toBeNumber()
            expectTypeOf(o).toBeNumber()
        })
    })

    it('infers eq function argument types correctly', () => {
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

        rv(obj, {
            eq: (ov, nv) => {
                expectTypeOf(ov).toMatchObjectType<Obj>()
                expectTypeOf(nv).toMatchObjectType<Obj>()

                return true
            },
        })
    })

    it('infers eq function argument types correctly for reactive variable itself', () => {
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

        const objrv = rv(obj)

        objrv(obj, {
            eq: (ov, nv) => {
                expectTypeOf(ov).toMatchObjectType<Obj>()
                expectTypeOf(nv).toMatchObjectType<Obj>()

                return true
            },
        })
    })

    it('only allows passing primitives of the same type', () => {
        const rvvar = rv('st')

        rvvar('should be okay')
        // @ts-expect-error it shouldn't allow passing number here
        rvvar(2)
        // @ts-expect-error it shouldn't allow passing undefined here
        rvvar(undefined)
    })

    it('only allows passing complex objects of the same type', () => {
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

        val(obj)
        // @ts-expect-error it shouldn't allow passing empty object here
        val({})
        // @ts-expect-error it shouldn't allow passing number here
        val(3)
    })
})

describe('rv.infer method', () => {
    it('infers a primitive type of rv', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const num = rv(3)

        type Inferred = rv.infer<typeof num>

        expectTypeOf<Inferred>().toBeNumber()
    })

    it('infers a complex type of rv', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const obj = rv({ name: '', age: 0, data: {} })

        type Inferred = rv.infer<typeof obj>

        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        expectTypeOf<Inferred>().toMatchObjectType<{ name: string; age: number; data: {} }>()
    })

    it('infers as never and throws a type error if it is not a reactive variable', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const justNumber = 30

        // @ts-expect-error should throw an error since it's not a reactive variable
        type Inferred = rv.infer<typeof justNumber>

        expectTypeOf<Inferred>().toBeNever()
    })
})
