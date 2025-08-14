import { useEffect, useState } from "react";

const ServicesSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://vaahan-suraksha-backend.vercel.app/api/v1/inventory/product/"
        );
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Products fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 px-4 sm:px-8">
      {/* Heading */}
      <div className="mb-10">
        <p className="text-[#1DA1F2] uppercase font-semibold tracking-wider pb-2">
          / Custom Services /
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight pb-4">
          Explore Our <span className="text-[#1DA1F2]">services</span> of car
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105 text-center"
          >
            {product.images?.length > 0 ? (
              <img
                src={
                  typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].url
                }
                alt={product.name}
                className="w-48 h-48 object-contain mx-auto"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
            <p className="mt-4 font-bold text-lg">{product.name}</p>
            {product?.brand?.name && (
              <p className="text-sm text-gray-500">{product.brand.name}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
