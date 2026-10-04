/** The autonomy dial (after Hugging Face's smolagents scale) and an agent-or-not sort. */

export const LEVELS: { name: string; who: string; code: string; example: string }[] = [
  {
    name: "Simple processor",
    who: "The model's output changes nothing about what the program does next.",
    code: "answer = llm(question)\nprint(answer)",
    example: "Summarise this email.",
  },
  {
    name: "Router",
    who: "The model picks which of your fixed branches runs.",
    code: 'kind = llm("billing or technical?")\nif kind == "billing": billing_flow()\nelse: tech_flow()',
    example: "Send each support question to the right team's prompt.",
  },
  {
    name: "Tool caller",
    who: "The model picks a tool and its inputs; your code runs it once.",
    code: "call = llm(question, tools)\nresult = run(call)\nprint(llm(question, result))",
    example: "Look up order 42 and say where it is.",
  },
  {
    name: "Multi-step agent",
    who: "The model keeps choosing actions in a loop until it decides it's done.",
    code: "while True:\n  step = llm(goal, history, tools)\n  if step.done: break\n  history += run(step)",
    example: "Fix the failing test: read files, edit, run tests, repeat.",
  },
  {
    name: "Fully autonomous",
    who: "The model can also write and start new code or agents of its own.",
    code: "while True:\n  code = llm(goal, history)\n  history += execute(code)",
    example: "Rarely wise today; very powerful and very hard to control.",
  },
];
