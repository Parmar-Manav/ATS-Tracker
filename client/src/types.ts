export interface ComplianceSettings {
  [key: string]: boolean | number | string;
}

export interface Client {
  id?: number;
  client_name: string;
  industry: string;
  location: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  compliance_settings: ComplianceSettings;
  createdAt: string;
  status: string;
}

export interface ClientExecutive {
  id: string;
  clientId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
}