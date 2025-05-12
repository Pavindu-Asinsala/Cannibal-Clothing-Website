import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileUpdatePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    _id?: string;
    name: string;
    email: string;
    profileImage: string;
    role: string;
  }>({
    name: '',
    email: '',
    profileImage: '',
    role: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/viewprofile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          setMessage('Error fetching profile data');
        }
      } catch (error) {
        setMessage('Error fetching profile data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  interface User {
    _id?: string;
    name: string;
    email: string;
    profileImage: string;
    role: string;
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ data: User }>(`http://localhost:5000/api/users/edit/${user._id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Error updating profile.');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Your Profile</h1>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Profile Image URL</label>
            <input
              type="text"
              value={user.profileImage}
              onChange={(e) => setUser({ ...user, profileImage: e.target.value })}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
            />
            {user.profileImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            {user.role && (
              <>
                <label className="block text-sm font-medium">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>

        {message && <p className="mt-6 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
