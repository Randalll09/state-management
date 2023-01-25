import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { Categories, categoryState } from './atoms';
import CreateTodo from './CreateTodo';
import ToDoList from './ToDoList';

const Div = styled.div`
  padding: 10vh 30vw;
  > .cont {
    border: 1px solid ${({ theme }) => theme.textColor};
    height: 80vh;
    border-radius: 30px;
    padding: 24px 32px;
  }
`;
const Header = styled.header`
  height: 80px;
`;
const Title = styled.h1`
  text-align: center;
`;

const ToDoPage = () => {
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (e: React.FormEvent<HTMLSelectElement>) => {
    setCategory(e.currentTarget.value as any);
  };

  return (
    <Div>
      <div className="cont">
        <Header>
          <Title>To Do</Title>
        </Header>
        <select onInput={onInput} value={category}>
          <option value={Categories.TO_DO}>To do</option>
          <option value={Categories.DOING}>doing</option>
          <option value={Categories.DONE}>done</option>
        </select>
        <CreateTodo />
        <ToDoList />
      </div>
    </Div>
  );
};

export default ToDoPage;
