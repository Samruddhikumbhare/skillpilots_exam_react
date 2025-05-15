// QuestionContext.js
import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../hooks/api";

// Create Context
const QuestionContext = createContext();

// Context Provider Component
export const QuestionProvider = ({ children }) => {
  const [getAllQuestion, setAllQuestion] = useState([]);
  const [loader, setLoader] = useState(true);
  const [ids, setIds] = useState({
    test: null,
    level: null,
  });

  useEffect(() => {
    if (ids.test !== null && ids.level !== null) {
      axios
        .get(
          `${api}/newskill/questions/${
            ids.test
          }?level=${ids.level.toUpperCase()}`
        )
        .then((response) => {
          setAllQuestion(response.data);
        })
        .catch((error) => {});
    }

    // setAllQuestion(
    //   {
    //     testName: "Java Programming Basics",
    //     timeLimit: 150,
    //     passingMarks: 25,
    //     marksPerQue: 2,
    //     totalQuestion: 25,
    //     sections: [
    //       {
    //         sectionName: "Java Fundamentals",
    //         questions: [
    //           {
    //             id: 1,
    //             questionText: "What is the size of an int variable in Java?",
    //             optionA: "2 bytes",
    //             optionB: "4 bytes",
    //             optionC: "8 bytes",
    //             optionD: "16 bytes",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 2,
    //             questionText:
    //               "Which of the following are valid primitive data types in Java?",
    //             optionA: "int",
    //             optionB: "float",
    //             optionC: "boolean",
    //             optionD: "string",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 3,
    //             questionText: "Java is a platform-independent language.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //           {
    //             id: 4,
    //             questionText:
    //               "Which keyword is used to define a constant in Java?",
    //             optionA: "static",
    //             optionB: "final",
    //             optionC: "const",
    //             optionD: "var",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 5,
    //             questionText:
    //               "Which of the following are valid Java identifiers?",
    //             optionA: "myVariable",
    //             optionB: "123var",
    //             optionC: "_variable",
    //             optionD: "$amount",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //         ],
    //       },
    //       {
    //         sectionName: "Object-Oriented Programming",
    //         questions: [
    //           {
    //             id: 6,
    //             questionText: "Which principle of OOP promotes code reuse?",
    //             optionA: "Encapsulation",
    //             optionB: "Abstraction",
    //             optionC: "Inheritance",
    //             optionD: "Polymorphism",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 7,
    //             questionText: "Encapsulation helps in data hiding.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //           {
    //             id: 8,
    //             questionText: "Which of the following are pillars of OOP?",
    //             optionA: "Encapsulation",
    //             optionB: "Compilation",
    //             optionC: "Polymorphism",
    //             optionD: "Inheritance",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 9,
    //             questionText:
    //               "Which access modifier makes a variable or method accessible only within the same class?",
    //             optionA: "public",
    //             optionB: "protected",
    //             optionC: "private",
    //             optionD: "default",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 10,
    //             questionText: "A constructor can have a return type in Java.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //         ],
    //       },
    //       {
    //         sectionName: "Exception Handling",
    //         questions: [
    //           {
    //             id: 11,
    //             questionText:
    //               "Which keyword is used to handle exceptions in Java?",
    //             optionA: "catch",
    //             optionB: "try",
    //             optionC: "throw",
    //             optionD: "All of the above",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 12,
    //             questionText:
    //               "Which of the following are checked exceptions in Java?",
    //             optionA: "IOException",
    //             optionB: "ArithmeticException",
    //             optionC: "NullPointerException",
    //             optionD: "SQLException",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 13,
    //             questionText:
    //               "Exceptions in Java are handled using the try-catch block.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //           {
    //             id: 14,
    //             questionText:
    //               "What is the superclass of all exception classes in Java?",
    //             optionA: "Throwable",
    //             optionB: "Error",
    //             optionC: "Exception",
    //             optionD: "RuntimeException",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 15,
    //             questionText:
    //               "Which of the following are runtime exceptions in Java?",
    //             optionA: "NullPointerException",
    //             optionB: "ClassNotFoundException",
    //             optionC: "ArithmeticException",
    //             optionD: "FileNotFoundException",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //         ],
    //       },
    //       {
    //         sectionName: "Java Collections",
    //         questions: [
    //           {
    //             id: 16,
    //             questionText:
    //               "Which Java collection does not allow duplicate elements?",
    //             optionA: "List",
    //             optionB: "Set",
    //             optionC: "Queue",
    //             optionD: "Map",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 17,
    //             questionText:
    //               "A HashMap maintains the insertion order of elements.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //           {
    //             id: 18,
    //             questionText:
    //               "Which of the following classes implement the List interface?",
    //             optionA: "ArrayList",
    //             optionB: "HashSet",
    //             optionC: "LinkedList",
    //             optionD: "TreeSet",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 19,
    //             questionText:
    //               "Which data structure is used to implement a Queue in Java?",
    //             optionA: "ArrayList",
    //             optionB: "LinkedList",
    //             optionC: "HashSet",
    //             optionD: "Stack",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 20,
    //             questionText: "TreeSet allows duplicate elements in Java.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //         ],
    //       },
    //       {
    //         sectionName: "Multithreading",
    //         questions: [
    //           {
    //             id: 21,
    //             questionText:
    //               "Which interface is implemented by threads in Java?",
    //             optionA: "Runnable",
    //             optionB: "Callable",
    //             optionC: "Threadable",
    //             optionD: "Multithread",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 22,
    //             questionText: "Thread.sleep() releases the lock on an object.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //           {
    //             id: 23,
    //             questionText:
    //               "Which of the following are thread lifecycle states in Java?",
    //             optionA: "New",
    //             optionB: "Waiting",
    //             optionC: "Running",
    //             optionD: "Destroy",
    //             questionType: "MULTIPLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 24,
    //             questionText: "Which method is used to start a thread in Java?",
    //             optionA: "run()",
    //             optionB: "start()",
    //             optionC: "execute()",
    //             optionD: "begin()",
    //             questionType: "SINGLE_ANSWER",
    //             marks: 2,
    //           },
    //           {
    //             id: 25,
    //             questionText:
    //               "A thread in Java can be stopped using the stop() method.",
    //             optionA: "True",
    //             optionB: "False",
    //             questionType: "TRUE_FALSE",
    //             marks: 2,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // );
    // setLoader(false);
  }, [ids]);

  return (
    <QuestionContext.Provider
      value={{ getAllQuestion, setAllQuestion, setIds, loader, setLoader }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

// Custom Hook to use Context
export const useQuestion = () => useContext(QuestionContext);
