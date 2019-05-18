const getFileData = function(filename, MainName) {
  let dataMap = {};

  dataMap["/index.tsx"] = `import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { store } from './stores';
// 组件加载
import RouterView from './views/router';

@observer
class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log('${MainName} constructor');
  }

  public componentWillMount() {
    // 去掉首页中的额loading
    this.hiddenLoading();
    // 修改html中的title
    this.changeTitle();
    // this.showToast();
    console.log('${MainName} componentWillMount');
  }

  public render() {
    const loadingState = _.get(store, 'state.ifShowLoading');
    return (
      <>
        <RouterView />
      </>
    );
  }

  public changeTitle() {
    document.title = '';
  }

  public hiddenLoading = () => {
    const animation = document.getElementById('loadingAnimation');
    if (!animation) return;
    // @ts-ignore
    const body = animation.parentElement;
    // @ts-ignore
    body.removeChild(animation);
  };
}

export default App;
`;

  dataMap[`/${MainName}.ts`] = `import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './index';
import { adapterRemAndEm, resetGlobalStyle, getCurrentEnvironment } from '../common';

declare var window: any;
console.log('${MainName}');
const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter
});

export function bootstrap(props: any) {
  return reactLifecycles.bootstrap(props);
}

export function mount(props: any) {
  return reactLifecycles.mount(props);
}

export function unmount(props: any) {
  return reactLifecycles.unmount(props);
}

function domElementGetter() {
  // Make sure there is a div for us to render into
  let el = document.getElementById('root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'root';
    // 子应用挂载根节点
    document.body.appendChild(el);
  }
  adapterRemAndEm();
  // 全局样式设置
  resetGlobalStyle();
  // 设置当前环境
  window.CURRENT_ENVIRONMENT = getCurrentEnvironment();
  return el;
}
`;

  dataMap["/activityFunction.ts"] = `export const routePrefix = '/${MainName}';

export default function(location: Location) {
  return location.pathname.startsWith(routePrefix);
}
`;

  dataMap[
    "/stores/index.ts"
  ] = `import { observable, computed, action } from 'mobx';

interface Store {
  hello?: any;
}
class StateStore {
  @observable private hello = 'hello'; // 用户做题原始返回数据
  @observable private ifShowLoading = false; // loading显示标志

  @computed
  get state() {
    return {
      hello: this.hello,
      ifShowLoading: this.ifShowLoading
    };
  }

  @action
  public getHello() {
    return this.hello;
  }

  @action
  public setStore(data: string | Store, value: any) {
    console.log('this.state', this.state);
    if (value !== undefined) {
      this[data] = value;
    } else {
      Object.keys(data).forEach((key: any) => {
        this[key] = data[key];
      });
    }
  }
}

export const store = new StateStore();
`;

  dataMap["/views/router.tsx"] =
    `import React, { Component } from 'react';
  import { Provider } from 'mobx-react';
  import { store } from '../stores';
  import { BrowserRouter as Router, Route } from 'react-router-dom';
  import { spring } from 'react-motion';
  import { AnimatedSwitch } from 'react-router-transition';
  import MainPage from './main';
  
  const getTransitionStyle = () => {
    const preset = {
      stiffness: 270,
      damping: 25
    };
    const pushStateStyles = {
      atEnter: { translateX: 100 },
      atLeave: { translateX: spring(-100, preset) },
      atActive: { translateX: 0 },
      mapStyles: (styles: any) => ({
        WebkitTransform: ` +
    "`translate3d(${styles.translateX}%, 0, 0)`" +
    `,
        transform: ` +
    "`translate3d(${styles.translateX}%, 0, 0)`" +
    `,
        minHeight: '100%',
        position: 'absolute',
        width: '100%'
      })
    };
    return pushStateStyles;
  };
  
  class RouterView extends Component<{ params: any }, any> {
    constructor(props: any) {
      super(props);
      console.log('router view constructor');
    }
  
    public componentWillMount() {
      console.log('router view componentWillMount');
    }
  
    public render() {
      const transitionStyle = getTransitionStyle();
      return (
        <Provider {...store}>
          <Router>
            <AnimatedSwitch {...transitionStyle} className="switch-wrapper">
              {/* <Switch> */}
              <Route key="MainPage" path="/${MainName}/" exact={true} component={MainPage} />
              {/* </Switch> */}
            </AnimatedSwitch>
          </Router>
        </Provider>
      );
    }
  }
  
  export default RouterView;
  `;

  dataMap["/views/main.tsx"] = `import React, { Component } from 'react';
    import { observer } from 'mobx-react';
    import { Content } from './styles/main.style';
    
    @observer
    export default class MainPage extends Component<any, any> {
      constructor(props: any) {
        super(props);
        console.log('mainpage constructor');
      }
      public async componentDidMount() {
        console.log('mainpage componentDidMount');
      }
    
      public render() {
        return (
          <>
            <Content>hello</Content>
          </>
        );
      }
    }
    `;

  dataMap["/views/styles/main.style.ts"] =
    `import styled from 'styled-components';
    export const Content = styled.div` +
    "`position: fixed;left: 0;top: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.5)`" +
    `;`;

  return dataMap[filename];
};

module.exports = getFileData;
