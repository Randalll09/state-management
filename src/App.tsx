import { createGlobalStyle } from 'styled-components';
import ToDoList from './ToDoList';

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
      <ToDoList />
    </>
  );
}

export default App;
