# STATE MANAGEMENT

## 6.11 Add To Do

이제 recoil 얘기로 돌아가자.

지금 당장은 ToDo.tsx에 atom을 만들지만 나중에 분리 시킬 것이다. ToDo.tsx 에 todoState atom을 생성하자.

```JavaScript
const todoState = atom({
  key: 'todo',
  default: [],
});
```

useRecoilValue hook을 사용해 컴포넌트 내에서 todoState 에 접근하자.

```JavaScript
  const value = useRecoilValue(todoState);

```

이제 value는 array이다.
전에 우리는 atom의 값을 변동하기 위한 modifier 함수를 부르는 법도 배웠다.

```JavaScript
  const modifier = useSetRecoilState(todoState);

```

그런데 이렇게 따로따로 다른 선언을 하는 것보다 useRecoilState hook을 쓰면 둘다 한번에 선언 가능하다.
useRecoilState()의 첫 항목은 value, 두번쨰는 value를 변경하기 위한 함수이다.

```JavaScript
  const [todos, setTodos] = useRecoilState(todoState);

```

그런데 현재 todos는 타입스크립트에서 never 타입의 배열이다. 만일 setTodos로 배열을 넣으려 하면 오류가 난다.

그러므로 타입스크립트에게 todos는 todo를 담은 배열이라고 설명해줘야 한다. interface를 하나 만들어주자.

```JavaScript
interface ITodo {
  text: string;
  category: 'TO_DO' | 'DOING' | 'DONE';
}

const todoState = atom<ITodo[]>({
  key: 'todo',
  default: [],
});
```

이제 자바스크립트는 todo의 구성요소를 안다.

그럼 submit의 조건을 충족 할때 todos의 state을 변경시킬 시간이다.

```JavaScript
  const onSubmit = (data: IForm) => {
    setValue('todo', '');
    setTodos((prev) => [{ text: data.todo, category: 'TO_DO' }, ...prev]);
    console.log(todos);
  };

```

이제 todo가 잘 들어가는 걸 확인 할수 있다. todo에 id 항목을 추가하자.

```JavaScript
interface ITodo {
  text: string;
  id: number;
  category: 'TO_DO' | 'DOING' | 'DONE';
}
.
.
.
  const onSubmit = (data: IForm) => {
    setValue('todo', '');
    setTodos((prev) => [
      { text: data.todo, category: 'TO_DO', id: Date.now() },
      ...prev,
    ]);
    console.log(todos);
  };
```

todo목록이 화면에 나오게 하자.

```JavaScript
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>To dos</h1>
        <hr />
        <input
          {...register('todo', { required: 'Write a to do' })}
          placeholder="Write a to do"
        />
        <button>Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
```

위와 같이 하면 todo가 화면에 나온다.

## 6.12 Refactoring

아래처럼 한 파일에 전부 우겨넣었던 코드들을 쪼개자.

```JavaScript
import { useForm } from 'react-hook-form';
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

interface IForm {
  todo: string;
}

interface ITodo {
  text: string;
  id: number;
  category: 'TO_DO' | 'DOING' | 'DONE';
}

const todoState = atom<ITodo[]>({
  key: 'todos',
  default: [],
});

const ToDo = () => {
  const [todos, setTodos] = useRecoilState(todoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onSubmit = (data: IForm) => {
    setValue('todo', '');
    setTodos((prev) => [
      { text: data.todo, category: 'TO_DO', id: Date.now() },
      ...prev,
    ]);
    console.log(todos);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>To dos</h1>
        <hr />
        <input
          {...register('todo', { required: 'Write a to do' })}
          placeholder="Write a to do"
        />
        <button>Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
};

export default ToDo;

```

나는 연습할겸 혼자 했다.

이제 개별의 todo의 엘레먼트를 만들자.

```JavaScript
import { ITodo } from './atoms';

const ToDoEl = ({ text }: ITodo) => {
  return <li>{text}</li>;
};

export default ToDoEl;

```

이제 todo의 개별 카테고리를 변경하는 버튼을 만들자.

```JavaScript
    <li>

      {text}
      <button>Doing</button>
      <button>Done</button>
    </li>
```

## 6.13 Categories

버튼에 카테고리 변경 기능을 넣자.

우선 버튼이 조건에 따라서 렌더링 되게 하자.

```JavaScript
      {category !== 'TO_DO' ? <button onClick={}>To do</button> : null}
      {category !== 'DOING' ? <button>Doing</button> : null}
      {category !== 'DONE' ? <button>Done</button> : null}
```

그리고 onClick 함수를 추가해주자.

```JavaScript
import { ITodo } from './atoms';

const ToDoEl = ({ text, category }: ITodo) => {
  const onClick = (newCat: ITodo['category']) => {};
  return (
    <li>
      <span>{text}</span>
      {category !== 'TO_DO' ? (
        <button onClick={() => onClick('TO_DO')}>To do</button>
      ) : null}
      {category !== 'DOING' ? (
        <button onClick={() => onClick('DOING')}>Doing</button>
      ) : null}
      {category !== 'DONE' ? (
        <button onClick={() => onClick('DONE')}>Done</button>
      ) : null}
    </li>
  );
};

export default ToDoEl;

```

또는 인자를 직접받는 함수를 만들 수도 있다. 각버튼에 이름을 지정해주고 이벤트 함수로 버튼을 불러오는 것이다.

```JavaScript

```

5:23
