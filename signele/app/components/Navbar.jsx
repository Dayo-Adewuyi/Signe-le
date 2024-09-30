import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Folder, Menu, X } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { id: 'create', label: 'Create Document', icon: Plus, href: '/create' },
  { id: 'pending', label: 'Pending Signatures', icon: Clock, href: '/pending' },
  { id: 'all', label: 'All Documents', icon: Folder, href: '/all-documents' },
];

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-white text-3xl font-italic tracking-wide">
            Signele
          </h1>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link href={item.href} key={item.id} passHref>
              <motion.div
                className={`flex items-center space-x-3 text-indigo-200 hover:text-layeredTeal transition-colors duration-300 ${
                  activeTab === item.id ? 'text-layeredTeal font-semibold' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={20} />
                <span className="text-lg">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-200 hover:text-layeredTeal transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-layeredDarkBlue shadow-md py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {navItems.map((item) => (
              <Link href={item.href} key={item.id} passHref>
                <motion.div
                  className={`block px-8 py-3 text-lg text-gray-200 hover:text-layeredTeal transition-colors duration-300 ${
                    activeTab === item.id ? 'text-layeredTeal font-semibold' : ''
                  }`}
                  whileHover={{ x: 8 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
