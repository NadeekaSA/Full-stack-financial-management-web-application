import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, FileText, Calendar } from 'lucide-react';

export const ExportData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const exportToCSV = async () => {
    setLoading(true);
    
    try {
      let query = supabase.from('transactions').select('*');
      
      if (dateRange.from) {
        query = query.gte('date', dateRange.from);
      }
      
      if (dateRange.to) {
        query = query.lte('date', dateRange.to);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert('No data to export');
        return;
      }

      // Create CSV content
      const headers = ['Date', 'Type', 'Description', 'Category', 'Vendor', 'Amount'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.date,
          row.type,
          `"${row.description}"`,
          row.category,
          row.vendor || '',
          row.amount
        ].join(','))
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </h3>
          <p className="text-gray-600 mt-1">
            Export your financial data to CSV format for external analysis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-2">
            From Date (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              id="from-date"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-2">
            To Date (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              id="to-date"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={exportToCSV}
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              'Exporting...'
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Information</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• CSV format compatible with Excel and other spreadsheet applications</li>
          <li>• Includes all transaction details: date, type, description, category, vendor, and amount</li>
          <li>• Use date filters to export specific time periods</li>
          <li>• Leave date fields empty to export all transactions</li>
        </ul>
      </div>
    </div>
  );
};