import React, { useState } from "react";

// importing components
import Display from "./Display";
import Buttons from "./Buttons";

// importing css styles
import "./styles/Calculator.css";

// math library for JavaScript and Node.js.
import { evaluate, round } from "mathjs";

// this component is called in app.js
function Calculator() {
  // setting states for answer & input
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  // checks in input via user : square/ cube/ log/ cube root / input length < 14
  const inputHandler = (event) => {
    if (answer === "Invalid Input!!") return;

    let val = event.target.innerText;
    if (val === "x2") {
      val = "^2";
    } else if (val === "x3") {
      val = "^3";
    } else if (val === "3√") {
      val = "^(1÷3)";
    } else if (val === "log") {
      val = "log(";
    }

    let str = input + val;
    if (str.length > 14) {
      return;
    }

    // if answer(prev answer) is ! empty, update input display & initialize answer to ""
    if (answer !== "") {
      setInput(answer + val);
      setAnswer("");
    } else {
    // 1st time computing
      setInput(str);
    }
  };

  //clear input/output screen
  const clearInput = () => {
    setInput("");
    setAnswer("");
  };

  // checking if brackets in input expression are balanced or not
    // code taken from stack DS question in CN course
  const checkBracketBalanced = (expr) => {
    let stack = [];
    for (let i = 0; i < expr.length; i++) {
      let x = expr[i];
      if (x === "(") {
        stack.push(x);
        continue;
      }

      if (x === ")") {
        if (stack.length === 0) return false;
        else stack.pop();
      }
    }
    return stack.length === 0;
  };

  // calculate final answer
  const calculateAns = () => {
    if (input === "") return;
    let result = 0;
    let finalexpression = input;
    //  finalexpression = input.replaceAll("^", "**");  //for eval()
    finalexpression = finalexpression.replaceAll("x", "*");
    finalexpression = finalexpression.replaceAll("÷", "/");

    // evaluate square root
    let noSqrt = input.match(/√[0-9]+/gi);

    if (noSqrt !== null) {
      let evalSqrt = input;
      for (let i = 0; i < noSqrt.length; i++) {
        evalSqrt = evalSqrt.replace(
          noSqrt[i],
          `sqrt(${noSqrt[i].substring(1)})`
        );
      }
      finalexpression = evalSqrt;
    }

    try {
      // check brackets are balanced or not
      if (!checkBracketBalanced(finalexpression)) {
        const errorMessage = { message: "Brackets are not balanced!" };
        throw errorMessage;
      }
      result = evaluate(finalexpression); //mathjs
    } catch (error) {
      result =
        error.message === "Brackets are not balanced!"
          ? "Brackets are not balanced!"
          : "Invalid Input!!"; //error.message;
    }
    isNaN(result) ? setAnswer(result) : setAnswer(round(result, 3));
  };

  // implementing backspace button functionality = removing last character
  const backspace = () => {
    if (answer !== "") {
      setInput(answer.toString().slice(0, -1));
      setAnswer("");
    } else {
      // 1st time computation...
      setInput((prev) => prev.slice(0, -1));
    }
  };

  // change prefix of expression
  const changePlusMinus = () => {
    // if operator is - then change to + & vice versa
    if (answer === "Invalid Input!!") return;
    // ! computing 1st time
    else if (answer !== "") {
  
      let ans = answer.toString();
      
      if (ans.charAt(0) === "-") {
        let plus = "+";
        setInput(plus.concat(ans.slice(1, ans.length)));
      } else if (ans.charAt(0) === "+") {
        let minus = "-";
        setInput(minus.concat(ans.slice(1, ans.length)));
      } else {
        let minus = "-";
        setInput(minus.concat(ans));
      }
      setAnswer("");
      // computing 1st time...
    } else {
      if (input.charAt(0) === "-") {
        let plus = "+";
        setInput((prev) => plus.concat(prev.slice(1, prev.length)));
      } else if (input.charAt(0) === "+") {
        let minus = "-";
        setInput((prev) => minus.concat(prev.slice(1, prev.length)));
      } else {
        let minus = "-";
        setInput((prev) => minus.concat(prev));
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="main">
          <Display input={input} setInput={setInput} answer={answer} />
          <Buttons
            inputHandler={inputHandler}
            clearInput={clearInput}
            backspace={backspace}
            changePlusMinus={changePlusMinus}
            calculateAns={calculateAns}
          />
        </div>
      </div>
    </>
  );
}

export default Calculator;
