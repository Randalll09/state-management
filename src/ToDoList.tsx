import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const Div = styled.div``;

// const ToDoList = () => {
//   const [todo, setTodo] = useState('');
//   const [todoError, setTodoError] = useState('');
//   const onChange = (e: React.FormEvent<HTMLInputElement>) => {
//     setTodo(e.currentTarget.value);
//     setTodoError('');
//   };
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (todo.length < 10) {
//       return setTodoError('To do should be longer');
//     } else console.log('submit');
//   };
//   return (
//     <Div>
//       <form onSubmit={onSubmit}>
//         <input onChange={onChange} placeholder="Write a to do" value={todo} />
//         <button>Add</button>
//         {todoError !== '' ? todoError : null}
//       </form>
//     </Div>
//   );
// };

const ToDoList = () => {
  const { register, handleSubmit, formState } = useForm();
  const onValid = (data: any) => {};
  console.log(formState.errors);
  return (
    <div>
      <form
        onSubmit={handleSubmit(onValid)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
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
        <input
          {...register('lastName', { required: 'password is required' })}
          placeholder="Write Last Name"
        />
        <input
          {...register('userName', { required: true })}
          placeholder="Write User Name"
        />
        <input
          {...register('password', { required: true })}
          placeholder="Write password"
        />
        <input
          {...register('email', { required: true })}
          placeholder="Write email"
        />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;
