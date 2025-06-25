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
