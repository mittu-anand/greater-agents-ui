import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "../store/useWizardStore";
import Step1Basics    from "./wizard/Step1Basics";
import Step2Toolkit   from "./wizard/Step2Toolkit";
import Step3Prompt    from "./wizard/Step3Prompt";
import Step4Tools     from "./wizard/Step4Tools";
import Step5Save      from "./wizard/Step5Deploy";
import { Button }     from "../components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = ["Basics", "Toolkit & LLM", "System Prompt", "Tools & Trigger", "Review"];

export default function AgentWizardPage() {
  const navigate = useNavigate();
  const { step, setStep, reset } = useWizardStore();

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const back = () => step > 1 ? setStep(step - 1) : navigate("/agents");

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done   = n < step;
          const active = n === step;
          return (
            <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-colors
                ${done   ? "bg-(--color-accent) text-white"
                : active ? "bg-(--color-text) text-(--color-bg)"
                :          "bg-(--color-border) text-(--color-muted)"}`}>
                {done ? "✓" : n}
              </div>
              <span className={`text-xs hidden sm:block ${active ? "text-(--color-text) font-medium" : "text-(--color-muted)"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? "bg-(--color-accent)" : "bg-(--color-border)"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="mb-8">
        {step === 1 && <Step1Basics />}
        {step === 2 && <Step2Toolkit farmId="" />}
        {step === 3 && <Step3Prompt />}
        {step === 4 && <Step4Tools farmId="" />}
        {step === 5 && <Step5Save onSuccess={() => { reset(); navigate("/agents"); }} />}
      </div>

      {/* Nav */}
      {step < 5 && (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={back}><ChevronLeft size={15} /> Back</Button>
          <StepContinue step={step} onNext={() => setStep(step + 1)} />
        </div>
      )}
      {step === 5 && (
        <Button variant="ghost" onClick={back}><ChevronLeft size={15} /> Back</Button>
      )}
    </div>
  );
}

function StepContinue({ step, onNext }: { step: number; onNext: () => void }) {
  const data = useWizardStore((s) => s.data);
  const disabled =
    (step === 1 && data.name.trim().length < 3) ||
    (step === 2 && (!data.toolkit || !data.llm_id)) ||
    (step === 3 && data.system_prompt.trim().length < 20) ||
    (step === 4 && !data.trigger_type);
  return (
    <Button onClick={onNext} disabled={disabled}>Continue <ChevronRight size={15} /></Button>
  );
}
