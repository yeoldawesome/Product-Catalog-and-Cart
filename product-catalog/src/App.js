import React, { useState } from 'react';
import data from './data.json';

const App = () => {
  const [view, setView] = useState('browse');
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + change, 0)
    }));
  };

  const addToCart = (id, quantity) => {
    const item = data.find(item => item.id === id);
    if (item && quantity > 0) {
      setCart(prev => [...prev, { ...item, quantity }]);
      setQuantities((prev) => ({ ...prev, [id]: 0 })); // Reset quantity after adding to cart
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const viewCart = () => {
    setView('cart');
  };

  const proceedToCheckout = () => {
    setView('checkout');
  };

  const handleOrderConfirmation = (userInfo) => {
    setOrderDetails({ 
      user: userInfo,
      items: cart, 
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) });
    setView('confirmation');
    setCart([]); // Clear cart after order
  };

  const resetCart = () => {
    setCart([]);
    setView('browse');
    setSearchTerm('');
    setQuantities({});
  };

  const filteredItems = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {view === 'browse' && (
        <div>
          <h1 className="text-center mb-4">Product Catalog</h1>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="row">
            {filteredItems.map(item => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card">
                  <img src={item.image} className="product-image" alt={item.name} />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">${item.price.toFixed(2)}</p>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-secondary" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <span className="mx-2">{quantities[item.id] || 0}</span>
                      <button className="btn btn-secondary" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      <button className="btn btn-primary ms-2" onClick={() => addToCart(item.id, quantities[item.id])}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-success" onClick={viewCart}>View Cart</button>
        </div>
      )}

      {view === 'cart' && (
        <div>
          <h2>Your Cart</h2>
          <ul className="list-group mb-4">
            {cart.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h3>
          <button className="btn btn-secondary" onClick={() => setView('browse')}>Return to Shop</button>
          <button className="btn btn-primary" onClick={proceedToCheckout}>Checkout</button>
        </div>
      )}

      {view === 'checkout' && (
        <Checkout onConfirm={handleOrderConfirmation} setView={setView} />
      )}

      {view === 'confirmation' && (
        <Confirmation orderDetails={orderDetails} resetCart={resetCart} />
      )}
    </div>
  );
};

const Checkout = ({ onConfirm, setView }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    card: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>Checkout</h4>
      <div className="mb-3">
        <input className="form-control" name="fullName" placeholder="Full Name" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="email" type="email" placeholder="Email" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="card" placeholder="Credit Card" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="address" placeholder="Address" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="city" placeholder="City" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="state" placeholder="State" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input className="form-control" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
      </div>
      <button type="submit" className="btn btn-primary">Order</button>
      <button type="button" className="btn btn-secondary" onClick={() => setView('cart')}>Back</button>
    </form>
  );
};

const Confirmation = ({ orderDetails, resetCart }) => {
  const { user, items, total } = orderDetails;
  return (
    <div>
      <h2>Order Confirmation</h2>

      <h3>Thank You, {user.fullName}!</h3>
      <p>A confirmation email has been sent to <strong>{user.email}</strong>.</p>

      <h4>Shipping Address:</h4>
      <p>
        {user.address}<br />
        {user.city}, {user.state} {user.zip}
      </p>

      <h3>Items Purchased:</h3>
      <ul className="list-group mb-4">
        {items.map(item => (
          <li key={item.id} className="list-group-item">
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <h3>Total Amount: ${total.toFixed(2)}</h3>
      <button className="btn btn-success" onClick={resetCart}>Back to Shop</button>
    </div>
  );
};

export default App;
