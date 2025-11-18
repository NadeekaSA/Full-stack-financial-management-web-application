import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExportData } from './components/ExportData';
import { FileViewer } from './components/FileViewer';
import { FileUpload } from './components/FileUpload';
import { BudgetManager } from './components/BudgetManager';
import { Calculator } from './components/Calculator';
import { useAuth } from './hooks/useAuth';
import { DollarSign, Plus, List, Download, FileText, Upload, Calendar, Calculator as CalculatorIcon } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const userRole = user.user_metadata?.role || 'member';
  const isTreasurer = userRole === 'treasurer';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/cslogo.png" alt="Logo" className="h-8 w-8" />
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Finance Tracker of CS of ICBT</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email} ({userRole})
              </span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="inline h-4 w-4 mr-1" />
              Dashboard
            </button>
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('add-income')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-income'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-1" />
                Add Income
              </button>
            )}
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('add-expense')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-expense'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-1" />
                Add Expense
              </button>
            )}
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <List className="inline h-4 w-4 mr-1" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calculator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalculatorIcon className="inline h-4 w-4 mr-1" />
              Calculator
            </button>
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('export')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'export'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Download className="inline h-4 w-4 mr-1" />
                Export
              </button>
            )}
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="inline h-4 w-4 mr-1" />
                Upload Files
              </button>
            )}
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('files')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'files'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline h-4 w-4 mr-1" />
                View Files
              </button>
            )}
            {isTreasurer && (
              <button
                onClick={() => setActiveTab('budget')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'budget'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="inline h-4 w-4 mr-1" />
                Budget
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && <Dashboard refreshTrigger={refreshTrigger} />}
          {activeTab === 'add-income' && isTreasurer && (
            <TransactionForm type="income" userId={user.id} onTransactionAdded={handleTransactionAdded} />
          )}
          {activeTab === 'add-expense' && isTreasurer && (
            <TransactionForm type="expense" userId={user.id} onTransactionAdded={handleTransactionAdded} />
          )}
          {activeTab === 'transactions' && <TransactionList refreshTrigger={refreshTrigger} />}
          {activeTab === 'export' && isTreasurer && <ExportData />}
          {activeTab === 'upload' && isTreasurer && <FileUpload />}
          {activeTab === 'files' && isTreasurer && <FileViewer />}
          {activeTab === 'budget' && isTreasurer && <BudgetManager />}
          {activeTab === 'calculator' && <Calculator />}
        </div>
      </main>
    </div>
  );
}

export default App;