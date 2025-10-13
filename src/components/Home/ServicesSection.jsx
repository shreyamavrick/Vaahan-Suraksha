import { useEffect, useState, useRef } from "react";

const ServicesSection = () => {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

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

  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const speed = 1;
    const maxScroll = scrollContainer.scrollWidth / 2;

    const animate = () => {
      scrollAmount += speed;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0; 
      }
      scrollContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [products]);

  return (
    <section className="py-12 px-4 sm:px-8">
      
      <div className="mb-10">
        <p className="text-[#1DA1F2] uppercase font-semibold tracking-wider pb-2">
          / Custom Services /
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight pb-4">
          Your Vehicle Deserves
          <br />
          <span className="text-[#1DA1F2]">Custom </span> Components
        </h2>
      </div>

     
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto whitespace-nowrap py-4 scrollbar-hide"
      >
       
        {[...products, ...products].map((product, idx) => (
          <a
            key={idx}
            href={`/services/${product.name}`}
            className="inline-block flex-shrink-0 w-40 h-36 rounded-2xl hover:shadow-md bg-white p-4 text-center transition-transform duration-300"
          >
            {product.images?.length > 0 ? (
              <img
                src={
                  typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].url
                }
                alt={product.name}
                className="w-full h-[100px] object-contain mx-auto mb-2"
              />
            ) : (
              <div className="w-full h-[100px] bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
            <h3 className="font-bold text-base text-center">{product.name}</h3>
          </a>
        ))}
      </div>

    
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </section>
  );
};

export default ServicesSection;
