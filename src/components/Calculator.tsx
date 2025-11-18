import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Delete, Equal } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const formatDisplay = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // Format large numbers with commas
    if (Math.abs(num) >= 1000) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
    }
    
    return value;
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500 hover:bg-red-600 text-white col-span-2' },
    { label: '⌫', action: () => {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
    }, className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { label: '/', action: () => performOperation('/'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '*', action: () => performOperation('*'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '-', action: () => performOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '+', action: () => performOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '0', action: () => inputNumber('0'), className: 'bg-gray-200 hover:bg-gray-300 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '=', action: handleEquals, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalculatorIcon className="h-5 w-5 mr-2" />
          Calculator
        </h2>
        <p className="text-gray-600 mt-1">
          Quick calculations for your financial planning and budgeting.
        </p>
      </div>

      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Display */}
        <div className="mb-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
            <div className="text-3xl font-mono font-bold overflow-hidden">
              {formatDisplay(display)}
            </div>
            {operation && previousValue !== null && (
              <div className="text-sm text-gray-400 mt-1">
                {formatDisplay(String(previousValue))} {operation}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`p-3 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const result = parseFloat(display) * 0.1;
                setDisplay(String(result));
                setWaitingForOperand(true);
              }}
              className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded text-sm font-medium transition-colors"
            >
              10% of value
            </button>
            <button
              onClick={() => {
                const result = parseFloat(display) * 1.1;
                setDisplay(String(result));
                setWaitingForOperand(true);
              }}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded text-sm font-medium transition-colors"
            >
              +10% markup
            </button>
          </div>
        </div>

        {/* Memory Display */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            Use this calculator for quick financial calculations
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4 max-w-sm mx-auto">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Calculator Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Basic arithmetic operations (+, -, *, /)</li>
          <li>• Decimal point calculations</li>
          <li>• Clear and backspace functions</li>
          <li>• Quick percentage calculations</li>
          <li>• Large number formatting with commas</li>
        </ul>
      </div>
    </div>
  );
};