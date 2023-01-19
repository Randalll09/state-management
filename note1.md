# STATE MANAGEMENT

## 6.0 Dark Mode part One

Recoil은 State management 패키지다.

전에 만든 cryptoTracker에 다크모드와 라이트 모드를 바꾸는 기능을 더해주자. 우선 Recoil을 사용하지 않고 만든다.

우선 index.tsx의 ThemeProvider를 App component로 옮기자.

```JavaScript
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
```

이제 theme을 2개 만들어주자.

lightTheme을 하나 만든다.

```JavaScript
import { DefaultTheme } from 'styled-components';
//https://flatuicolors.com/palette/se
export const darkTheme: DefaultTheme = {
  bgColor: '#1e272e',
  tabColor: '#485460',
  textColor: '#d2dae2',
  accentColor: '#ffd32a',
  defaultFont: "'Sofia Sans', sans-serif",
};
export const lightTheme: DefaultTheme = {
  bgColor: '#4bcffa',
  tabColor: '#0fbcf9',
  textColor: '#1e272e',
  accentColor: '#ef5777',
  defaultFont: "'Sofia Sans', sans-serif",
};

```

이제 그 둘을 오가는 스위치를 만들자. App에 state를 하나 생성하고 toggle function을 만들자.

```JavaScript
function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <button onClick={toggleDark}>Toggle</button>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
```

버튼을 눌러주면 잘 작동한다.

## 6.1 Dark Mode part Two

이제 버튼의 위치를 옮겨주자. Coins.tsx로가서 버튼을 하나 더해주자.

```JavaScript
      <Header>
        <Title>Coins</Title>
        <button>Toggle Dark Mode</button>
      </Header>
```

이제 App에서 toggleDark function을 Coins.tsx로 보내줘야 한다.

또한 Chart.tsx에서도 모드에 따라 다크모드, 라이트모드를 설정해줘야 한다.

Coins는 Router안에 있으므로 function을 router 안으로 보내주자. 하지만 v6는 강의와 너무 다르므로 내 방식 대로 구현했다. 우선 router.tsx의 router를 App.tsx로 옮겨준다.

```JavaScript
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState } from 'react';
// import router from './routes/Router';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import Coin from './routes/Coin';
import Coins from './routes/Coins';
import Chart from './routes/Chart';
import Price from './routes/Price';

const GlobalStyle = createGlobalStyle`
  *{margin: 0; padding: 0; box-sizing:border-box;}
  li{list-style: none;}
  a{color:inherit; text-decoration: none;}
  body{
    font-family: 'Sofia Sans', sans-serif;
    background-color:${(props) => props.theme.bgColor};
    color:${({ theme }) => theme.textColor};
  }
`;

function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleDark = () => setIsDark((prev) => !prev);
  const router = createBrowserRouter([
    { path: '/', element: <Coins toggleDark={toggleDark} /> },
    {
      path: '/:coinId',
      element: <Coin />,
      children: [
        {
          path: 'price',
          element: <Price />,
        },
        {
          path: 'chart',
          element: <Chart />,
        },
      ],
    },
  ]);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <button onClick={toggleDark}>Toggle</button>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;

```

그리고 Coins Interface를 만들어 toggleDark를 받는다.

```JavaScript
interface ICoinsProps {
  toggleDark: () => void;
}
function Coins({ toggleDark }: ICoinsProps) {
  .
  .
  .
        <button onClick={toggleDark}>Toggle Dark Mode</button>
        .
        .
        .
}
```

이제 버튼을 누르면 다크모드로 잘 토글 된다.

Coin과 Chart에도 같은 작업을 해주자.

Chart에는 isDark prop을 전해준다.

```JavaScript
        {
          path: 'chart',
          element: <Chart isDark={isDark} />,
        },
```

```JavaScript
   theme: {
              mode: isDark ? 'dark' : 'light',
            },
```

하지만 이렇게 하면 너무 복잡해진다. 그렇기 때문에 Recoil 이 필요한 것이다.

## 6.2 Introduction to Recoil

recoil에는 atom이라는 저장소가 있다. atom은 전체 프로젝트에서 사용가능하다.

npm install recoil을 해주고는 전 단계에서 prop을 전달한 코드들을 모두 롤백해주고 index.tsx로 가서 RecoilRoot으로 감싸주자.

```JavaScript
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);
```

그리고 atom을 담아줄 atoms.ts를 만들자.

isDarkAtom이라는 atom을 하나 생성한다. atom에는 key값과 default 값이 필요하다.

```JavaScript
import { atom } from 'recoil';

export const isDarkAtom = atom({
  key: 'isDark',
  default: false,
});

```

이제 이 atom을 component와 연결해주자.

App.tsx로 가서 useRecoilValue로 isDarkAtom을 부르자.

```JavaScript
function App() {
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

```

Chart.tsx에도 isDarkAtom을 넣자.

그리고 atoms.ts에서 default값을 true로 바꿔주면 전체 theme이 바뀐다.

## 6.3 Introduction to Recoil part Two

이젠 atom의 값을 바꾸는 법을 알아보자.

Coins.tsx에서 값을 변경할수 있게 해주자. useSetRecoilState이라는 hook을 사용하면 된다. useSetRecoilState 는 setState와 같이 작용하는 setter function을 준다.

```JavaScript
  const setter = useSetRecoilState(isDarkAtom);
.
.
.
        <button onClick={() => setter(true)}>Toggle Dark Mode</button>

```

이제 버튼을 누르면 darkTheme이 활성화 된다. 이제 버튼을 클릭하면 바뀌게 해보고 이름도 바꿔주자.

```JavaScript
  const setDarkAtom = useSetRecoilState(isDarkAtom);
.
.
.
        <button onClick={() => setDarkAtom((prev) => !prev)}>
          Toggle Dark Mode
        </button>
```

이제 header에서 atom의 상태를 관리해줄수 있다.

## 6.4 Recap

Recoil은 앱을 떠돌아다니는 traveling prop의 문제를 해결하기 위해 만들어졌다.

atom은 앱의 파편들이고 recoil에서는 앱의 값을 받아오거나 상태를 변경할수 있다.

atom은 그 어떤 컴포넌트에게서도 독립적이다.

또한 atom의 값이 변경되면 atom의 값을 불러오는 모든 컴포넌트들이 리렌더링 된다.
