import React, { useState } from "react";
import { useEffect } from "react";
import axios from "../../config/axiosConfig.js";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferences: {
      newsletter: false,
      taxReceipts: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "/api/donor/donorProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        const donor = response.data.donor;
        setProfile({
          name: donor.name,
          email: donor.email,
          phone: donor.phoneNumber,
          address: donor.address || "",
          preferences: {
            newsletter: donor.preferences?.newsletter || false,
            taxReceipts: donor.preferences?.taxReceipts || false,
          },
        });
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message
        );
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        name: profile.name,
        phoneNumber: profile.phone,
        password: profile.password,
      };
      const response = await axios.post(
        "/api/donor/edit-profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-900">Donor Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-800 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition-all shadow-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-green-800 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
            className="w-full rounded-lg border-2 border-green-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-green-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
            className="w-full rounded-lg border-2 border-green-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-green-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-800 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full rounded-lg border-2 border-green-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-green-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-800 mb-2">
            Address
          </label>
          <textarea
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            disabled={!isEditing}
            rows={3}
            className="w-full rounded-lg border-2 border-green-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-green-50"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-900">Preferences</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter"
              checked={profile.preferences.newsletter}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    newsletter: e.target.checked,
                  },
                })
              }
              disabled={!isEditing}
              className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 border-green-300 rounded"
            />
            <label htmlFor="newsletter" className="ml-3 text-sm text-green-800">
              Receive newsletter updates
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxReceipts"
              checked={profile.preferences.taxReceipts}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    taxReceipts: e.target.checked,
                  },
                })
              }
              disabled={!isEditing}
              className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 border-green-300 rounded"
            />
            <label
              htmlFor="taxReceipts"
              className="ml-3 text-sm text-green-800"
            >
              Receive tax receipts
            </label>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition-all shadow-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
