'use client';

import { useMemo, useState } from 'react';

const buttons = [
  'C', '←', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '±', '0', '.', '='
];

const operators = new Set(['+', '-', '×', '÷']);

const toNumber = (value) => Number(value || '0');

const calculate = (left, operator, right) => {
  const a = toNumber(left);
  const b = toNumber(right);

  if (operator === '÷' && b === 0) {
    return { value: 'エラー', error: true };
  }

  switch (operator) {
    case '+':
      return { value: String(a + b), error: false };
    case '-':
      return { value: String(a - b), error: false };
    case '×':
      return { value: String(a * b), error: false };
    case '÷':
      return { value: String(a / b), error: false };
    default:
      return { value: right, error: false };
  }
};

export default function Home() {
  const [display, setDisplay] = useState('0');
  const [leftOperand, setLeftOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [error, setError] = useState(false);

  const expression = useMemo(() => {
    if (!operator || leftOperand === null) return '入力待ち';
    return `${leftOperand} ${operator} ${shouldReset ? '' : display}`.trim();
  }, [display, leftOperand, operator, shouldReset]);

  const resetAll = () => {
    setDisplay('0');
    setLeftOperand(null);
    setOperator(null);
    setShouldReset(false);
    setError(false);
  };

  const setResult = (next) => {
    setDisplay(next.value);
    setError(next.error);
  };

  const inputDigit = (digit) => {
    if (error) {
      setDisplay(digit === '.' ? '0.' : digit);
      setError(false);
      setShouldReset(false);
      return;
    }

    if (shouldReset) {
      setDisplay(digit === '.' ? '0.' : digit);
      setShouldReset(false);
      return;
    }

    if (digit === '.' && display.includes('.')) return;
    setDisplay((prev) => {
      if (digit === '.' && prev === '0') return '0.';
      if (prev === '0' && digit !== '.') return digit;
      return prev + digit;
    });
  };

  const backspace = () => {
    if (error || shouldReset) return;
    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) return '0';
      return prev.slice(0, -1);
    });
  };

  const toggleSign = () => {
    if (display === '0' || error) return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  };

  const toPercent = () => {
    if (error) return;
    setDisplay((toNumber(display) / 100).toString());
  };

  const chooseOperator = (nextOperator) => {
    if (error) return;

    if (operator && !shouldReset) {
      const next = calculate(leftOperand, operator, display);
      setResult(next);
      setLeftOperand(next.value);
      if (next.error) {
        setOperator(null);
        return;
      }
    } else {
      setLeftOperand(display);
    }

    setOperator(nextOperator);
    setShouldReset(true);
  };

  const equals = () => {
    if (!operator || leftOperand === null || error) return;

    const next = calculate(leftOperand, operator, display);
    setResult(next);
    setLeftOperand(null);
    setOperator(null);
    setShouldReset(true);
  };

  const onPress = (value) => {
    if (/^[0-9.]$/.test(value)) return inputDigit(value);
    if (value === 'C') return resetAll();
    if (value === '←') return backspace();
    if (value === '±') return toggleSign();
    if (value === '%') return toPercent();
    if (value === '=') return equals();
    if (operators.has(value)) return chooseOperator(value);
  };

  return (
    <main className="container">
      <section className="calculator" aria-label="電卓">
        <h1 className="title">わかりやすい計算機</h1>
        <p className="hint">{expression}</p>
        <output className={`display ${error ? 'error' : ''}`} aria-live="polite">{display}</output>
        <div className="grid">
          {buttons.map((button) => {
            const isOperator = operators.has(button) || button === '=';
            return (
              <button
                key={button}
                type="button"
                className={`btn ${isOperator ? 'operator' : ''}`}
                onClick={() => onPress(button)}
                aria-label={`${button} ボタン`}
              >
                {button}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
