import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface AddressesSectionProps {
  uid: string;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

export function AddressesSection({ uid, addresses, setAddresses }: AddressesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  // Open add form
  const openAddForm = () => {
    setCurrentAddress(null);
    setForm({
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    });
    setShowForm(true);
  };

  // Open edit form with data
  const openEditForm = (addr: Address) => {
    setCurrentAddress(addr);
    setForm({
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
    });
    setShowForm(true);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!form.line1.trim()) return 'Address Line 1 is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.state.trim()) return 'State is required';
    if (!form.postalCode.trim()) return 'Postal code is required';
    if (!form.country.trim()) return 'Country is required';
    if (!form.phone.trim()) return 'Phone number is required';
    if (!/^[\d\s\-+()]+$/.test(form.phone)) return 'Invalid phone number';
    return null;
  };

  // Save new or edited address
  const saveAddress = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSaving(true);
    try {
      let updatedAddresses: Address[];
      if (currentAddress) {
        // Edit existing address
        updatedAddresses = addresses.map(addr =>
          addr.id === currentAddress.id ? { ...form, id: currentAddress.id } : addr
        );
      } else {
        // Add new address with unique ID (timestamp based)
        const newAddress: Address = { ...form, id: Date.now().toString() };
        updatedAddresses = [...addresses, newAddress];
      }

      // Update Firestore
      await updateDoc(doc(db, 'buyers', uid), {
        addresses: updatedAddresses,
      });

      // Update local state
      setAddresses(updatedAddresses);
      setShowForm(false);
      toast.success(`Address ${currentAddress ? 'updated' : 'added'} successfully.`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  // Delete address
  const deleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setSaving(true);
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      await updateDoc(doc(db, 'buyers', uid), {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Addresses" className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>

      {addresses.length === 0 ? (
        <p className="text-gray-600 italic">No saved addresses.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li key={addr.id} className="border rounded p-4 flex justify-between items-start">
              <div>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p>{addr.country}</p>
                <p>Phone: {addr.phone}</p>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => openEditForm(addr)}
                  className="text-sm text-blue-600 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button onClick={openAddForm} className="btn-primary mt-4">
        Add New Address
      </button>

      {/* Address Form Modal */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-form-title"
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="address-form-title" className="text-xl font-semibold mb-4">
              {currentAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAddress();
              }}
              className="space-y-3"
            >
              <input
                name="line1"
                placeholder="Address Line 1"
                value={form.line1}
                onChange={handleChange}
                required
                className="input w-full"
              />
              <input
                name="line2"
                placeholder="Address Line 2 (Optional)"
                value={form.line2}
                onChange={handleChange}
                className="input w-full"
              />
              <div className="flex space-x-3">
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="input flex-1"
                />
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="input flex-1"
                />
              </div>
              <div className="flex space-x-3">
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  className="input flex-1"
                />
                <input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="input flex-1"
                />
              </div>
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="input w-full"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
