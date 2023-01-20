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
interface IFormData {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  passwordCheck: string;
  email: string;
  extraError?: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IFormData>({
    defaultValues: {
      firstName: 'name',
      lastName: 'last',
    },
  });
  const onValid = (data: IFormData) => {
    if (data.password !== data.passwordCheck) {
      setError(
        'passwordCheck',
        { message: 'Passwords are not the same' },
        { shouldFocus: true }
      );
    }
    setError('extraError', { message: 'serverOffline' });
  };
  console.log(errors);
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
          {...register('lastName', {
            required: 'password is required',
            validate: {
              noNico: (value) =>
                value.includes('nico') ? 'no nicos allowed' : true,
              noNick: (value) =>
                value.includes('nick') ? 'no nicks allowed' : true,
            },
          })}
          placeholder="Write Last Name"
        />
        <span>{errors.lastName?.message}</span>
        <input
          {...register('userName', { required: true })}
          placeholder="Write User Name"
        />
        <input
          {...register('password', { required: true })}
          placeholder="Write password"
        />
        <input
          {...register('passwordCheck', { required: true })}
          placeholder="Write password check"
        />
        <input
          {...register('email', {
            required: 'Email is Required',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: 'Only Naver is allowed',
            },
          })}
          placeholder="Write email"
        />
        <span>{errors.passwordCheck?.message}</span>
        <button>Add</button>
        <span>{errors.extraError?.message}</span>
      </form>
    </div>
  );
};

export default Form;
