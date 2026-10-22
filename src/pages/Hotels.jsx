import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import HotelCard from "../components/HotelCard";
import API_BASE_URL from "../api";

import "./Hotels.css";

const fallbackHotels = [
  {
    id: "1",
    _id: "1",
    name: "The Grand Heritage",
    location: "Pune, Maharashtra",
    price: 3200,
    rating: 4.8,
    description:
      "A premium hotel offering comfortable rooms and modern amenities.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    _id: "2",
    name: "Coastal Breeze Resort",
    location: "Goa, India",
    price: 4500,
    rating: 4.7,
    description:
      "Relax by the coast with beautiful rooms and a peaceful atmosphere.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    _id: "3",
    name: "Urban Nest Hotel",
    location: "Mumbai, Maharashtra",
    price: 2800,
    rating: 4.5,
    description:
      "A modern city hotel ideal for business and leisure travellers.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    _id: "4",
    name: "Royal Palace",
    location: "Delhi, India",
    price: 3800,
    rating: 4.6,
    description:
      "Experience elegant rooms, excellent service and a comfortable stay.",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    _id: "5",
    name: "Lakeview Retreat",
    location: "Udaipur, Rajasthan",
    price: 5200,
    rating: 4.9,
    description:
      "A peaceful luxury retreat offering beautiful lake views.",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    _id: "6",
    name: "Green Valley Resort",
    location: "Lonavala, Maharashtra",
    price: 3600,
    rating: 4.4,
    description:
      "A refreshing resort surrounded by greenery and natural beauty.",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80",
  },
];

function Hotels() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || searchParams.get("location") || "All";
  const initialQuery = searchParams.get("search") || "";

  const [hotels, setHotels] = useState(fallbackHotels);
  const [search, setSearch] = useState(initialQuery);
  const [location, setLocation] = useState(initialCity);
  const [maxPrice, setMaxPrice] = useState("All");
  const [minRating, setMinRating] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hotels`);
        if (!response.ok) {
          throw new Error("Failed to load hotels from server");
        }
        const data = await response.json();
        if (data.hotels && data.hotels.length > 0) {
          setHotels(data.hotels);
        }
      } catch (err) {
        console.warn("Using fallback hotel list:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels
    .filter((hotel) => {
      const searchText = search.toLowerCase();
      return (
        hotel.name.toLowerCase().includes(searchText) ||
        hotel.location.toLowerCase().includes(searchText)
      );
    })
    .filter((hotel) => {
      if (location === "All") {
        return true;
      }
      return hotel.location.toLowerCase().includes(location.toLowerCase());
    })
    .filter((hotel) => {
      if (maxPrice === "All") {
        return true;
      }
      return hotel.price <= Number(maxPrice);
    })
    .filter((hotel) => {
      if (minRating === "All") {
        return true;
      }
      return hotel.rating >= Number(minRating);
    });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <main className="hotels-page">
      <section className="hotels-heading">
        <p className="hotels-label">EXPLORE STAYEASE</p>

        <h1>Find Your Perfect Stay</h1>

        <p>
          Discover comfortable hotels and resorts for your next journey.
        </p>
      </section>

      <section className="hotel-filters">
        <div className="filter-group search-group">
          <label>Search</label>

          <input
            type="text"
            placeholder="Search hotel or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Location</label>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Goa">Goa</option>
            <option value="Delhi">Delhi</option>
            <option value="Udaipur">Udaipur</option>
            <option value="Lonavala">Lonavala</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Maximum Price</label>

          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            <option value="All">Any Price</option>
            <option value="3000">Up to ₹3,000</option>
            <option value="4000">Up to ₹4,000</option>
            <option value="5000">Up to ₹5,000</option>
            <option value="6000">Up to ₹6,000</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="All">Any Rating</option>
            <option value="4">4+ Rating</option>
            <option value="4.5">4.5+ Rating</option>
            <option value="4.8">4.8+ Rating</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </section>

      <div className="hotel-results-header">
        <p>
          <strong>{sortedHotels.length}</strong> hotels found
          {isLoading && " (updating from database...)"}
        </p>
      </div>

      {sortedHotels.length > 0 ? (
        <section className="hotel-grid">
          {sortedHotels.map((hotel) => (
            <HotelCard
              key={hotel._id || hotel.id}
              hotel={hotel}
            />
          ))}
        </section>
      ) : (
        <div className="no-hotels">
          <h2>No hotels found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </main>
  );
}

export default Hotels;