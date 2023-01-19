# STATE MANAGEMENT

## 6.5 To Do Setup

App.tsx와 index.tsx를 초기화 하자.

```JavaScript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body{
    background-color: ${({ theme }) => theme.bgColor};
    font-family: ${({ theme }) => theme.defaultFont};
    color: ${({ theme }) => theme.textColor};
  }
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  a{
    color:inherit;
    text-decoration: none;

  }
  li{
    list-style: none;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
    </>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { darkTheme } from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);
```

우리는 이제 todo list를 만들면서 recoil에 대해 배운걸 더 연습할것이다.

ToDoList.tsx를 하나 만들어주자.

```JavaScript
const ToDoList = () => {
return <div></div>;
};

export default ToDoList;
```

App.tsx에 import 해주자.

```JavaScript
function App() {
  return (
    <>
      <GlobalStyle />
      <ToDoList />
    </>
  );
}
```

이제 ToDoList를 채워줄 차례이다.

```JavaScript
const ToDoList = () => {
  const [value, setValue] = useState('');
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };
  return (
    <Div>
      <form>
        <input onChange={onChange} placeholder="Write a to do" value={value} />
        <button>Add</button>
      </form>
    </Div>
  );
};

```

submit 함수도 넣어주자.

```JavaScript
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
  };
```

## 6.6 Forms

React-Hook-Form 이란 패키지를 알아보자.

[https://react-hook-form.com/]

react-hook-form은 여러개의 input과 validation을 필요로 할때 유용하다.

예건데, todo를 validation 하려면 일일히 에러를 설정해주고 validation을 검증해야한다. react-hook-form 없이 어떤지 한번 보자.

```JavaScript
const ToDoList = () => {
  const [todo, setTodo] = useState('');
  const [todoError, setTodoError] = useState('');
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTodo(e.currentTarget.value);
    setTodoError('');
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo.length < 10) {
      return setTodoError('To do should be longer');
    } else console.log('submit');
  };
  return (
    <Div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} placeholder="Write a to do" value={todo} />
        <button>Add</button>
        {todoError !== '' ? todoError : null}
      </form>
    </Div>
  );
};

```

굉장히 복잡하다. 하지만 라이브러리를 사용하면 훨씬 쉽게 할 수 있다.

npm install react-hook-form

react-hook-form을 사용하기 위해서는 useForm이란 hook을 import 해야한다.

```JavaScript
import { useForm } from 'react-hook-form';

```

기존의 ToDoList를 주석처리해 비교해 가면서 해보자.

```JavaScript
const ToDoList = () => {
  return (
    <div>
      <form>
        <input placeholder="Write a to do" />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;

```

이제 useForm hook을 더해준다.

useForm은 많은 기능을 가진다. 그 중 register 함수는 우리가 방금 구현했던 모든 것들을 처리해줄수 있다. onChange, value등을 따로 지정해 줄 필요가 없다.

```JavaScript
  const { register } = useForm();
  console.log(register('todo'));
```

콘솔을 보면 name, onChange, onBlur, ref 속성이 나온다.

이 모든걸 만들어둔 input에 할당하자. register("todo")가 반환하는 객체를 input에 prop 으로 전달하는 것이다.

```JavaScript
        <input {...register('todo')} placeholder="Write a to do" />

```

잘 전달되는지 확인해보자. 이번엔 watch기능을 사용할건데 form 입력값의 변화를 관찰할수 있게 해주는 함수다.

```JavaScript
  const { register, watch } = useForm();
  console.log(watch());

```

콘솔에 {todo:} 로 value 값을 가져 오는 걸 볼수 있다.

한번 진짜 form을 만들어보자.

```JavaScript
      <form>
        <input {...register('firstName')} placeholder="Write First Name" />
        <input {...register('lastName')} placeholder="Write Last Name" />
        <input {...register('userName')} placeholder="Write User Name" />
        <input {...register('password')} placeholder="Write password" />
        <input {...register('email')} placeholder="Write email" />
        <button>Add</button>
      </form>
```

각각의 input마다 새로운 state를 할당하지 않아도 된다. 그냥 watch를 보면 하나의 object가 생성 되어 있다.

## 6.7 Form Validation

이번에는 onSubmit을 대체해보자.

useForm에 handleSubmit 함수를 받아오자.

```JavaScript
  const { register, watch, handleSubmit } = useForm();

```

handleSubmit이 validation 역할을 담당하게 된다.

우선 input을 검사할 onValid 함수를 만들자.

그리고 handleSubmit을 form의 onSubmit 이벤트에 넣는다. 그리고 handleSubmit은 2개의 인자를 필요로 하는데 첫번쨰는 데이터가 valid 할때 실행될 함수, 두번째는 데이터가 invalid 시 불러오는 함수이다. 우선 handleSubmit이 어떤 데이터를 불러오는지 콘솔에 띄워보자.

```JavaScript
const ToDoList = () => {
  const { register, watch, handleSubmit } = useForm();
  const onValid = (data: any) => {console.log(data);};
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register('firstName')} placeholder="Write First Name" />
        <input {...register('lastName')} placeholder="Write Last Name" />
        <input {...register('userName')} placeholder="Write User Name" />
        <input {...register('password')} placeholder="Write password" />
        <input {...register('email')} placeholder="Write email" />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;

```

submit시 아래와 같이 값을 불러온다.

```JavaScript
{
    "firstName": "firstName Value",
    "lastName": "last Name value",
    "userName": "USernamefdklkfd",
    "password": "12341234",
    "email": "username@dsasd.co"
}
```

주의해야할 점은 handleSubmit은 return 함수가 아니라 그냥 먼저 호출되는 함수란 점이다.

이제 valid 기능을 확인하기 위해 required:true를 넣어주자. 그런데 input의 attr로 넣는 것이 아니라 register에 추가해주는 형식으로 넣는다.

```JavaScript
<input {...register('firstName', { required: true })} placeholder="Write First Name"/>
```

input 자체의 required 속성은 브라우저의 코드에디터 속성으로 쉽게 해킹가능하다. 모든 input의 register에 위와 같이 required:true 속성을 주자. register에 required를 주는 장점은 submit 했을때 바로 에러가 난 항목으로 커서를 가져다 준단 점이다. 이제 validation을 추가해주자.

```JavaScript
        <input
          {...register('firstName', { required: true, minLength: 10 })}
          placeholder="Write First Name"
        />
```

이렇게 하면 자동으로 길이가 10 보다 적으면 submit되지 않는다. 에러를 좀 더 쉽게 보기 위해 form이 세로로 나열되게 하자.

```JavaScript
     <form
        onSubmit={handleSubmit(onValid)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
```

에러를 확인하기 위해선 useForm의 formState를 사용하면 된다.

```JavaScript
  const { register, handleSubmit, formState } = useForm();
  console.log(formState.errors);
```

form에 아무것도 적지 않고 submit하면 아래와 같은 객체를 반환한다.

```JavaScript
{email : {type: 'required', message: '', ref: input}}
```

어떤 에러인지 type으로 반환하는 것이다.

에러로 메세지를 보낼수도 있다.

```JavaScript
{password:{
  message: "password is required",
  ref: input,
  type: "required"
  }
}
```

아니면 validation rule을 만들어 줄수도 있다.

```JavaScript
        <input
          {...register('firstName', {
            required: true,
            minLength: {
              value: 5,
              message: 'Name is too short',
            },
          })}
          placeholder="Write First Name"
        />
```
