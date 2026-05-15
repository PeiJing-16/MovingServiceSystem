import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const initialForm = {
  itemName: '',
  category: '',
  isActive: true,
};

const AdminInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchInventoryItems = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get('/api/inventory/admin/all');
      setItems(response.data);
    } catch (error) {
      alert('Failed to load inventory items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchInventoryItems();
    }
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6 text-center">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 max-w-lg">
          <h1 className="text-2xl font-semibold text-[#0d2440] mb-4">
            Admin Only
          </h1>

          <p className="text-[#546b86] mb-6">
            This page is restricted to admin accounts. Please log in with admin credentials.
          </p>

          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-full bg-[#142C3E] text-white font-semibold hover:bg-[#0f1b2c]"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.itemName.trim()) {
      alert('Item name is required.');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await axiosInstance.put(`/api/inventory/${editingId}`, form);
        alert('Inventory item updated successfully.');
      } else {
        await axiosInstance.post('/api/inventory', form);
        alert('Inventory item added successfully.');
      }

      resetForm();
      fetchInventoryItems();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to save inventory item.';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName,
      category: item.category || '',
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/inventory/${id}`);
      alert('Inventory item deleted successfully.');
      fetchInventoryItems();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete inventory item.';
      alert(message);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await axiosInstance.put(`/api/inventory/${item._id}`, {
        itemName: item.itemName,
        category: item.category,
        isActive: !item.isActive,
      });

      fetchInventoryItems();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update inventory item status.';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-[#c8e1fb] p-8">
          <h1 className="text-4xl font-semibold text-center text-[#0d2440] mb-8">
            Manage Inventory Checklist
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={form.itemName}
              onChange={handleChange}
              className="rounded-2xl bg-[#C1D8F0] py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category, e.g. Furniture"
              value={form.category}
              onChange={handleChange}
              className="rounded-2xl bg-[#C1D8F0] py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
            />

            <label className="flex items-center gap-2 text-[#0d2440]">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-full bg-[#142C3E] text-white font-semibold hover:bg-[#0f1b2c]"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full bg-[#C1D8F0] text-[#0d2440] font-semibold hover:bg-[#93A9C0]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
          {loading ? (
            <p className="text-center p-8 text-black">Loading inventory items...</p>
          ) : items.length === 0 ? (
            <p className="text-center p-8 text-black">No inventory items found.</p>
          ) : (
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#142C3E] text-white">
                  <th className="px-4 py-3 rounded-tl-2xl">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="bg-white">
                    <td className="px-4 py-3 border border-[#93A9C0] font-semibold text-black">
                      {item.itemName}
                    </td>

                    <td className="px-4 py-3 border border-[#93A9C0]">
                      {item.category || 'General'}
                    </td>

                    <td className="px-4 py-3 border border-[#93A9C0]">
                      {item.isActive ? 'Active' : 'Inactive'}
                    </td>

                    <td className="px-4 py-3 border border-[#93A9C0]">
                      <div className="flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="hover:text-[#2563eb]"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="hover:text-[#864C69]"
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          type="button"
                          className="hover:text-[#dc2626]"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;