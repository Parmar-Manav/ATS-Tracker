import React from 'react';
import { Plus, Upload, Building2, Search, Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { ClientTable } from './components/ClientTable';
import { ClientForm } from './components/ClientForm';
import { BulkUpload } from './components/BulkUpload';
import type { Client, ClientExecutive } from './types';

function App() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [executives, setExecutives] = React.useState<ClientExecutive[]>([]);
  const [view, setView] = React.useState<'list' | 'form' | 'bulk'>('list');
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Simulated API calls - replace with actual API integration
  const fetchClients = async () => {
    // GET /clients
    const response = await fetch('http://localhost:5001/api/clients');
    if (!response.ok) throw new Error('Failed to fetch clients');
    const data = await response.json();
    setClients(data);
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async (client: Partial<Client>) => {
    await fetch('http://localhost:5001/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    fetchClients();
    setView('list');
  };

  const updateClient = async (client: Partial<Client>) => {
    // PUT /clients/{client_id}
    await fetch(`http://localhost:5001/api/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    setClients(prevClients => prevClients.map(c => c.id === client.id ? { ...c, ...client } : c));
    setView('list');
    setSelectedClient(null);
  };

  const deleteClient = async (id: string) => {
    // DELETE /clients/{client_id}
    await fetch(`http://localhost:5001/api/clients/${id}`, { method: 'DELETE' });
    setClients(prevClients => prevClients.filter(client => client.id !== id));
  };

  const bulkCreateClients = async (clients: Partial<Client>[]) => {
    // POST /clients/bulk
    // await fetch('http://localhost:5001/api/clients', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(clients),
    // });
    fetchClients();
    setView('list');
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setView('form');
  };

  const filteredClients = React.useMemo(() => {
    return clients.filter(client =>
      client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-indigo-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Client Management</h1>
            </div>
            {view === 'list' && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      {/* Add filter options here */}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clients..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-shrink-0 space-x-3">
                <button
                  onClick={() => setView('form')}
                  className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Client
                </button>
                <button
                  onClick={() => setView('bulk')}
                  className="inline-flex items-center px-4 py-2.5 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 shadow-sm transition-colors duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Bulk Upload
                </button>
              </div>
            </div>

            {filteredClients.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <ClientTable
                  clients={filteredClients}
                  onEdit={handleEdit}
                  onDelete={deleteClient}
                  onViewExecutives={(clientId) => {
                    // Implement executive management view
                    console.log('View executives for client:', clientId);
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery
                    ? 'No clients match your search criteria'
                    : 'Get started by creating a new client'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setView('form')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    New Client
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'form' && (
          <div className="bg-white rounded-lg shadow">
            <ClientForm
              initialData={selectedClient || undefined}
              onSubmit={selectedClient ? updateClient : createClient}
              onCancel={() => {
                setView('list');
                setSelectedClient(null);
              }}
              refreshClients={fetchClients}
            />
          </div>
        )}

        {view === 'bulk' && (
          <div className="bg-white rounded-lg shadow">
            <BulkUpload
              onUpload={bulkCreateClients}
              onCancel={() => setView('list')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;