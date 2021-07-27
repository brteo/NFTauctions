# FrontEnd

Single Page Application at [http://localhost/](http://localhost/)

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
- [antd-img-crop](https://github.com/nanxiaobei/antd-img-crop)
- [react-router-dom](https://reactrouter.com/web/guides/quick-start)
- [axios](https://www.npmjs.com/package/axios)
- @craco/craco craco-less ([Less ant customization](https://ant.design/docs/react/use-with-create-react-app))
- i18next react-i18next i18next-browser-languagedetector i18next-http-backend ([Langs](https://react.i18next.com/latest/using-with-hooks))
- [aws-sdk](https://www.npmjs.com/package/aws-sdk)

DEV

- [eslint](https://eslint.org/docs/user-guide/getting-started) eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
- [prettier](https://prettier.io/docs/en/index.html) eslint-config-prettier eslint-plugin-prettier

## Insights...

- [React.Memo](https://dmitripavlutin.com/use-react-memo-wisely/)
- [useContext](https://it.reactjs.org/docs/hooks-reference.html#usecontext)
- [React.StrictMode](https://it.reactjs.org/docs/strict-mode.html) (removed!)
- [Suspence](- [React.StrictMode](https://it.reactjs.org/docs/strict-mode.html))
- [Web Vitalis](https://create-react-app.dev/docs/measuring-performance/)
- less, aria, ... accessibility

## References

- [awesome react components](https://github.com/brillout/awesome-react-components)
- [antd less variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

## REACT PERFORMACE

[references](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab)

- Using Immutable data structures
- React.Fragments (lets you group a list of children without adding an extra node)
- shouldComponentUpdate / PureComponent / React.memo()
- Debouncing (delay for user handler to no)
- Avoiding Props in Initial States (Using props to initialize a state in constructor function often leads to duplication of “source of truth”)
- Using Web Workers for CPU Extensive Tasks
- useContext API only for not frequently state change (when change state every component are updated)
