import { useState } from "react";
import { useCart } from "../hooks/useCart";

const ProductCard = ({ item }) => {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const result = await addToCart(item._id, 1);
      if (result.success) {
        console.log("Item added to cart successfully");
      } else {
        console.error("Add to cart failed:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add item to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0";
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-3 text-sm">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-black">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
