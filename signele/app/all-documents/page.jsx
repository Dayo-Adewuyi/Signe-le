"use client";
import { useState, useEffect } from 'react';
import { Tab, TabGroup,TabList,TabPanels,TabPanel } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAlchemy } from '../AlchemyContext';


const sampleCreatedDocs = [
  {
    id: 1,
    title: 'Project Proposal',
    description: 'A comprehensive proposal for our new project.',
    signers: ['0x123...', '0x456...', '0x789...'],
    completed: false,
  },
  {
    id: 2,
    title: 'Employment Contract',
    description: 'Standard employment contract for new hires.',
    signers: ['0xabc...', '0xdef...'],
    completed: true,
  },
  {
    id: 3,
    title: 'Non-Disclosure Agreement',
    description: 'NDA for partnership with XYZ Corp.',
    signers: ['0x321...', '0x654...', '0x987...'],
    completed: false,
  },
  {
    id: 4,
    title: 'Lease Agreement',
    description: 'Office space lease for the new branch.',
    signers: ['0xfed...', '0xcba...'],
    completed: false,
  },
];

const samplePendingDocs = [
  {
    id: 5,
    title: 'Budget Approval',
    description: 'Q3 budget approval document.',
    creator: '0x111...',
    completed: false,
  },
  {
    id: 6,
    title: 'Client Contract',
    description: 'Service agreement for our biggest client.',
    creator: '0x222...',
    completed: false,
  },
  {
    id: 7,
    title: 'Team Guidelines',
    description: 'Updated guidelines for remote work.',
    creator: '0x333...',
    completed: false,
  },
];

export default function DocumentManagement() {
  const [createdDocs, setCreatedDocs] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {} = useAlchemy();

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setCreatedDocs(sampleCreatedDocs);
      setPendingDocs(samplePendingDocs);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Document Management</h1>
        
        <TabGroup>
          <TabList className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-8">
            <Tab as={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={({ selected }) =>
              `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
              focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }>
              Created Documents
            </Tab>
            <Tab as={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={({ selected }) =>
              `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
              focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }>
              Pending Signatures
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    Loading created documents...
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {createdDocs.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                      >
                        <DocumentIcon className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                        <p className="text-gray-600 mb-4">{doc.description}</p>
                        <div className="text-sm text-gray-500 mb-2">
                          Signers: {doc.signers.length}
                        </div>
                        <div className={`text-sm ${doc.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                          Status: {doc.completed ? 'Completed' : 'Pending'}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabPanel>
            <TabPanel>
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    Loading pending documents...
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {pendingDocs.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                      >
                        <PencilIcon className="h-8 w-8 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                        <p className="text-gray-600 mb-4">{doc.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          Creator: {doc.creator}
                        </div>
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-300">
                          Sign Document
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}