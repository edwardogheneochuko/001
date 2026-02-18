import { motion } from "framer-motion";


const PumpkinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C9 5 5 6 5 12s4 10 7 10 7-4 7-10-4-7-7-10z" />
    <path d="M12 2v4" />
    <path d="M8 12h8" />
  </svg>
);

const Page1 = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden relative">
      
      <motion.div
        className="absolute w-full h-full bg-black"
        animate={{ opacity: [0.8, 1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="relative flex flex-col items-center justify-center text-center px-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <motion.div
          className="mb-6 text-orange-500"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1, 1.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PumpkinIcon className="w-20 h-20" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold text-red-600 drop-shadow-lg mb-4"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Welcome
        </motion.h1>

        <motion.p
          className="text-xl text-white drop-shadow-md"
          animate={{ opacity: [0.7, 1, 0.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Enter if you dare...
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute w-32 h-32 bg-white rounded-full opacity-10 blur-2xl top-20 left-10"
        animate={{ y: [0, 20, 0], x: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-24 h-24 bg-white rounded-full opacity-10 blur-2xl bottom-20 right-20"
        animate={{ y: [0, -20, 0], x: [0, -10, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Page1;
