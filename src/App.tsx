import { createGlobalStyle } from 'styled-components';
import Form from './Form';
import ToDo from './ToDo';
import ToDoPage from './ToDoPage';

const GlobalStyle = createGlobalStyle`
  body{
    background-color: ${({ theme }) => theme.bgColor};
    font-family: ${({ theme }) => theme.defaultFont};
    color: ${({ theme }) => theme.textColor};
  }
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }
  a{
    color:inherit;
    text-decoration: none;

  }
  li{
    list-style: none;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      {/* <ToDo /> */}
      <ToDoPage />
    </>
  );
}

export default App;
