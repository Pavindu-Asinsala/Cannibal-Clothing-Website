import React from "react";

interface OrderFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ formData, setFormData, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <h1>{formData.id ? "Edit Order" : "Add Order"}</h1>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      {/* Add similar inputs for phone, address, etc. */}
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default OrderForm;
