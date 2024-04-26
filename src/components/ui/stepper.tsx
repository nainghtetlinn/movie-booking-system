"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

type StepperProps = {
  orientation?: "horizontal" | "vertical"
  stepIndexType?: "number" | "dot"
  activeStep: number
}
type StepProps = {
  _index?: number
}

type StepperContextProps = { totalSteps: number } & StepperProps
type StepContextProps = { isLast: boolean; index: number }

const StepperContext = React.createContext<StepperContextProps | null>(null)
const StepContext = React.createContext<StepContextProps | null>(null)

function useStepper() {
  const context = React.useContext(StepperContext)

  if (!context) {
    throw new Error("useStepper must be used within a <Stepper />")
  }

  return context
}
function useStep() {
  const context = React.useContext(StepContext)

  if (!context) {
    throw new Error("useStep must be used within a <Step />")
  }

  return context
}

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StepperProps & { children: React.ReactElement[] }
>(
  (
    {
      orientation = "horizontal",
      stepIndexType = "number",
      activeStep,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean)

    return (
      <StepperContext.Provider
        value={{ totalSteps: childrenArray.length, orientation, stepIndexType, activeStep }}>
        <div
          ref={ref}
          className={cn("flex overflow-auto", orientation === "vertical" && "flex-col", className)}
          {...props}>
          {childrenArray.map((child, i) => {
            if (!React.isValidElement(child)) return child
            return React.cloneElement(child as React.ReactElement<{ _index: number }>, {
              _index: i,
            })
          })}
        </div>
      </StepperContext.Provider>
    )
  },
)
Stepper.displayName = "Stepper"

const Step = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & StepProps>(
  ({ _index = 0, className, children, ...props }, ref) => {
    const { orientation, totalSteps } = useStepper()

    const isLast = _index + 1 === totalSteps

    return (
      <StepContext.Provider value={{ isLast, index: _index }}>
        <div
          ref={ref}
          className={cn(
            orientation === "vertical" && "flex",
            orientation === "horizontal" && "flex-1",
            className,
          )}
          {...props}>
          <div className="relative shrink-0">
            <Dot />
            {!isLast && <Connector />}
          </div>
          <div
            className={cn(
              orientation === "vertical" && "ml-4 flex-1",
              orientation === "horizontal" && "mt-4",
            )}>
            {children}
          </div>
        </div>
      </StepContext.Provider>
    )
  },
)
Step.displayName = "Step"

const StepLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepper()

    return (
      <div
        ref={ref}
        className={cn(
          "font-semibold md:text-lg",
          orientation === "vertical" && "flex h-16 items-center",
          orientation === "horizontal" && "text-center",
          className,
        )}
        {...props}
      />
    )
  },
)
StepLabel.displayName = "StepLabel"

const StepContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { orientation, activeStep } = useStepper()
    const { index } = useStep()

    if (orientation === "horizontal")
      throw new Error("<StepContent/> should not be used if the orientation is horizontal.")

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <Collapsible open={index === activeStep}>
          <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)
StepContent.displayName = "StepContent"

const Dot = () => {
  const { orientation, stepIndexType, activeStep } = useStepper()
  const { index } = useStep()

  return (
    <div className={cn("flex items-center justify-center", orientation === "vertical" && "h-16 ")}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-8 ring-background",
          stepIndexType === "number" && "h-8 w-8",
          stepIndexType === "dot" && "h-4 w-4",
          index <= activeStep && "bg-primary text-primary-foreground",
        )}>
        {stepIndexType === "number" ? (
          index < activeStep ? (
            <Check className="h-4 w-4" />
          ) : (
            index + 1
          )
        ) : null}
      </div>
    </div>
  )
}

const Connector = () => {
  const { orientation, stepIndexType, activeStep } = useStepper()
  const { index } = useStep()

  return (
    <div
      className={cn(
        "absolute -z-10 bg-foreground",
        index < activeStep && "bg-primary",
        orientation === "vertical" && "top-6 h-full w-[1px]",
        orientation === "vertical" && stepIndexType === "number" && "left-4",
        orientation === "vertical" && stepIndexType === "dot" && "left-2",
        orientation === "horizontal" && "left-1/2 h-[1px] w-full",
        orientation === "horizontal" && stepIndexType === "number" && "top-4",
        orientation === "horizontal" && stepIndexType === "dot" && "top-2",
      )}
    />
  )
}

export { Stepper, Step, StepLabel, StepContent }
