import { ReactNode, createContext, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}


interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

const CyclesContext = createContext({} as CyclesContextType);


interface CyclesContextProviderType {
  children: ReactNode;
}

function CyclesContextProvider({ children }: CyclesContextProviderType) {


  const [cyclesState, dispatch] = useReducer(
    cyclesReducer
    , {
      cycles: [],
      activeCycleId: null,
    }
  );


  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: {
        activeCycleId
      }
    });
  }
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: "CREATE_NEW_CYCLE",
      payload: {
        newCycle
      }
    });
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId
      }
    });
  }
  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      markCurrentCycleAsFinished,
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CyclesContext.Provider>
  );
}

export { CyclesContextProvider, CyclesContext };