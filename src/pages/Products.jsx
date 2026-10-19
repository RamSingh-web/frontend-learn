
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'myAdminProducts';

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 1200,
    stock: 45,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 4500,
    stock: 20,
  },
  {
    id: 3,
    name: 'Gaming Monitor',
    category: 'Electronics',
    price: 24999,
    stock: 8,
  },
  {
    id: 4,
    name: 'USB-C Hub',
    category: 'Electronics',
    price: 2100,
    stock: 0,
  },
  {
    id: 5,
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 1500,
    stock: 12,
  },
];

function getSavedProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return initialProducts;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
}

export default function Products() {
  const [products, setProducts] = useState(getSavedProducts);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [error, setError] = useState('');

  // Save products to LocalStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      setError('Unable to save products in browser storage.');
    }
  }, [products]);

  // Summary cards.
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  const outOfStock = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  // Add or update product.
  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!trimmedName) {
      setError('Please enter a product name.');
      return;
    }

    if (
      price.trim() === '' ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setError('Please enter a valid price of 0 or more.');
      return;
    }

    if (
      stock.trim() === '' ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setError('Stock must be a whole number of 0 or more.');
      return;
    }

    const duplicate = products.some(
      (product) =>
        product.name.trim().toLowerCase() ===
          trimmedName.toLowerCase() &&
        product.id !== editingId
    );

    if (duplicate) {
      setError('A product with this name already exists.');
      return;
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: trimmedName,
                category,
                price: numericPrice,
                stock: numericStock,
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: trimmedName,
        category,
        price: numericPrice,
        stock: numericStock,
      };

      setProducts((current) => [...current, newProduct]);
    }

    resetForm();
  }

  // Open form with the selected product's details.
  function handleEdit(product) {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setError('');
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delete product with confirmation.
  function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );

    if (editingId === product.id) {
      resetForm();
    }
  }

  function resetForm() {
    setName('');
    setCategory('Electronics');
    setPrice('');
    setStock('');
    setEditingId(null);
    setError('');
    setShowForm(false);
  }

  // Search and category filtering.
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === 'All' ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      {/* Page heading */}
      <div className="products-page-header">
        <div>
          <h1 className="dashboard-title">Products</h1>
          <p className="welcome-msg">
            Manage your products, prices and inventory.
          </p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingId(null);
              setName('');
              setCategory('Electronics');
              setPrice('');
              setStock('');
              setError('');
              setShowForm(true);
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Summary cards */}
      <section className="product-stats-grid">
        <div className="product-stat-card">
          <p>Total Products</p>
          <h2>{totalProducts}</h2>
        </div>

        <div className="product-stat-card">
          <p>Total Stock Units</p>
          <h2>{totalStock}</h2>
        </div>

        <div className="product-stat-card">
          <p>Out of Stock</p>
          <h2>{outOfStock}</h2>
        </div>
      </section>

      {/* Add/Edit product form */}
      {showForm && (
        <section className="product-form-card">
          <h2>
            {editingId !== null ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="product-form-group">
              <label htmlFor="product-name">Product Name</label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="product-form-group">
              <label htmlFor="product-category">Category</label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="product-form-group">
              <label htmlFor="product-price">Price (₹)</label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="product-form-group">
              <label htmlFor="product-stock">Stock Quantity</label>
              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="product-form-error" role="alert">
                {error}
              </p>
            )}

            <div className="product-form-actions">
              <button type="submit" className="save-product-button">
                {editingId !== null ? 'Update Product' : 'Save Product'}
              </button>

              <button
                type="button"
                className="cancel-product-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Product table */}
      <section className="product-table-card">
        <div className="product-table-header">
          <h2>All Products ({filteredProducts.length})</h2>

          <div className="product-table-filters">
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>

            <button
              type="button"
              className="clear-product-filters"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="product-table-wrapper">
          <table className="data-table products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      ₹
                      {Number(product.price).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{product.stock}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          Number(product.stock) > 0
                            ? 'completed'
                            : 'cancelled'
                        }`}
                      >
                        {Number(product.stock) > 0
                          ? 'Active'
                          : 'Out of Stock'}
                      </span>
                    </td>

                    <td>
                      <div className="product-row-actions">
                        <button
                          type="button"
                          className="edit-product-button"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-product-button"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="product-empty-state">
                    No products found. Try another search or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
