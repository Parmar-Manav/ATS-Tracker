import React from "react"
import { Edit2, Trash2, Users, Eye } from "lucide-react"
import type { Client } from "../types"
import { ClientForm } from "./ClientForm"

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
  onViewExecutives: (clientId: string) => void
  viewMode: "grid" | "list"
  refreshClients: () => void
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  onViewExecutives,
  viewMode,
  refreshClients,
}: ClientTableProps) {
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [mode, setMode] = React.useState<"table" | "edit" | "view">("table")

  const handleView = (client: Client) => {
    setSelectedClient(client)
    setMode("view")
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setMode("edit")
  }

  const handleCancel = () => {
    setMode("table")
    setSelectedClient(null)
  }

  const handleSubmit = async (updatedClient: Partial<Client>) => {
    await onEdit(updatedClient as Client)
    setMode("table")
    setSelectedClient(null)
  }

  if (mode === "edit" || mode === "view") {
    return (
      <ClientForm
        initialData={selectedClient!}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        refreshClients={refreshClients}
        readOnly={mode === "view"}
      />
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{client.client_name}</h3>
            <p className="text-sm text-gray-600 mb-1">{client.contact_person}</p>
            <p className="text-sm text-gray-600 mb-2">{client.contact_email}</p>
            <div className="mt-auto flex justify-between items-center">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {client.status}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => client.id && onViewExecutives(client.id.toString())}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button onClick={() => handleView(client)} className="text-gray-600 hover:text-gray-900">
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => client.id && onDelete(client.id.toString())}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contact Person
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {clients.map((client) => (
          <tr key={client.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{client.contact_person}</div>
              <div className="text-sm text-gray-500">{client.contact_email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {client.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-3">
                <button
                  onClick={() => client.id && onViewExecutives(client.id.toString())}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button onClick={() => handleView(client)} className="text-gray-600 hover:text-gray-900">
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => client.id && onDelete(client.id.toString())}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// import { useState, useEffect } from "react";
// import { Edit2, Trash2, Users, Eye } from "lucide-react";
// import type { Client } from "../types";
// import { ClientForm } from "./ClientForm";

// interface ClientTableProps {
//   clients: Client[];
//   onEdit: (client: Client) => void;
//   onDelete: (id: string) => void;
//   onViewExecutives: (clientId: string) => void;
//   viewMode: "grid" | "list"
//   refreshClients: () => void
// }

// export function ClientTable({ onViewExecutives }: ClientTableProps) {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [viewMode, setViewMode] = useState<"table" | "edit" | "view">("table");

//   // Fetch Clients
//   const fetchClients = async () => {
//     try {
//       const response = await fetch("http://localhost:5001/api/clients");
//       if (!response.ok) throw new Error("Failed to fetch clients");
//       const data = await response.json();
//       setClients(data);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   // Delete Client
//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`http://localhost:5001/api/clients/${id}`, { method: "DELETE" });
//       setClients((prevClients) => prevClients.filter((client) => client.id?.toString() !== id));
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   // Edit Client
//   const handleEdit = (client: Client) => {
//     setSelectedClient(client);
//     setViewMode("edit");
//   };

//   // View Client Details
//   const handleView = (client: Client) => {
//     setSelectedClient(client);
//     setViewMode("view");
//   };

//   // Submit Updated Client Data
//   const handleSubmit = async (updatedClient: Partial<Client>) => {
//     try {
//       const response = await fetch(`http://localhost:5001/api/clients/${updatedClient.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedClient),
//       });
//       if (!response.ok) throw new Error("Failed to update client");

//       setClients((prevClients) =>
//         prevClients.map((client) => (client.id === updatedClient.id ? { ...client, ...updatedClient } : client))
//       );
//       setViewMode("table");
//       setSelectedClient(null);
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   // Cancel Edit/View Mode
//   const handleCancel = () => {
//     setViewMode("table");
//     setSelectedClient(null);
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       {viewMode === "table" && (
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {clients.map((client) => (
//               <tr key={client.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{client.contact_person}</div>
//                   <div className="text-sm text-gray-500">{client.contact_email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {client.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => client.id && onViewExecutives(client.id.toString())}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <Users className="w-5 h-5" />
//                     </button>
//                     <button onClick={() => handleView(client)} className="text-gray-600 hover:text-gray-900">
//                       <Eye className="w-5 h-5" />
//                     </button>
//                     <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900">
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => client.id && handleDelete(client.id.toString())}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {(viewMode === "edit" || viewMode === "view") && selectedClient && (
//         <ClientForm
//           initialData={selectedClient}
//           onSubmit={viewMode === "edit" ? handleSubmit : () => {}}
//           onCancel={handleCancel}
//           refreshClients={fetchClients}
//           readOnly={viewMode === "view"} 
//         />
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { Edit2, Trash2, Users, Eye } from 'lucide-react';
// import type { Client } from '../types';
// import { ClientForm } from './ClientForm';

// interface ClientTableProps {
//   onViewExecutives: (clientId: string) => void;
// }

// export function ClientTable({ onViewExecutives }: ClientTableProps) {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [viewMode, setViewMode] = useState<'table' | 'edit' | 'view'>('table');

//   // Fetch Clients
//   const fetchClients = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/clients');
//       if (!response.ok) throw new Error('Failed to fetch clients');
//       const data = await response.json();
//       setClients(data);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   // Delete Client
//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`http://localhost:5001/api/clients/${id}`, { method: 'DELETE' });
//       setClients(prevClients => prevClients.filter(client => client.id?.toString() !== id));
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   // Edit Client
//   const handleEdit = (client: Client) => {
//     setSelectedClient(client);
//     setViewMode('edit');
//   };

//   // View Client Details
//   const handleView = (client: Client) => {
//     setSelectedClient(client);
//     setViewMode('view');
//   };

//   // Submit Updated Client Data
//   const handleSubmit = async (updatedClient: Partial<Client>) => {
//     try {
//       const response = await fetch(`http://localhost:5001/api/clients/${updatedClient.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedClient),
//       });
//       if (!response.ok) throw new Error('Failed to update client');

//       setClients(prevClients => prevClients.map(client => client.id === updatedClient.id ? { ...client, ...updatedClient } : client));
//       setViewMode('table');
//       setSelectedClient(null);
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   // Cancel Edit/View Mode
//   const handleCancel = () => {
//     setViewMode('table');
//     setSelectedClient(null);
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       {viewMode === 'table' && (
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {clients.map((client) => (
//               <tr key={client.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{client.contact_person}</div>
//                   <div className="text-sm text-gray-500">{client.contact_email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                     {client.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => client.id && onViewExecutives(client.id.toString())}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <Users className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleView(client)}
//                       className="text-gray-600 hover:text-gray-900"
//                     >
//                       <Eye className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleEdit(client)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => client.id && handleDelete(client.id.toString())}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {(viewMode === 'edit' || viewMode === 'view') && selectedClient && (
//         <ClientForm
//           initialData={selectedClient}
//           onSubmit={viewMode === 'edit' ? handleSubmit : () => {}}
//           onCancel={handleCancel}
//           refreshClients={fetchClients}
//         />
//       )}
//     </div>
//   );
// }

// import React from 'react';
// import { useState, useEffect } from 'react';
// import { Edit2, Trash2, Users } from 'lucide-react';
// import type { Client } from '../types';

// interface ClientTableProps {
//   clients: Client[];
//   onEdit: (client: Client) => void;
//   onDelete: (id: string) => void;
//   onViewExecutives: (clientId: string) => void;
// }

// export function ClientTable({  onViewExecutives }: ClientTableProps) {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);


//   const fetchClients = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/clients');
//       if (!response.ok) throw new Error('Failed to fetch clients');
//       const data = await response.json();
//       setClients(data);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`http://localhost:5001/api/clients/${id}`, { method: 'DELETE' });
//       setClients(prevClients => prevClients.filter(client => client.id?.toString() !== id));
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };
//   const handleEdit = async (updatedClient: Client) => {
//     try {
//       const response = await fetch(`http://localhost:5001/api/clients/${updatedClient.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedClient),
//       });
//       if (!response.ok) throw new Error('Failed to update client');
//       setClients(prevClients => prevClients.map(client => client.id === updatedClient.id ? updatedClient : client));
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {clients.map((client) => (
//             <tr key={client.id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">{client.contact_person}</div>
//                 <div className="text-sm text-gray-500">{client.contact_email}</div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                   {client.status}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => client.id && onViewExecutives(client.id.toString())}
//                     className="text-blue-600 hover:text-blue-900"
//                   >
//                     <Users className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleEdit(client)}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     <Edit2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => client.id && handleDelete(client.id.toString())}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }