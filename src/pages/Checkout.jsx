import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Checkout = () => {
  const { cartItems, subtotal } = useCart();
  const navigate = useNavigate();

  const SHIPPING = 50;
  const total = subtotal + SHIPPING;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    landmark: "",
    state: "",
    pincode: "",
    paymentMethod: "",
    date: null,
    timeSlot: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date) => {
    setForm((f) => ({ ...f, date }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.street.trim()) errs.street = "Street address is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    if (!form.paymentMethod) errs.paymentMethod = "Select a payment method";
    if (!form.date) errs.date = "Please select a booking date";
    if (!form.timeSlot) errs.timeSlot = "Please select a time slot";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    alert("Proceeding to payment...");
  };

  const timeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={`pl-10 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Street Address</label>
                <div className="flex">
                  <input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    className={`flex-1 border p-3 rounded-l-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg"
                  >
                    <MapPin className="mr-1 inline" /> Detect
                  </button>
                </div>
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Landmark</label>
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    className="border p-3 rounded-lg border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`border p-3 rounded-lg w-full ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={`border p-3 rounded-lg w-full ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Booking Date & Time</h2>

            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">Choose Date</label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                minDate={new Date()}
                placeholderText="Select booking date"
                className={`w-full border p-3 rounded-lg ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Select Time Slot</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`border p-2 rounded text-sm text-center cursor-pointer ${
                      form.timeSlot === slot ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={form.timeSlot === slot}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {slot}
                  </label>
                ))}
              </div>
              {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>}
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
            <div className="space-y-3">
              {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                  />
                  {method}
                </label>
              ))}
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>
          </section>
        </form>

        <div className="bg-white p-6 rounded-xl shadow-md sticky top-8 h-fit">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          {cartItems.map(({ service, qty }) => (
            <div key={service.id} className="flex items-center gap-4 border-b pb-4 mb-4">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{service.name}</p>
                <p className="text-gray-500 text-sm">Qty: {qty}</p>
              </div>
              <p className="font-semibold">₹{(service.newPrice * qty).toFixed(2)}</p>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>₹{SHIPPING.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            💳 Proceed to Payment
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="mt-3 w-full border py-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
