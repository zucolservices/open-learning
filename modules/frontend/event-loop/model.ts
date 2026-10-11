/**
 * A four-line script stepped through the event loop, and a long task with and without
 * yielding. Timings are illustrative.
 */

export const CODE = [
  'console.log("A");',
  'setTimeout(() => console.log("B"), 0);',
  'Promise.resolve().then(() => console.log("C"));',
  'console.log("D");',
];

export interface Frame {
  line: number | null;
  stack: string[];
  micro: string[];
  tasks: string[];
  out: string[];
  note: string;
}

export const FRAMES: Frame[] = [
  {
    line: null,
    stack: ["script"],
    micro: [],
    tasks: [],
    out: [],
    note: "The whole script is one task. It goes on the call stack and runs top to bottom.",
  },
  {
    line: 0,
    stack: ["script", "console.log"],
    micro: [],
    tasks: [],
    out: ["A"],
    note: "Synchronous code runs immediately: A is printed.",
  },
  {
    line: 1,
    stack: ["script", "setTimeout"],
    micro: [],
    tasks: ["log B"],
    out: ["A"],
    note: "setTimeout doesn't run the callback. It asks the browser to queue a task later, even with 0 ms.",
  },
  {
    line: 2,
    stack: ["script", "then"],
    micro: ["log C"],
    tasks: ["log B"],
    out: ["A"],
    note: "A resolved promise queues its callback as a microtask.",
  },
  {
    line: 3,
    stack: ["script", "console.log"],
    micro: ["log C"],
    tasks: ["log B"],
    out: ["A", "D"],
    note: "Still synchronous: D is printed before anything queued.",
  },
  {
    line: null,
    stack: ["log C"],
    micro: [],
    tasks: ["log B"],
    out: ["A", "D", "C"],
    note: "The script task ends. Before anything else, the browser empties the microtask queue: C.",
  },
  {
    line: null,
    stack: [],
    micro: [],
    tasks: ["log B"],
    out: ["A", "D", "C"],
    note: "Stack empty, no microtasks: the browser may now render a frame if one is due.",
  },
  {
    line: null,
    stack: ["log B"],
    micro: [],
    tasks: [],
    out: ["A", "D", "C", "B"],
    note: "Only now does the next task run: B. Output: A, D, C, B.",
  },
];

export const ORDERS = ["A B C D", "A D B C", "A D C B", "A C D B"];
export const ANSWER = "A D C B";
