import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Calendar, DollarSign, FileText, Tag, Building } from 'lucide-react';

interface TransactionFormProps {
  type: 'income' | 'expense';
  userId: string;
  onTransactionAdded: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ type, userId, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const incomeCategories = [
    'Membership Fees',
    'Sponsorships',
    'Event Earnings',
    'Donations',
    'Grants',
    'Other Income'
  ];

  const expenseCategories = [
    'Event Costs',
    'Office Supplies',
    'Marketing',
    'Equipment',
    'Travel',
    'Professional Services',
    'Other Expenses'
  ];

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('transactions').insert([
        {
          user_id: userId,
          type,
          amount: parseFloat(formData.amount),
          description: formData.description,
          category: formData.category,
          vendor: type === 'expense' ? formData.vendor : null,
          date: formData.date,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        amount: '',
        description: '',
        category: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
      });
      onTransactionAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </h2>
        <p className="text-gray-600 mt-1">
          Record a new {type} transaction with all necessary details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="vendor"
                  name="vendor"
                  type="text"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vendor name"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a detailed description"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">
              {type === 'income' ? 'Income' : 'Expense'} added successfully!
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              type === 'income'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </div>
      </form>
    </div>
  );
};