'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [contactMethods, setContactMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    label: '',
    value: ''
  });

  useEffect(() => {
    fetchContactMethods();
  }, []);

  const fetchContactMethods = async () => {
    try {
      const response = await api.get('/contact');
      setContactMethods(response.data.data);
    } catch (error) {
      console.error('Error fetching contact methods:', error);
      toast.error('Failed to fetch contact methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/contact', formData);
      setContactMethods([...contactMethods, response.data.data]);
      setFormData({ type: '', label: '', value: '' });
      setShowAddModal(false);
      toast.success('Contact method added successfully!');
    } catch (error) {
      console.error('Error adding contact method:', error);
      toast.error(error.response?.data?.message || 'Failed to add contact method');
    }
  };

  const handleEditContact = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/contact/${selectedContact._id}`, formData);
      setContactMethods(contactMethods.map(contact => 
        contact._id === selectedContact._id ? response.data.data : contact
      ));
      setShowEditModal(false);
      setSelectedContact(null);
      setFormData({ type: '', label: '', value: '' });
      toast.success('Contact method updated successfully!');
    } catch (error) {
      console.error('Error updating contact method:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact method');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await api.delete(`/contact/${selectedContact._id}`);
      setContactMethods(contactMethods.filter(contact => contact._id !== selectedContact._id));
      setShowDeleteModal(false);
      setSelectedContact(null);
      toast.success('Contact method deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact method:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contact method');
    }
  };

  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (contact) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const getContactIcon = (type) => {
    const icons = {
      phone: PhoneIcon,
      whatsapp: ChatBubbleLeftRightIcon,
      email: EnvelopeIcon,
      address: MapPinIcon
    };
    return icons[type] || PhoneIcon;
  };

  const getContactColor = (type) => {
    const colors = {
      phone: 'bg-blue-500',
      whatsapp: 'bg-green-500',
      email: 'bg-red-500',
      address: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center" data-aos="fade-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Methods</h1>
            <p className="text-gray-600 mt-1">Manage your business contact information and methods</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Add Contact Method</span>
          </button>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((contact, index) => {
            const IconComponent = getContactIcon(contact.type);
            return (
              <div 
                key={contact._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Contact Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${getContactColor(contact.type)} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contact.label}</h3>
                        <p className="text-sm text-gray-500 capitalize">{contact.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Contact Value */}
                  <div className="mb-4">
                    <p className="text-gray-900 font-medium break-all">{contact.value}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Created: {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openDetailsModal(contact)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Details</span>
                    </button>
                    <button
                      onClick={() => openEditModal(contact)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(contact)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {contactMethods.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact methods found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first contact method.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl mx-auto"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Add Contact Method</span>
            </button>
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add New Contact Method</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="address">Address</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="e.g., Main Office Phone"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="Contact information"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
                    >
                      Add Contact Method
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Contact Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Contact Method</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      required
                    >
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="address">Address</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
                    >
                      Update Contact Method
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Contact Method Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${getContactColor(selectedContact.type)} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = getContactIcon(selectedContact.type);
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedContact.label}</h3>
                    <p className="text-gray-600 capitalize">{selectedContact.type}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Contact Information</p>
                      <p className="font-medium text-gray-900 break-all">{selectedContact.value}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Created Date</p>
                      <p className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-900">{new Date(selectedContact.updatedAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Delete Contact Method</h2>
                    <p className="text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete <strong>{selectedContact.label}</strong>? 
                    This will permanently remove this contact method from your system.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteContact}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Contact Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}