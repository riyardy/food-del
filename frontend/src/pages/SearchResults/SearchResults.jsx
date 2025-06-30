import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './SearchResults.css';

const SearchResults = () => {
  const { food_list, url } = useContext(StoreContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query')?.toLowerCase() || '';

    let results = food_list.filter(item =>
      item.name.toLowerCase().includes(query)
    );

    // Category filter
    if (categoryFilter !== "all") {
      results = results.filter(item => item.category?.toLowerCase() === categoryFilter);
    }

    // Price filter
    if (priceFilter === "below100") {
      results = results.filter(item => item.price < 100);
    } else if (priceFilter === "100to300") {
      results = results.filter(item => item.price >= 100 && item.price <= 300);
    } else if (priceFilter === "above300") {
      results = results.filter(item => item.price > 300);
    }

    // Sort order
    if (sortOrder === "lowToHigh") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(results);
  }, [location.search, food_list, categoryFilter, priceFilter, sortOrder]);

  return (
    <div className="search-results-page">
      <h2>Search Results</h2>

      <div className="filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="pizza">Pizza</option>
          <option value="burger">Burger</option>
          <option value="drinks">Drinks</option>
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="below100">Below ₹100</option>
          <option value="100to300">₹100 - ₹300</option>
          <option value="above300">Above ₹300</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p>No food items found.</p>
      ) : (
        <div className="results-grid">
          {filteredItems.map(item => (
            <div key={item._id} className="search-item-card">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
