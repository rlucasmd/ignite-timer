import { 
  ReactNode, 
  createContext, 
  useEffect, 
  useReducer, 
  useState 
} from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { 
  addNewCycleAction, 
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction
} from "../reducers/cycles/actions";
import version from "../../package.json";
import { differenceInSeconds } from "date-fns";
import { produce } from "immer";

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

const localStorageKey = `@ignite-timer:cycles-state-${version}`;

function CyclesContextProvider({ children }: CyclesContextProviderType) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer
    , {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(localStorageKey);
      if(storedStateAsJson){
        const data = JSON.parse(storedStateAsJson);
        // const newData = {...data, cycles: data.cycles.map(cycle => ())};
        return data;
      }
      return initialState;
    }
  );
  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activeCycle){
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
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

    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem(localStorageKey, stateJSON);
  }, [cyclesState]);

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