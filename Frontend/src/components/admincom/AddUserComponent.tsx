import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User, Key, Globe, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  name: string;
  email: string;
  role: string;
  username: string;
  password: string;
  confirmPassword: string;
  profileImage?: string;
}

const AddUserComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'Manager',
    username: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'username':
        if (!value.trim()) error = 'Username is required';
        else if (value.length < 3) error = 'Username must be at least 3 characters';
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Username can only contain letters, numbers, and underscores';
        break;
      case 'password':
        if (formData.role !== 'Staff') {
          if (!value) error = 'Password is required';
          else if (value.length < 5) error = 'Password must be at least 5 characters';
          else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) && !/\d/.test(value)) {
            error = 'Password must contain at least one number or symbol';
          }
        }
        break;
      case 'confirmPassword':
        if (formData.role !== 'Staff' && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'profileImage':
        if (value && !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i.test(value)) {
          error = 'Please enter a valid image URL (jpg, png, gif)';
        }
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'role', 'username'];

    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]?.toString().trim()) {
        setFieldErrors(prev => ({ ...prev, [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` }));
        isValid = false;
      }
    });

    if (formData.role === 'Admin' || formData.role === 'Manager') {
      if (!formData.password) {
        setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
        isValid = false;
      }
      if (!formData.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
        isValid = false;
      }
    }

    Object.keys(formData).forEach(field => {
      if (!validateField(field, formData[field as keyof FormData]?.toString() || '')) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized: No token found.');
        setLoading(false);
        return;
      }

      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        username: formData.username,
      };

      if (formData.role === 'Admin' || formData.role === 'Manager') {
        payload.password = formData.password;
      }

      if (formData.profileImage) {
        payload.profileImage = formData.profileImage;
      }

      const response = await fetch('http://localhost:5000/api/users/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error adding user');
      }

      toast.success('User added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        name: '',
        email: '',
        role: 'Manager',
        username: '',
        password: '',
        confirmPassword: '',
        profileImage: '',
      });

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error adding user. Please try again.');
      setError(error.message || 'Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <UserPlus className="h-7 w-7 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Add New User</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-white text-lg font-medium">User Information</h2>
            <p className="text-blue-100 text-sm">Enter the details of the new user</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setError('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="John Doe"
                  />
                </div>
                {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                    className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="john.doe@example.com"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={(e) => validateField('username', e.target.value)}
                    className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="johndoe"
                  />
                </div>
                {fieldErrors.username && <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(formData.role)}`}>
                    {formData.role}
                  </span>
                </div>
              </div>
            </div>

            {(formData.role === 'Admin' || formData.role === 'Manager') && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={(e) => validateField('password', e.target.value)}
                      className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
                  {!fieldErrors.password && formData.password && (
                    <p className="mt-1 text-xs text-gray-500">
                      Password strength: {formData.password.length >= 8 ? 'Strong' : formData.password.length >= 5 ? 'Medium' : 'Weak'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={(e) => validateField('confirmPassword', e.target.value)}
                      className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  onBlur={(e) => validateField('profileImage', e.target.value)}
                  className={`pl-10 w-full px-4 py-2.5 border ${fieldErrors.profileImage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              {fieldErrors.profileImage && <p className="mt-1 text-sm text-red-600">{fieldErrors.profileImage}</p>}
              
              {formData.profileImage && (
                <div className="mt-4 flex items-center">
                  <div className="rounded-full overflow-hidden border-4 border-white shadow-lg h-24 w-24">
                    <img
                      src={formData.profileImage}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Profile preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-1.5" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddUserComponent;