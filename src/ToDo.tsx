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
