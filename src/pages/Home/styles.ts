import styled from "styled-components";

const HomeContainer = styled.main`
  flex: 1;
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  form { 
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`;
const BaseCountdownButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 8px;
  
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 0.5rem;
  font-weight: bold;

  cursor: pointer;

  transition: background 0.3s;
  color: ${(props) => props.theme["gray-100"]};

  &:disabled{
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StartCountdownButton = styled(BaseCountdownButton)`
  background: ${(props) => props.theme["green-500"]};

  &:not(:disabled):hover{
    background: ${(props) => props.theme["green-700"]};
  }
`;


const StopCountdownButton = styled(BaseCountdownButton)`
  background: ${(props) => props.theme["red-500"]};
  

  &:not(:disabled):hover{
    background: ${(props) => props.theme["red-700"]};
  }
`;

export { 
  HomeContainer, 
  StartCountdownButton,
  StopCountdownButton
};