import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { useCart } from '../../features/cart/hook/useCart'

const Navbar = () => {
    const user = useSelector(state => state.auth.user)
    const { items } = useCart()
    const location = useLocation()
    
    // Check if we are on the home page
    const isHome = location.pathname === '/'

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 px-8 md:px-14 py-7 flex justify-between items-center transition-all duration-500 ${isHome ? 'bg-transparent' : 'bg-brand-cream/80 backdrop-blur-md border-b border-black/5'}`}>
            <Link to="/" className={`text-[22px] font-serif tracking-tighter transition-colors duration-500 ${isHome ? 'text-white mix-blend-difference' : 'text-brand-black'}`}>
                SNITCH
            </Link>

            <div className="flex items-center gap-8">
                <Link to="/products" className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${isHome ? 'text-white mix-blend-difference' : 'text-brand-black'} hover:opacity-60`}>
                    Shop
                </Link>

                {user ? (
                    <span className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${isHome ? 'text-white mix-blend-difference' : 'text-brand-black'}`}>
                        {user.username || user.name || 'Account'}
                    </span>
                ) : (
                    <div className="flex items-center gap-7">
                        <Link to="/login" className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${isHome ? 'text-white mix-blend-difference' : 'text-brand-black'} hover:opacity-60`}>
                            Login
                        </Link>
                    </div>
                )}

                <Link to="/cart" className="relative group">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`transition-colors duration-500 ${isHome ? 'text-white mix-blend-difference' : 'text-brand-black'}`}
                    >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <path d="M3 6h18"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    {items.length > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute -top-2 -right-2 text-[9px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold shadow-md ${isHome ? 'bg-white text-brand-black' : 'bg-brand-black text-white'}`}
                        >
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </motion.span>
                    )}
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
