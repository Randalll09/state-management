# STATE MANAGEMENT

## 6.14 Immutability part One

개별 todo를 수정하는 방식을 이해하려면 자바스크립트의 어떤 개념을 이해해야한다.

일단 ToDoEl.tsx가 todo 값도 불러오게 해보자.

```JavaScript
  const todos = useRecoilValue(todoState);
  console.log(todos);
```

그리고 todo를 5개쯤 만들어주자. 그럼 5개의 객체를 가진 배열이 생성된다. state자체를 modify하는게 아니라 새로운 값을 state에 부여해준다는 개념을 늘 이해하자.

```JavaScript
[
  {
      "text": "todo5",
      "id": 1674614593966,
      "category": "TO_DO"
  },
  {
      "text": "todo4",
      "id": 1674614592139,
      "category": "TO_DO"
  },
  {
      "text": "rtodo3",
      "id": 1674614584999,
      "category": "TO_DO"
  },
  {
      "text": "todo2",
      "id": 1674614581764,
      "category": "TO_DO"
  },
  {
      "text": "todfo1",
      "id": 1674614571665,
      "category": "TO_DO"
  }
]
```

3번째 todo를 수정한다고 가정해보자.

1. id를 기반으로 todo의 위치를 찾아내야 한다.
   setTodo를 사용하면 현재값을 arg로 주는 function을 만들 수 있다. 전의 state를 return하는 함수를 만들어보자.

   ```JavaScript
   setToDos((prev) => {
   return prev;
   });
   ```

   우린 지금 기존의 todo와 id 값을 모두 가지고 있다. findIndex 기능으로 위치를 찾아보자, findIndex는 배열안 조건을 만족하는 개체의 순서를 알려주는데, 조건은 function으로 표현되어야 한다.

   ```JavaScript
     const targetIdx = prev.findIndex((el) => el.id === id);
   ```

   이제 두번째 단계로 넘어가보자.

2. 기본적으로 새로운 todo를 만들어 기존의 todo를 업데이트 해야한다.
   새로운 todo는 object고 기존의 todo와 같은 prop을 지닌다. props에 이미 text, id가 있기 때문에 아래와 같이 적어줄수도 있다.

   ```JavaScript
    const oldTodo = prev[targetIdx];
    const newTodo = { text, id, category: name };
   ```

3. 이제 oldTodo, newTodo가 있으니 targetIdx의 to do를 newTodo로 바꿔주면 된다.

## 6.15 Immutability part Two

이제 배열의 원소 교체에 대한 이론을 배우자. 원소를 교체하는 이유는 순서를 유지하기 위해서다.

배열의 원소교체에 대한 예시로 배열을 하나 만들자. 아래 배열의 mango를 교체한다고 치자.

```JavaScript
  const food = ['pizza', 'mango', 'icecream', 'rice'];

```

1. mango의 위치를 구해야한다.
   우리는 위에서 위치를 구하는 법을 배웠다.

   ```JavaScript
    const food = ['pizza', 'mango', 'icecream', 'rice'];
    const targetIdx = food.findIndex((el) => el === 'mango');
   ```

2. 배열을 "mango"를 기준으로 2개로 나눈다.

   ```JavaScript
       const front = ['pizza'];
   const back = ['icecream', 'rice'];
   ```

   그리고 두 배열을 합치고, 사이에 변경된 배열을 넣어주자.

   ```JavaScript
   const final = [...front, 'apple', ...back];

   ```

   ...을 쓰면 기존 배열의 모든 원소를 넣어주는 걸 의미한다.

위의 배열을 특정원소를 제외하고 둘로 나누는 법을 알아보자. slice 메소드를 이용한다.

```JavaScript
const food = ['pizza', 'mango', 'icecream', 'rice'];

food.slice(0,1)
```

위와 같이 쓰면 food는 \['pizza'\]이 된다. index 1의 직전까지의 아이템을 잘라준다.

이제 뒤쪽 배열을 자르는 법을 배우자.

```JavaScript
food.slice(2)
```

끝을 지정하지 않으면 slice는 알아서 끝까지 잘라준다.

위와 같이 자르면 ['icecream', 'rice']가 된다. 이러한 방식으로 front와 back을 구할 수 있다.

```JavaScript
[...food.slice(0,1),"apple",...food.slice(2)]
//['pizza','apple','icecream','rice']
```

다시 ToDoEl.tsx로 돌아와 위에서 배운 것들을 적용해보자.

```JavaScript
setToDos((prev) => {
      const targetIdx = prev.findIndex((el) => el.id === id);
      const oldTodo = prev[targetIdx];
      const newTodo = { text, id, category: name };
      console.log(oldTodo, newTodo);
      return [...prev.slice(0, targetIdx), newTodo, ...prev.slice(targetIdx + 1)];
    });
```

그런데 위와 같이 하면 name은 그냥 string으로 인식 되기 때문에 오류가 난다. as any를 붙여주면 typescript의 체크를 회피할수 있다.

```JavaScript
      const newTodo = { text, id, category: name as any };

```

이제 버튼을 누르면 카테고리가 변한다.

## 6.16 Selectors part One

이제 selector 라는 개념에 대해 배워보자. 공식 홈페이지에는 selector 에 대해 아래와 같이 설명하고 있다.

Selectors represent a function, or derived state in Recoil. You can think of them as similar to an "idempotent" or "pure function" without side-effects that always returns the same value for a given set of dependency values.

atoms.ts로 가자. todoState을 보면 모든 todo들이 상태 상관없이 모두 같은 state에 저장된걸 볼 수 있다.

```JavaScript
export const todoState = atom<ITodo[]>({
  key: 'todoState',
  default: [],
});
```

selector를 활용해서 카테고리 마다 todo를 분류해보자. selector는 위에 써있듯 atom의 output을 변형시키는 도구다.

selector는 id와 get 함수가 필요하다.

```JavaScript
export const todoSelector = selector({
  key: 'todoSelector',
  get: ({ get }) => {
    return 'hello';
  },
});

```

get함수는 selector가 변형한 값을 return한다. 한번 selector의 값이 잘 나오는 지 확인해보자. ToDoList.tsx로 가자.

```JavaScript
  const selectorOutput = useRecoilValue(todoSelector);
  console.log(selectorOutput);
```

이 방법으로 selector 의 값에 접근가능하다. selector의 get 함수는 atom의 값에 접근할 수 있게 해준다.

get 함수로 todo를 불러오자.

```JavaScript
    const todos = get(todoState);

```

이제 배열을 담은 selector output을 return 해보자. filter 함수를 사용하자. filter는 배열에서 조건에 맞지 않는 원소들을 제거한 배열을 return 한다.

```JavaScript
  get: ({ get }) => {
    const todos = get(todoState);
    return [todos.filter((el) => el.category === 'TO_DO')];
  },
```

카테고리가 "TO_DO"인 원소만 return하는 걸 확인할수 있다.
다른 카테고리도 넘겨주자.

```JavaScript
    return [
      todos.filter((el) => el.category === 'TO_DO'),
      todos.filter((el) => el.category === 'DOING'),
      todos.filter((el) => el.category === 'DONE'),
    ];
```

위와 같이 하면 category 별로 나눠진 todo 배열을 받을 수 있다.
이제 output은 3개의 배열이 든 하나의 배열이다. 이제 selector로 정리된 배열을 렌더링해보자.

ToDoList.tsx에서 selector를 배열로 각기 받아오자.

```JavaScript
  const [todo, doing, done] = useRecoilValue(todoSelector);
  .
  .
  .
       <ul>
        <li>
          <h2>To Do</h2>
          <Ul>
            {todo.map((todo) => (
              <ToDoEl {...todo} key={todo.id} />
            ))}
          </Ul>
        </li>
        <li>
          <h2>Doing</h2>
          <Ul>
            {doing.map((todo) => (
              <ToDoEl {...todo} key={todo.id} />
            ))}
          </Ul>
        </li>
        <li>
          <h2>Done</h2>
          <Ul>
            {done.map((todo) => (
              <ToDoEl {...todo} key={todo.id} />
            ))}
          </Ul>
        </li>
      </ul>

```

selector는 state을 변경하는게 아니라 output을 변형할 뿐이다.

## 6.17 Selectors part Two

그전에는 한번에 모든 카테고리가 렌더링 되었지만 이제 한번에 하나의 카테고리만 렌더링 되도록 코드를 바꿔보자. atoms.ts로 되돌아가 카테고리를 저장할 새로운 state를 만들자.

```JavaScript
export const categoryState = atom({
  key: 'category',
  default: 'TO_DO',
});

```

그리고 ToDoPage.tsx로 가서 CreateTodo위에 select 태그를 넣어주자.

```JavaScript
        <select>
          <option value="TO_DO">To do</option>
          <option value="DOING">doing</option>
          <option value="DONE">done</option>
        </select>
```

select에 따라 todo 카테고리를 렌더링 할 것이다. select 태그에 onInput 이벤트를 넣어주자.

```JavaScript
  const onInput = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value);
  };

```

이제 카테고리를 바꿔주면 value를 가져올수 있다. 이제 이 value를 categoryState atom과 연결해줘야 한다. categoryState을 useRecoilState로 가져오자.

```JavaScript
  const [category, setCategory] = useRecoilState(categoryState);
```

그리고 연결해주자.

```JavaScript
const ToDoPage = () => {
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (e: React.FormEvent<HTMLSelectElement>) => {
    setCategory(e.currentTarget.value);
  };

  return (
    <Div>
      <div className="cont">
        <Header>
          <Title>To Do</Title>
        </Header>
        <select onInput={onInput} value={category}>
          <option value="TO_DO">To do</option>
          <option value="DOING">doing</option>
          <option value="DONE">done</option>
        </select>
        <CreateTodo />
        <ToDoList />
      </div>
    </Div>
  );
};
```

이제 ToDoList.tsx로 가서 category마다 렌더링 되게 바꿔주자

```JavaScript
  const category = useRecoilValue(categoryState);

```

우선 if 문을 사용하는 법이 있다. 하지만 너무 복잡해지고 같은 코드를 계속 반복해야한다.

그러므로 selector를 활용해보자. atom.ts로 가자.

```JavaScript
export const todoSelector = selector({
  key: 'todoSelector',
  get: ({ get }) => {
    const todos = get(todoState);
    const category = get(categoryState);
    return [...todos.filter((el) => el.category === category)];
  },
});
```

이제 렌더링 방식도 바꿔주자.

```JavaScript
const ToDoList = () => {
  const todos = useRecoilValue(todoSelector);
  return (
    <>
      <h2>To Do</h2>
      <Ul>
        {todos?.map((todo) => (
          <ToDoEl {...todo} key={todo.id} />
        ))}
      </Ul>
    </>
  );
};


```

## 6.18 Enums

이제 CreateTodo 컴포넌트에서 선택한 카테고리에 따라 생성된 todo도 같은 카테고리에 자동으로 분류되게 해보자. CreateTodo.tsx에서 categoryState을 받아오게 하자.

```JavaScript
  const category = useRecoilValue(categoryState);
  const onSubit = (data: IForm) => {
    setTodos((prev) => [
      { text: data.text, id: Date.now(), category },
      ...prev,
    ]);
    setValue('text', '');
  };
```

하지만 위와 같이 하면 category가 그냥 string으로 이루어졌다고 판단된다. atom.ts에서 category에 type 할당을 하자.

```JavaScript
export const categoryState = atom<'TO_DO' | 'DOING' | 'DONE'>({
  key: 'category',
  default: 'TO_DO',
});
```

위의 ITodo interface와 겹치니 아예 category type을 만들어주자.

```JavaScript
export type categories = 'TO_DO' | 'DOING' | 'DONE';

export interface ITodo {
  text: string;
  id: number;
  category: categories;
}

export const categoryState = atom<categories>({
  key: 'category',
  default: 'TO_DO',
});
```

하지만 이제 ToDoPage.tsx에 오류가 생겼다.

```JavaScript
    setCategory(e.currentTarget.value);

```

지금 setCategory에 string을 보내고 있다. 아래와 같이 고쳐주자.

```JavaScript
    setCategory(e.currentTarget.value as any);

```

좋은 방법은 아니다. 이제 type보다 좀더 멋진걸 써보자. 코드 전체에서 type에 들어갈 값을 사용하게 해주는 거다. 이걸 enum이라 한다. atoms.ts로 가자.

enum을 적을 땐 enum이라 적고 그 뒤에 이름을 써준다.

```JavaScript
enum Categories {
  'TO_DO',
  'DOING',
  'DONE',
}
```

이제 ITodo에게 enum을 쓰게 하자.

```JavaScript
export enum Categories {
  'TO_DO',
  'DOING',
  'DONE',
}

export interface ITodo {
  text: string;
  id: number;
  category: Categories;
}

```

categoryState에도 지정해주자.

```JavaScript
export const categoryState = atom<Categories>({
  key: 'category',
  default: Categories.TO_DO,
});
```

enum은 원하는 string으로 구성해, 그 중 하나의 값을 사용하는 것이다. 오타등으로 인한 오류에서 보호받을 수 있다. ToDoPage.tsx로 가서 option태그에 enum을 적용하자.

```JavaScript
          <option value={Categories.TO_DO}>To do</option>
          <option value={Categories.DOING}>doing</option>
          <option value={Categories.DONE}>done</option>
```

이제 ToDoEl.tsx로 가서 역시 고쳐주자.

```JavaScript
      {category !== Categories.TO_DO ? (
        <button name={Categories.TO_DO} onClick={onClick}>
          To do
        </button>
      ) : null}
      {category !== Categories.DOING ? (
        <button name={Categories.DOING} onClick={onClick}>
          Doing
        </button>
      ) : null}
      {category !== Categories.DONE ? (
        <button name={Categories.DONE} onClick={onClick}>
          Done
        </button>
      ) : null}
```

하지만 위와 같이 해주면 button name에서 오류가 난다. atom.ts에가서 enum의 각요소 값을 보자. 각 값이 숫자인걸로 나온다. 기본적으로 enum은 순서값을 값으로 가진다. 문제는 button의 name 값이 숫자여선 안된다는 것이다. 일단 아래와 같이 string으로 변환시켜주자.

```JavaScript
        <button name={Categories.TO_DO + ''} onClick={onClick}>

```

todo의 정보를 콘솔에 찍어보면 카테고리는 숫자로 표현된다. 모두가 같은 enum을 사용하기 때문에 문제 없이 작동한다. 하지만 원한다면 타입을 바꿔줄수도 있다.

```JavaScript
export enum Categories {
  'TO_DO' = 'TO_DO',
  'DOING' = 'DOING',
  'DONE' = 'DONE',
}
```

이렇게 해주면 실제로 string을 값으로 갖게 된다.
