'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages(searchTerm, filterStatus);
  }, [messages, searchTerm, filterStatus]);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = (search, status) => {
    let filtered = messages;
    
    if (search) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(search.toLowerCase()) ||
        message.email.toLowerCase().includes(search.toLowerCase()) ||
        message.subject.toLowerCase().includes(search.toLowerCase()) ||
        message.message.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(message => 
        status === 'read' ? message.isRead : !message.isRead
      );
    }
    
    setFilteredMessages(filtered);
  };

  const handleDeleteMessage = async () => {
    try {
      await api.delete(`/messages/${selectedMessage._id}`);
      setMessages(messages.filter(msg => msg._id !== selectedMessage._id));
      setShowDeleteModal(false);
      setSelectedMessage(null);
      toast.success('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await api.put(`/messages/${id}/read`);
      setMessages(messages.map(msg => 
        msg._id === id ? response.data.data : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const openDetailsModal = (message) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  const openDeleteModal = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter(message => !message.isRead).length;

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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Contact messages from your website visitors
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div 
                  key={message._id}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    !message.isRead ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.name}
                        </h3>
                        {!message.isRead && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1 mb-2 sm:mb-0">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span>{message.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2 sm:mb-0">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{message.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                      <p className="text-gray-600 line-clamp-2">{message.message}</p>
                    </div>
                    
                    <div className="flex space-x-2 ml-0 sm:ml-4">
                      <button
                        onClick={() => openDetailsModal(message)}
                        className="flex-1 sm:flex-none bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(message)}
                        className="flex-1 sm:flex-none bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Modal */}
        {showDetailsModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Sender Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-black">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-black">{selectedMessage.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-black">{selectedMessage.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-black">{formatDate(selectedMessage.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Subject</h3>
                    <p className="text-gray-700 text-black">{selectedMessage.subject}</p>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 whitespace-pre-wrap text-black">{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-center font-medium"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Delete Message</h2>
                    <p className="text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete this message from <strong>{selectedMessage.name}</strong>?
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
                    onClick={handleDeleteMessage}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Message
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