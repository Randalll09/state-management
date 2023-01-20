import styled from 'styled-components';
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
  return (
    <Div>
      <div className="cont">
        <Header>
          <Title>To Do</Title>
        </Header>
        <CreateTodo />
        <ToDoList />
      </div>
    </Div>
  );
};

export default ToDoPage;
