import React from 'react';
import { Plus, X, Building2, MapPin, User, Mail, Phone, Shield } from 'lucide-react';
import type { Client, ComplianceSettings } from '../types';

interface ClientForm {
  onSubmit: (data: Partial<Client>) => void;
  initialData?: Client;
  onCancel: () => void;
  refreshClients: () => void;
}

interface ComplianceField {
  key: string;
  type: 'boolean' | 'number' | 'text';
  value: boolean | number | string;
}

export function ClientForm({ initialData, onCancel, refreshClients }: ClientForm) {
  const [formData, setFormData] = React.useState<Partial<Client>>(
    initialData || {
      client_name: '',
      industry: '',
      location: '',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      compliance_settings: {}
    }
  );

  const [complianceFields, setComplianceFields] = React.useState<ComplianceField[]>(() => {
    const settings = initialData?.compliance_settings || {};
    return Object.entries(settings).map(([key, value]) => ({
      key,
      type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
      value
    }));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const compliance_settings: ComplianceSettings = {};
    complianceFields.forEach(field => {
      compliance_settings[field.key] = field.value;
    });
    const clientData = { ...formData, compliance_settings };

    try {
      const response = await fetch(
        initialData
          ? `http://localhost:5001/api/clients/${initialData.id}`
          : "http://localhost:5001/api/clients",
        {
          method: initialData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) throw new Error("Failed to save client data");

      await response.json();
      refreshClients();
      onCancel();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const addComplianceField = () => {
    setComplianceFields([
      ...complianceFields,
      { key: '', type: 'boolean', value: false }
    ]);
  };

  const removeComplianceField = (index: number) => {
    setComplianceFields(fields => fields.filter((_, i) => i !== index));
  };

  const updateComplianceField = (index: number, updates: Partial<ComplianceField>) => {
    setComplianceFields(fields =>
      fields.map((field, i) =>
        i === index
          ? {
            ...field, ...updates, value: updates.type
              ? (updates.type === 'boolean' ? false : updates.type === 'number' ? 0 : '')
              : field.value
          }
          : field
      )
    );
  };

  const loadExampleData = () => {
    setFormData({
      client_name: 'TechCorp Inc.',
      industry: 'Technology',
      location: 'San Francisco, CA',
      contact_person: 'John Doe',
      contact_email: 'john.doe@techcorp.com',
      contact_phone: '+1-555-1234'
    });
    setComplianceFields([
      { key: 'background_check', type: 'boolean', value: true },
      { key: 'drug_test', type: 'boolean', value: false },
      { key: 'minimum_experience_years', type: 'number', value: 2 }
    ]);
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-900";
  const iconClasses = "w-5 h-5 text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Client Details' : 'New Client'}
        </h2>
        <button
          type="button"
          onClick={loadExampleData}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          Load Example Data
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label htmlFor="client_name" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <Building2 className={iconClasses} />
                <span>Client Name</span>
              </div>
            </label>
            <input
              id="client_name"
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className={inputClasses}
              placeholder="e.g., TechCorp Inc."
            />
          </div>

          <div>
            <label htmlFor="industry" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <Building2 className={iconClasses} />
                <span>Industry</span>
              </div>
            </label>
            <input
              id="industry"
              type="text"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className={inputClasses}
              placeholder="e.g., Technology"
            />
          </div>

          <div>
            <label htmlFor="location" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <MapPin className={iconClasses} />
                <span>Location</span>
              </div>
            </label>
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClasses}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="contact_person" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <User className={iconClasses} />
                <span>Contact Person</span>
              </div>
            </label>
            <input
              id="contact_person"
              type="text"
              required
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className={inputClasses}
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label htmlFor="contact_email" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <Mail className={iconClasses} />
                <span>Contact Email</span>
              </div>
            </label>
            <input
              id="contact_email"
              type="email"
              required
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className={inputClasses}
              placeholder="e.g., john.doe@techcorp.com"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className={labelClasses}>
              <div className="flex items-center space-x-2">
                <Phone className={iconClasses} />
                <span>Contact Phone</span>
              </div>
            </label>
            <input
              id="contact_phone"
              type="tel"
              required
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className={inputClasses}
              placeholder="e.g., +1-555-1234"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Compliance Settings</h3>
          </div>
          <button
            type="button"
            onClick={addComplianceField}
            className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Requirement
          </button>
        </div>

        <div className="space-y-4">
          {complianceFields.map((field, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors duration-200"
            >
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateComplianceField(index, { key: e.target.value })}
                  placeholder="Requirement name"
                  className={inputClasses}
                />
                <div className="flex items-center space-x-4">
                  <select
                    value={field.type}
                    onChange={(e) => updateComplianceField(index, { type: e.target.value as 'boolean' | 'number' | 'text' })}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                  >
                    <option value="boolean">Yes/No</option>
                    <option value="number">Number</option>
                    <option value="text">Text</option>
                  </select>

                  {field.type === 'boolean' && (
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={(e) => updateComplianceField(index, { value: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={field.value as number}
                      onChange={(e) => updateComplianceField(index, { value: parseFloat(e.target.value) })}
                      className="block w-32 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                    />
                  )}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value as string}
                      onChange={(e) => updateComplianceField(index, { value: e.target.value })}
                      className={inputClasses}
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeComplianceField(index)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          {complianceFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No compliance requirements added yet.</p>
              <p className="text-sm">Click "Add Requirement" to get started.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          {initialData ? 'Update Client' : 'Create Client'}
        </button>
      </div>
    </form>
  );
}