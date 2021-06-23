# FrontEnd

## Create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have Node >= 10.16 and npm >= 5.6 on your machine.

Create React App doesn’t handle backend logic or databases; it just creates a frontend build pipeline, so you can use it with any backend you want. Under the hood, it uses Babel and webpack, but you don’t need to know anything about them.

```sh
npm install -g create-react-app  # global install of CRA
npm init react-app . --legacy-peer-deps # create CRA
	# add flag --legacy-peer-deps with npm version > 7.0
```

## NPM Packages

- [moment](https://momentjs.com) [react-moment](https://www.npmjs.com/package/react-moment)
- [antd](https://ant.design/docs/react/introduce)
- [@ant-design/icons](https://ant.design/components/icon/)
- [react-router-dom](https://reactrouter.com/web/guides/quick-start)
- [axios](https://www.npmjs.com/package/axios)
- [DEV] eslint eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
- [DEV] prettier eslint-config-prettier eslint-plugin-prettier

## References

- [awesome react components](https://github.com/brillout/awesome-react-components)

## REACT PERFORMACE

[references](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab)

- Using Immutable data structures
- React.Fragments (lets you group a list of children without adding an extra node)
- shouldComponentUpdate / PureComponent / React.memo()
- Debouncing (delay for user handler to no)
- Avoiding Props in Initial States (Using props to initialize a state in constructor function often leads to duplication of “source of truth”)
- Using Web Workers for CPU Extensive Tasks
- useContext API only for not frequently state change (when change state every component are updated)
