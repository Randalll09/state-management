import { ITodo } from './atoms';

const ToDoEl = ({ text, category }: ITodo) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
  return (
    <li>
      <span>{text}</span>
      {category !== 'TO_DO' ? (
        <button name="TO_DO" onClick={onClick}>
          To do
        </button>
      ) : null}
      {category !== 'DOING' ? (
        <button name="DOING" onClick={onClick}>
          Doing
        </button>
      ) : null}
      {category !== 'DONE' ? (
        <button name="DONE" onClick={onClick}>
          Done
        </button>
      ) : null}
    </li>
  );
};

export default ToDoEl;
