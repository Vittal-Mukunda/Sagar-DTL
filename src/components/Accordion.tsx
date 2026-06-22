import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

/** Bauhaus FAQ accordion: white closed -> red open header -> yellow body. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="border-2 md:border-4 border-foreground shadow-hard bg-white"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`press flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold uppercase tracking-wide ${
                isOpen ? "bg-bauhaus-red text-white" : "bg-white text-foreground"
              }`}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-6 w-6 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t-4 border-foreground bg-[#FFF9C4] px-5 py-4 font-medium leading-relaxed text-foreground">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
