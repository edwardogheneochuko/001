import { Github, Linkedin, Icon } from 'lucide-react';
import { pumpkin } from '@lucide/lab';
import { motion } from 'framer-motion';
import { fadeUp, inView, stagger } from '@/lib/motion';

const blurbs = [
  'A space for those battling depression, violence, and the chaos within. We turn pain into expression, silence into presence.',
  '001 exists to reflect the unseen — broken thoughts, hidden scars, and the reality many avoid.',
  'You are not alone in the dark. Even shadows need light to exist.',
];

const socials = [
  { href: 'https://github.com/edwardogheneochuko/001.git', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/edward-ogheneochuko/', label: 'LinkedIn', icon: Linkedin },
];

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-red-950/80 px-6 md:px-12 pt-16 pb-10 text-gray-300 tracking-widest">
      <motion.div
        variants={stagger(0.1)}
        {...inView}
        className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 text-xs uppercase lg:w-11/12"
      >
        <motion.p variants={fadeUp} className="md:col-span-3 lg:col-span-1 text-red-600 font-semibold">
          001 — A VOICE FOR THE SILENT
        </motion.p>
        {blurbs.map((text) => (
          <motion.p
            key={text}
            variants={fadeUp}
            className="leading-relaxed text-gray-400 hover:text-red-400 transition-colors duration-300"
          >
            {text}
          </motion.p>
        ))}
      </motion.div>

      <hr className="border-t border-gray-800 my-10" />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        <div className="w-fit p-3 rounded-full border border-red-900 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] transition-shadow duration-500">
          <Icon iconNode={pumpkin} className="w-10 h-10 text-orange-600" aria-hidden="true" />
        </div>

        <div className="flex flex-col md:items-end gap-5">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 uppercase tracking-wider">
            <li>Sitemap</li>
            <li>Terms of service</li>
            <li>Privacy policy</li>
          </ul>

          <ul className="flex gap-5">
            {socials.map(({ href, label, icon: SocialIcon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="block text-gray-500 hover:text-red-500 hover:-translate-y-0.5 transition duration-300"
                >
                  <SocialIcon className="w-5 h-5" />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-600">© {new Date().getFullYear()} zerozerOne</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
