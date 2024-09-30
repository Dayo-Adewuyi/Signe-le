"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Transition } from "@headlessui/react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { ArrowDownIcon, FileTextIcon, LockIcon, UsersIcon } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const LandingPage = () => {
  const [init, setInit] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-hidden">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: "#ffffff" },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: { enable: true, speed: 2 },
              number: { density: { enable: true }, value: 80 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />
      )}

      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-layeredTeal to-layeredDarkBlue">
              Signele
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-layeredDarkBlue transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    {account ? "Connected" : "Get Started"}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </motion.div>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-layeredTeal to-layeredDarkBlue mb-6">
            Secure Document Signing on the Blockchain
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the future of digital signatures with Signele
          </p>
          <div className="bg-layeredDarkBlue">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-layeredTeal text-white px-6 py-2 rounded-full font-semibold hover:bg-layeredDarkBlue transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    {account ? "Connected" : "Try Signele Now"}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: <FileTextIcon size={48} />,
              title: "Create Documents",
              description: "Easily upload and manage your documents",
            },
            {
              icon: <UsersIcon size={48} />,
              title: "Invite Signers",
              description: "Add multiple signers to your documents",
            },
            {
              icon: <LockIcon size={48} />,
              title: "Secure Signatures",
              description: "Sign documents with blockchain security",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-10 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-transform"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2 * index,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mt-4 mb-2">
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Learn More */}
        <div className="text-center mb-16">
          <motion.button
            onClick={() => setShowMore(!showMore)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-blue-900 px-6 py-3 rounded-full font-semibold inline-flex items-center shadow-lg hover:shadow-xl"
          >
            {showMore ? "Show Less" : "Learn More"}
            <ArrowDownIcon
              className={`ml-2 transition-transform duration-300 ${
                showMore ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </div>

        <Transition
          show={showMore}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-white bg-opacity-5 p-8 rounded-lg shadow-xl text-center">
            <p className="text-gray-200 text-lg">
              Signele is the most secure way to sign documents with blockchain
              technology. Our platform ensures that your documents remain
              tamper-proof and easily verifiable. Start using Signele today and
              never worry about document security again.
            </p>
          </div>
        </Transition>
      </main>
    </div>
  );
};

export default LandingPage;
