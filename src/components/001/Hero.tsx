import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import {
  AlertTriangle,
  MessageCircle,
  Send,
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/components/auth/firebase";
import { depressionTalks } from "@/assets/data";

const images = [
  "https://res.cloudinary.com/direjlzc6/image/upload/v1773954485/t8l00kopordqix19wnck.jpg",
  "https://res.cloudinary.com/direjlzc6/image/upload/v1773954466/hz1wq8apdzecoang4fjo.jpg",
  "https://res.cloudinary.com/direjlzc6/image/upload/v1773954464/kfeai6vufsaorztbsap2.jpg",
];

const swipeConfidenceThreshold = 10000;

const Hero = () => {
  const [[index, direction], setIndex] = useState([0, 0]);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const postId = "hero-post";

  const paginate = (dir: number) => {
    setIndex([(index + dir + images.length) % images.length, dir]);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipe = info.offset.x * info.velocity.x;
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  const handleLike = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Login to support ❤️");
      return;
    }

    const postRef = doc(db, "depression_posts", postId);

    try {
      if (liked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const postRef = doc(db, "depression_posts", postId);
      const snap = await getDoc(postRef);

      if (snap.exists()) {
        const data = snap.data();
        const likes = data.likes || [];

        setLikesCount(likes.length);
        setLiked(likes.includes(user.uid));
      }
    };

    fetchLikes();
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
    }),
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center
    bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">

      <div className="space-y-5 md:space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold flex items-center gap-2 md:gap-3 text-gray-900 dark:text-white"
        >
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          Depression
        </motion.h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 flex items-start gap-2">
          <User className="w-4 h-4 mt-1" />
          Share your truth anonymously.
        </p>

        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
        p-3 md:p-4 rounded-lg flex gap-2 md:gap-3">
          <AlertTriangle className="text-red-500 w-5 h-5 mt-1" />
          <div>
            <h4 className="text-sm md:text-base font-semibold text-red-600 dark:text-red-400">
              Content Warning
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Contains discussion of depression.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="italic text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-3 md:pl-4"
          >
            {depressionTalks[index % depressionTalks.length]}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm
          ${
            liked
              ? "bg-red-100 dark:bg-red-900/40 text-red-500 border-red-300"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          {likesCount} Support
        </motion.button>

        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Share your experience..."
            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-neutral-800
            text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
            outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-500"
          >
            <Send className="w-4 h-4" />
            Send
          </motion.button>
        </form>
      </div>

      <div className="relative h-[250px] sm:h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-xl">

        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={images[index]}
            className="absolute w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          />
        </AnimatePresence>

        <button
          onClick={() => paginate(-1)}
          className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Hero;