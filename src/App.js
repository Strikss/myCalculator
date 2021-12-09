import { useReducer } from "react";
import style from "./App.module.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const actions = {
  ADD_DIGIT: "ADD_DIGIT",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  CLEAR: "CLEAR",
  DELETE_DIGIT: "DELETE_DIGIT",
  EVALUATE: "EVALUATE",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case actions.ADD_DIGIT: {
      if (
        (state.afterEquals && payload.digit === "0") ||
        payload.digit === "."
      ) {
        return state;
      }
      if (state.afterEquals) {
        return {
          ...state,
          currOperand: payload.digit,
          afterEquals: false,
        };
      }
      if (payload.digit === "0" && state.currOperand === "0") {
        return state;
      }
      if (
        state.currOperand === "" &&
        (payload.digit === "." || payload.digit === "0")
      ) {
        return state;
      }
      if (payload.digit === "." && state.currOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };
    }

    case actions.CLEAR: {
      return { currOperand: "", prevOperand: "", operation: "" };
    }

    case actions.CHOOSE_OPERATION: {
      if (state.currOperand === "" && state.prevOperand === "") {
        return state;
      }
      if (state.currOperand === "" && state.operation === payload.operation) {
        return state;
      }
      if (state.currOperand === "" && state.operation !== payload.operation) {
        return { ...state, operation: payload.operation };
      }
      if (state.prevOperand === "") {
        return {
          ...state,
          prevOperand: state.currOperand,
          currOperand: "",
          operation: payload.operation,
        };
      }
      return {
        ...state,
        currOperand: "",
        operation: payload.operation,
        prevOperand: evaluate(state),
      };
    }
    case actions.EVALUATE: {
      return {
        ...state,
        currOperand: evaluate(state),
        operation: "",
        prevOperand: "",
        afterEquals: true,
      };
    }
    case actions.DELETE_DIGIT: {
      return {
        ...state,
        currOperand: state.currOperand.substring(
          0,
          state.currOperand.length - 1
        ),
      };
    }
    default: {
      return { state };
    }
  }
};

const evaluate = ({ prevOperand, currOperand, operation }) => {
  let sum = "";
  let prev = parseFloat(prevOperand);
  let curr = parseFloat(currOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  switch (operation) {
    case "/": {
      sum = String(prev / curr);
      break;
    }
    case "*": {
      sum = String(prev * curr);
      break;
    }
    case "+": {
      sum = String(prev + curr);
      break;
    }
    case "-": {
      sum = String(prev - curr);
      break;
    }
    default:
  }
  return sum;
};

const App = () => {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    { currOperand: "", prevOperand: "", operation: "", afterEquals: true }
  );

  return (
    <div className={style.container}>
      <div className={style.output}>
        <div className={style.top}>
          {prevOperand} {operation}
        </div>
        <div className={style.bottom}>{currOperand}</div>
      </div>
      <button
        className={style.spanTwo}
        onClick={() => dispatch({ type: actions.CLEAR })}
      >
        AC
      </button>
      <button
        className={style.spanOne}
        onClick={() => dispatch({ type: actions.DELETE_DIGIT })}
      >
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className={style.spanTwo}
        onClick={() => dispatch({ type: actions.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default App;
