import React, { useState, useMemo } from 'react';
import { MortgageIcon } from './icons/MortgageIcon';

const MortgageCalculator: React.FC = () => {
  const [price, setPrice] = useState(2000000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);

  const formatCurrency = (value: number) => {
    return `AED ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const monthlyPayment = useMemo(() => {
    const loanAmount = price * (1 - downPayment / 100);
    if (loanAmount <= 0) return 0;

    const monthlyInterestRate = interestRate / 100 / 12;
    if (monthlyInterestRate <= 0) return 0;
    
    const numberOfPayments = loanTerm * 12;
    if (numberOfPayments <= 0) return 0;

    const payment = loanAmount * (
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
    return payment;
  }, [price, downPayment, interestRate, loanTerm]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <MortgageIcon className="w-8 h-8 text-brand-gold" />
        <h2 className="text-2xl font-bold text-brand-text">Mortgage Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg space-y-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-brand-light mb-1">Property Price (AED)</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-brand-light mb-1">Down Payment (%)</label>
            <input type="number" id="downPayment" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
            <input type="range" min="0" max="100" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full h-2 bg-brand-primary rounded-lg appearance-none cursor-pointer mt-2" />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-brand-light mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-brand-light mb-1">Loan Term (Years)</label>
            <input type="number" id="loanTerm" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
          </div>
        </div>
        
        {/* Results Display */}
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
            <p className="text-brand-light">Estimated Monthly Payment</p>
            <p className="text-5xl font-bold text-brand-gold my-4">
                {formatCurrency(monthlyPayment)}
            </p>
            <div className="w-full mt-4 space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-brand-primary/50 rounded-md">
                    <span className="text-brand-light">Loan Amount</span>
                    <span className="font-semibold text-brand-text">{formatCurrency(price * (1 - downPayment / 100))}</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-primary/50 rounded-md">
                    <span className="text-brand-light">Total Interest Paid</span>
                    <span className="font-semibold text-brand-text">{formatCurrency((monthlyPayment * loanTerm * 12) - (price * (1 - downPayment / 100)))}</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-primary/50 rounded-md">
                    <span className="text-brand-light">Total Payment</span>
                    <span className="font-semibold text-brand-text">{formatCurrency(monthlyPayment * loanTerm * 12)}</span>
                </div>
            </div>
            <p className="text-xs text-brand-light/50 mt-6">This is an estimate for informational purposes only. Consult with a financial advisor for precise figures.</p>
        </div>

      </div>
    </div>
  );
};

export default MortgageCalculator;
