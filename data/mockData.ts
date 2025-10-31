import { User, Client, UserRole } from '../types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Zaid Al-Husseini', role: UserRole.Owner, avatar: 'ZA' },
  { id: 'user-2', name: 'Fatima Al-Fahim', role: UserRole.Admin, avatar: 'FA' },
  { id: 'user-3', name: 'Liam Chen', role: UserRole.PropertyAdvisor, avatar: 'LC' },
  { id: 'user-4', name: 'Sophia Petrova', role: UserRole.PropertyAdvisor, avatar: 'SP' },
  { id: 'user-5', name: 'David Rodriguez', role: UserRole.PropertyAdvisor, avatar: 'DR' },
  { id: 'client-user-1', name: 'Arjun Gupta', role: UserRole.Client, avatar: 'AG' },
  { id: 'client-user-2', name: 'Elena Voronina', role: UserRole.Client, avatar: 'EV' },
];

export const mockClients: Client[] = [
  { id: 'client-1', name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phone: '+91 98765 43210', propertyAdvisorId: 'user-3' },
  { id: 'client-2', name: 'Chen Wei', email: 'chen.wei@email.com', phone: '+86 139 1234 5678', propertyAdvisorId: 'user-3' },
  { id: 'client-3', name: 'Isabella Rossi', email: 'isabella.rossi@email.com', phone: '+39 0123 456789', propertyAdvisorId: 'user-4' },
  { id: 'client-4', name: 'Oliver Smith', email: 'oliver.smith@email.com', phone: '+44 20 7946 0958', propertyAdvisorId: 'user-4' },
  { id: 'client-5', name: 'Mohammed Al-Jamil', email: 'mohammed.aljamil@email.com', phone: '+966 50 123 4567', propertyAdvisorId: 'user-5' },
  { id: 'client-6', name: 'Anastasia Ivanova', email: 'anastasia.i@email.com', phone: '+7 916 123-45-67', propertyAdvisorId: 'user-3' },
  { id: 'client-7', name: 'John Miller', email: 'john.miller@email.com', phone: '+1 212-555-0199', propertyAdvisorId: 'user-5' },
  { id: 'client-8', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 99887 76655', propertyAdvisorId: 'user-4' },
];