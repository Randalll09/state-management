import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { categoryState, todoState } from './atoms';

const Div = styled.div`
  > form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    input {
      width: 420px;
      height: 36px;
      background-color: ${({ theme }) => theme.textColor};
      border: none;
      outline: none;
      padding: 8px;
      border-radius: 4px;
      font: 300 16px ${({ theme }) => theme.defaultFont};
      color: ${({ theme }) => theme.bgColor};
    }
    button {
      font: 300 16px ${({ theme }) => theme.defaultFont};
      display: block;
      background-color: ${({ theme }) => theme.textColor};
      padding: 8px;
      width: 64px;
      height: 36px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      outline: none;
      transition: 0.2s all;
      &:hover {
        background-color: ${({ theme }) => theme.accentColor};
      }
    }
  }
`;

interface IForm {
  text: string;
}

const CreateTodo = () => {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const category = useRecoilValue(categoryState);
  const [todo, setTodos] = useRecoilState(todoState);
  const onSubit = (data: IForm) => {
    setTodos((prev) => [
      { text: data.text, id: Date.now(), category },
      ...prev,
    ]);
    setValue('text', '');
  };

  return (
    <Div>
      <form onSubmit={handleSubmit(onSubit)}>
        <input
          {...register('text', { required: 'Write a Todo' })}
          placeholder="write a to do"
        />{' '}
        <button>ADD</button>
      </form>
    </Div>
  );
};

export default CreateTodo;
