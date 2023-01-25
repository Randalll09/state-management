import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { todoState, todoSelector, categoryState } from './atoms';
import ToDoEl from './ToDoEl';

const Ul = styled.ul``;

const El = styled.li``;

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

export default ToDoList;
