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

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

function Home() {

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmount: 0,
      task: ""
    }
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

        <FormProvider {...newCycleForm}>

          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {
          activeCycle ? (
            <StopCountdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton disabled={isSubmitDisabled} type="submit">
              <Play size={24} />
              Começar
            </StartCountdownButton>
          )
        }

      </form>
    </HomeContainer>
  );

}

export { Home };