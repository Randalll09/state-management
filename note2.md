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

## 6.8 Form Errors

Validation을 위해 RegExp라는 것을 사용해보자. RegExp는 코드에 문자열이 어떤 종류인지 설명해주는 역할을 한다.

```JavaScript
/^[A-Za-z0-9._%+-]+@naver.com$/
```

위 RegExp 는 영어 대소문자, 숫자 또는 .\_%+- 로 이루어진 문자열로 시작해 @naver.com으로 끝난다는 의미다.

register의 pattern에 RegExp를 넣으면 문자열 패턴을 검사할 수 있다.

```JavaScript
        <input
          {...register('email', {
            required: true,
            pattern: /^[A-Za-z0-9._%+-]+@naver.com$/,
          })}
          placeholder="Write email"
        />
```

만약 네이버 이메일이 아닌 메일주소를 적으면 에러가 나고, 네이버 이메일주소를 적으면 통과한다.

에러 메세지를 띄우려면 아래와 같이 해주면 된다.

```JavaScript
<input
          {...register('email', {
            required: true,
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: 'Only Naver is allowed',
            },
          })}
          placeholder="Write email"
        />
```

이제 사용자에게 에러메세지를 띄워보자. 현재 에러에는 required에러와 pattern에러가 있다. formState에서 error를 분리하자.

```JavaScript
  const { register, handleSubmit, formState:{errors} } = useForm();

```

span안에 이메일 input의 에러를 보여줄건데 에러의 메세지를 타입별로 지정할수 있으니 굳이 에러의 타입을 분간할 필요가 없다.

```JavaScript
        <input
          {...register('email', {
            required: 'Email is Required',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: 'Only Naver is allowed',
            },
          })}
          placeholder="Write email"
        />
        <span>{errors.email?.message}</span>
```

나는 여기서 에러가 나 interface 를 만들어서 지정했다.

```JavaScript

interface IFormData {
  [key: string]: string;
}
.
.
.
  const {register,handleSubmit,formState: { errors },} = useForm<IFormData>();
```

사용자가 제출하고 나면 에러 메세지가 뜬다. 그리고 나서 수정하면 실시간으로 에러가 사라진다.

또한 default value 라는 것이 있다.

제대로 된 interface를 다시 만들어주고 defaultValues 를 지정해주자.

```JavaScript
interface IFormData {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
}
.
.
.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      firstName: 'name',
      lastName: 'last',
    },
  });
```

defaultValues에 지정한 값이 form에 기본값으로 들어가 있는걸 볼 수 있다.

## 6.9 Custom Validation

에러를 발생시키는 방법을 배워보자. 예컨대 유저이름을 api로 검사하거나 하는 방식을 쓰면 에러 발생이 필요하다.

password와 password 확인이 다를 때 에러를 발생시켜보자. useForm에 setError를 추가하고 둘의 입력값이 같은지 확인하는 함수를 만들자.

```JavaScript
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<IFormData>({
    defaultValues: {
      firstName: 'name',
      lastName: 'last',
    },
  });
    const onValid = (data: IFormData) => {
    if (data.password !== data.passwordCheck) {
      setError('passwordCheck', { message: 'Passwords are not the same' });
    }
  };
```

아니면 전체 폼에 대한 에러를 설정 할 수도 있다. IFormData에 extraError라는 항목을 추가해주자.

```JavaScript
interface IFormData {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  passwordCheck: string;
  email: string;
  extraError?: string;
}
.
.
.
    setError('extraError', { message: 'serverOffline' });
    .
    .
    .
        <span>{errors.extraError?.message}</span>


```

extraError는 특정 항목에 대한 에러가 아닌 폼 전체에 대한 에러이다.

setError의 또 다른 장점은 특정 input에 focus 시킬수 있단 점이다. 이는 shouldFocus 객체로 처리 할 수 있다.

```JavaScript
      setError('passwordCheck', { message: 'Passwords are not the same' },{shouldFocus:true});

```

또한 register에 validate 옵션을 줄수도 있다. validate 은 함수를 값으로 가지고 그 함수는 더이터 값을 인자로 가지며 true나 false를 return한다.

```JavaScript
        <input
          {...register('lastName', {
            required: 'password is required',
            validate: (value) => value.includes("Na"),
          })}
          placeholder="Write Last Name"
        />
```

또한 문자열을 return 할수도 있다. 아래와 같이 하면 오류로 hello 가 뜬다. 만약 문자열을 return하면 에러메세지를 return한다는 의미다.

```JavaScript
    <input
          {...register('lastName', {
            required: 'password is required',
            validate: (value) => 'hello',
          })}
          placeholder="Write Last Name"
        />
        <span>{errors.lastName?.message}</span>
```

아래의 input에 nico가 포함되면 에러 메세지가 보인다.

```JavaScript
        <input
          {...register('lastName', {
            required: 'password is required',
            validate: (value) =>
              value.includes('nico') ? 'no nico allowed' : true,
          })}
          placeholder="Write Last Name"
        />
        <span>{errors.lastName?.message}</span>
```

validate에 여러 요소 들이 필요할 때도 있다. 그럴 땐 validate을 객체로 만들고 그 안에 항목을 넣으면 된다.

```JavaScript
<input
          {...register('lastName', {
            required: 'password is required',
            validate: {
              noNico: (value) =>
                value.includes('nico') ? 'no nicos allowed' : true,
              noNick: (value) =>
                value.includes('nick') ? 'no nicks allowed' : true,
            },
          })}
          placeholder="Write Last Name"
        />
```

validate에 규칙 항목의 이름은 원하는 대로 적어둘수 있다. validate 함수를 async로 만들어 서버에 확인하고 응답을 받을 수도 있다.

## 6.10 Recap

useForm에는 setValue라는 함수도 있다.

```JavaScript
  const onSubmit = (data: IForm) => {
    console.log('add to do', data.todo);
    setValue('todo', '');
  };
```

위와 같이 하면 submit시에 to do의 값이 ""가 된다.
