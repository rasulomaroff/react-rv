# react-rv

react-rv is a lightweight and efficient state management library for React that allows you to create reactive variables and subscribe to them with minimal overhead.

## Features

- **Tiny**: No dependencies, minimal API surface.
- **Easier than React Context**: More efficient updates without unnecessary re-renders.
- **Efficient**: Only re-renders components that are subscribed to reactive variables.
- **Flexible**: Works inside and outside React components.
- **Custom equality checks**: Define your own comparison logic to avoid redundant updates.
- **TypeScript Support**: Fully typed for better developer experience.

##  Installation

### npm

```sh
npm install react-rv
```

### pnpm

```sh
pnpm add react-rv
```

### yarn

```sh
yarn add react-rv
```

## Examples

- Simple boolean flag

```tsx
const isOnlineVar = rv(true)

const toggleStatus = () => isOnlineVar(!isOnlineVar())

const App = () => {
    const isOnline = useRv(isOnlineVar)

    return (
        <div>
            <h1>{isOnline ? 'You are online' : 'You are offline'}</h1>
            <button onClick={toggleStatus}>Toggle Status</button>
        </div>
    )
}
```

- Syncing with a variable in local storage

```tsx
const darkThemeVar = rv.fn(
    () => {
        try {
            return JSON.parse(localStorage.getItem('darkTheme'))
        } catch {
            return false
        }
    },
    { on: val => localStorage.setItem('darkTheme', val) },
)

const toggleTheme = () => darkThemeVar(!darkThemeVar())

const Component = () => {
    const isDarkTheme = useRv(darkTheme)

    return (
      <>
          {isDarkTheme ? <...> : <...>}
          <button onClick={toggleTheme}>Toggle</button>
      </>
    )
}
```

## Why `react-rv` Over React Context?

- **More granual state splitting**: React Context would require to create a separate context for every piece of state you'd use, which would also force you to wrap the app with providers for each react context.
If you don't do that and decide to create one big state, it would involve unnecessary re-renders in components that only need one field of the state.
- **Simpler API**: No need for providers, reducers, or complex state logic.
- **No need for state setters**: The variable that's returned by `rv()` function is already a getter/setter itself.
- **Usage outside React component tree**: Since the variable itself is a setter as well, you can use it outside react component tree. For example in your util functions that's defined outside react components.

#### React Context example

```tsx
// you need to provide non-sensical default setters in order to please TypeScript
// or manually cast the value into the correct type
const CountContext = React.createContext({ count: 0, setCount: () => {} })
const NameContext = React.createContext({ name: "John", setName: () => {} })

const App = () => {
    // you need to use `useState` hook to manage getting/setting your state
    const [count, setCount] = useState(0)
    const [name, setName] = useState("John")

    // With react context, you need to wrap the app into providers.
    // Additionally, you need to provide "setters" for every state in case
    // this state can be updated.
    return (
        <CountContext.Provider value={{ count, setCount }}>
            <NameContext.Provider value={{ name, setName }}>
                {/* uses CountContext */}
                <Counter />
                {/* uses NameContext */}
                <NameDisplay />
            </NameContext.Provider>
        </CountContext.Provider>
  )
}

const Counter = () => {
    const { count, setCount } = useContext(CountContext)

    // you can only define your own custom setters inside react component tree
    // in order to get access to current state
    const increment = () => setCount(count + 1)

    return <button onClick={increment}>Count: {count}</button>;
}
```

#### react-rv example

```tsx
// after you provide these default values, you don't need to set them again in any `useState` hook
const countVar = rv(0)
const nameVar = rv("John")

// there's no need to use provider components
const App = () => (
    <>
        {/* uses countVar */}
        <Counter />
        {/* uses nameVar */}
        <NameDisplay />
    </>
)

// you can define your own setters anywhere and you can still read the current state.
// calling a reactive variable with no arguments will return its current value, no matter where you are.
const increment = () => countVar(countVar() + 1)

const Counter = () => {
    // whenever `countVar` value is updated, this hook will re-render this component
    const count = useRv(countVar)

    return <button onClick={increment}>Count: {count}</button>
}
```

## License

MIT

