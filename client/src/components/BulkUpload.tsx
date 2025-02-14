import React from 'react';
import { Upload, FileText, AlertCircle, Check, X, Download, FileUp, Clipboard, Table } from 'lucide-react';
import type { Client } from '../types';

interface BulkUploadProps {
  onUpload: (clients: Partial<Client>[]) => Promise<void>;
  onCancel: () => void;
}

export function BulkUpload({ onUpload, onCancel }: BulkUploadProps) {
  const [csvContent, setCsvContent] = React.useState('');
  const [previewData, setPreviewData] = React.useState<Partial<Client>[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (content: string) => {
    setCsvContent(content)
    try {
      if (!content.trim()) {
        setPreviewData([])
        setError(null)
        return
      }

      const lines = content.split("\n").filter((line) => line.trim())
      const headers = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim())
      const requiredHeaders = ["client_name", "contact_person", "contact_email", "contact_phone", "industry", "location"]

      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      const clients = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const client: Partial<Client> = {
          client_name: values[headers.indexOf("client_name")],
          contact_person: values[headers.indexOf("contact_person")],
          contact_email: values[headers.indexOf("contact_email")],
          contact_phone: values[headers.indexOf("contact_phone")],
          industry: values[headers.indexOf("industry")],
          location: values[headers.indexOf("location")],
          status: values[headers.indexOf("status")] as "active" | "inactive",
          compliance_settings: {}, // Initialize with empty object
        }
        return client
      })

      setPreviewData(clients)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid CSV format")
      setPreviewData([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previewData.length === 0 || error) return;

    try {
      const response = await fetch("http://localhost:5001/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(previewData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload clients");
      }

      await response.json();
      onUpload(previewData);
      setCsvContent('');
      setPreviewData([]);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during upload");
    }
  };

  const downloadTemplate = () => {
    const template = 'company,name,email,phone,status\nAcme Inc,John Doe,john@acme.com,+1-555-1234,active';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client-upload-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const text = await file.text();
      handleContentChange(text);
    } else {
      setError('Please drop a valid CSV file');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleContentChange(text);
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      handleContentChange(text);
    }
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="flex items-center text-lg font-semibold text-blue-900 mb-4">
          <FileText className="w-5 h-5 mr-2" />
          Instructions
        </h3>
        <div className="space-y-4">
          <p className="text-blue-800">
            Upload multiple clients at once using a CSV file or by pasting CSV content directly.
          </p>
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Required Columns:</h4>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>company - Company name</li>
              <li>name - Contact person's name</li>
              <li>email - Contact email</li>
              <li>phone - Contact phone number</li>
              <li>status - Client status (active/inactive)</li>
            </ul>
          </div>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* CSV Input */}
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Import CSV Data
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePaste}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Clipboard className="w-4 h-4 mr-1.5" />
                Paste
              </button>
              <label className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <FileUp className="w-4 h-4 mr-1.5" />
                Browse
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
              }`}
          >
            <textarea
              ref={textAreaRef}
              rows={8}
              value={csvContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Drag and drop a CSV file here, or paste your CSV content"
              className={`block w-full rounded-lg bg-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm ${isDragging ? 'placeholder:text-indigo-500' : ''
                }`}
            />
            {!csvContent && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Table className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drop your CSV file here or paste content directly
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Preview */}
        {previewData.length > 0 && !error && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                Preview ({previewData.length} clients)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(0, 5).map((client, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.client_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.contact_person}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.contact_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.contact_phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                  Showing 5 of {previewData.length} clients
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!previewData.length || !!error}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg ${!previewData.length || !!error
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {previewData.length && !error ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Upload {previewData.length} Clients
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Clients
            </>
          )}
        </button>
      </div>
    </div>
  );
}