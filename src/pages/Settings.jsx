import React from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Webhook & Sync Settings</h1>
        <button className="flex items-center px-4 py-2 bg-[#483285] text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Force Sync
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Webhook Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm font-medium text-gray-900">Shopify Webhook</span>
              </div>
              <span className="text-sm text-gray-500">Last updated: 5 minutes ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Webhook Logs</h2>
          <div className="space-y-4">
            {[
              { status: 'success', event: 'Product Created', time: '2 minutes ago' },
              { status: 'error', event: 'Product Updated', time: '5 minutes ago' },
              { status: 'success', event: 'Product Deleted', time: '10 minutes ago' },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {log.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{log.event}</p>
                    <p className="text-sm text-gray-500">{log.time}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${log.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;