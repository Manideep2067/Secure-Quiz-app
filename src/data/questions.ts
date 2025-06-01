
import { Question } from '../types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is React?",
    options: ["Library", "Framework", "IDE", "Tool"],
    correct: "Library"
  },
  {
    id: 2,
    question: "Which hook is used for state management in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correct: "useState"
  },
  {
    id: 3,
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"],
    correct: "JavaScript XML"
  },
  {
    id: 4,
    question: "Which method is used to render a React component?",
    options: ["render()", "display()", "show()", "create()"],
    correct: "render()"
  },
  {
    id: 5,
    question: "What is the virtual DOM?",
    options: ["A copy of the real DOM", "A JavaScript representation of the DOM", "A server-side DOM", "A mobile DOM"],
    correct: "A JavaScript representation of the DOM"
  },
  {
    id: 6,
    question: "Which hook is used for side effects?",
    options: ["useState", "useEffect", "useContext", "useMemo"],
    correct: "useEffect"
  },
  {
    id: 7,
    question: "What is a React component?",
    options: ["A function or class that returns JSX", "A CSS file", "A JavaScript variable", "An HTML element"],
    correct: "A function or class that returns JSX"
  },
  {
    id: 8,
    question: "What is props in React?",
    options: ["Properties passed to components", "State variables", "CSS styles", "Event handlers"],
    correct: "Properties passed to components"
  }
];
