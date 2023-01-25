import { useSetRecoilState } from 'recoil';
import { Categories, ITodo, todoState } from './atoms';

const ToDoEl = ({ text, category, id }: ITodo) => {
  const setToDos = useSetRecoilState(todoState);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;
    setToDos((prev) => {
      const targetIdx = prev.findIndex((el) => el.id === id);
      const newTodo = { text, id, category: name as any };
      return [
        ...prev.slice(0, targetIdx),
        newTodo,
        ...prev.slice(targetIdx + 1),
      ];
    });
  };

  return (
    <li>
      <span>{text}</span>
      {category !== Categories.TO_DO ? (
        <button name={Categories.TO_DO + ''} onClick={onClick}>
          To do
        </button>
      ) : null}
      {category !== Categories.DOING ? (
        <button name={Categories.DOING + ''} onClick={onClick}>
          Doing
        </button>
      ) : null}
      {category !== Categories.DONE ? (
        <button name={Categories.DONE + ''} onClick={onClick}>
          Done
        </button>
      ) : null}
    </li>
  );
};

export default ToDoEl;
