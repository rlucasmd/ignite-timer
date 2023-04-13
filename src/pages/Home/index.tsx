import { createContext, useState } from "react";
import { HandPalm, Play } from "phosphor-react";
import { 
  HomeContainer, 
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Countdown } from "./components/Countdown";
import { FormContainer } from "./components/NewCycleForm/styles";
import * as zod from "zod";
import { NewCycleForm } from "./components/NewCycleForm";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export const CyclesContext = createContext({} as CyclesContextType);

function Home(){

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmount: 0,
      task: ""
    }
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData){
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
    
    reset();
  }
  
  function handleInterruptCycle(){
    
    setCycles((state) => 
      state.map((cycle) => {
        if(cycle.id === activeCycleId)
          return { ...cycle, interruptedDate: new Date() };

        return { ...cycle };
      })
    );
    setActiveCycleId(null);
  }

  function markCurrentCycleAsFinished(){
    setCycles((state) => 
      state.map((cycle) => {
        if(cycle.id === activeCycleId)
          return { ...cycle, finishedDate: new Date() };
    
        return { ...cycle };
      })
    );
  }
  function setSecondsPassed(seconds: number){
    setAmountSecondsPassed(seconds);
  }
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  
  const task = watch("task");
  const isSubmitDisabled = !task;

  return(
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider value={{ 
          activeCycle, 
          activeCycleId, 
          markCurrentCycleAsFinished,
          amountSecondsPassed,
          setSecondsPassed
        }}>
          <FormProvider {...newCycleForm}>
            
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {
          activeCycle ? (
            <StopCountdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm size={24}/>
                Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton disabled={isSubmitDisabled} type="submit">
              <Play size={24}/>
                Começar
            </StartCountdownButton>
          )
        }
        
      </form>
    </HomeContainer>
  );

}

export { Home };