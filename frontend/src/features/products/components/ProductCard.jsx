import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [];
  const mainImage = images[currentImageIndex] || 'https://via.placeholder.com/600x800?text=No+Image';
  const hasMultipleImages = images.length > 1;

  return (
    <motion.div 
      className="group relative flex flex-col space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <Link to={`/product/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-3/4 overflow-hidden bg-brand-cream border border-black/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={mainImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>

          {/* Quick View Overlay (Subtle) */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Pagination Dots (if multiple images) */}
          {hasMultipleImages && isHovered && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-4 left-4 bg-brand-black text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Low Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-brand-cream/60 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-brand-black text-[12px] uppercase tracking-[0.2em] font-medium">Sold Out</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-1 px-1 mt-4">
          <div className="flex justify-between items-start">
            <h3 className="text-[13px] font-medium text-brand-black/80 uppercase tracking-wider truncate flex-1 pr-4">
              {product.title}
            </h3>
            <p className="text-[14px] font-semibold text-brand-black">
              {product.price.currency} {product.price.amount.toLocaleString()}
            </p>
          </div>
          <p className="text-[12px] text-brand-stone font-light italic truncate">
              {product.description}
          </p>
          
          {/* Hover Action (View Details) */}
          <motion.div 
            className="overflow-hidden pt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
          >
            <button className="w-full border border-brand-black py-2 text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-brand-black hover:text-white transition-colors duration-300">
              View Details
            </button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
