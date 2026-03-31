import { Github, Linkedin, Youtube } from 'lucide-react';
import { Icon } from 'lucide-react';
import { pumpkin } from '@lucide/lab';

const Footer = () => {
  return (
    <footer className="mt-8 md:mt-40 ml-3 md:ml-7 p-6 text-gray-300 tracking-widest">

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-3/4 text-xs uppercase">
  
  <div className="md:col-span-3 lg:col-span-1 text-red-700 animate-pulse">
    001 — A VOICE FOR THE SILENT
  </div>

  <div className="hover:text-red-500 transition duration-300 leading-relaxed">
    A space for those battling depression, violence, and the chaos within.  
    We turn pain into expression, silence into presence.
  </div>

  <div className="hover:text-red-500 transition duration-300 leading-relaxed">
    001 exists to reflect the unseen — broken thoughts, hidden scars, and the reality many avoid.
  </div>

  <div className="hover:text-red-500 transition duration-300 leading-relaxed">
    You are not alone in the dark.  
    Even shadows need light to exist.
  </div>

</div>

      <hr className="border-t border-gray-700 my-8 w-full opacity-40" />

      <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full lg:w-3/4 gap-6 md:gap-0">
        
        <div className="flex justify-start border border-red-900 w-fit p-3 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.8)] transition duration-500">
          <Icon 
            iconNode={pumpkin} 
            className="w-10 h-10 text-orange-600 hover:text-red-600 transition duration-500" 
          />
        </div>

        <div className="flex flex-col md:items-end gap-6">

          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 text-xs text-gray-500 uppercase tracking-wider">
            <li className="hover:text-red-600 cursor-pointer transition duration-300">Sitemap</li>
            <li className="hover:text-red-600 cursor-pointer transition duration-300">Terms of service</li>
            <li className="hover:text-red-600 cursor-pointer transition duration-300">Privacy policy</li>
          </ul>

          <ul className="flex gap-6 text-gray-700 duration-300">
            <li className="hover:text-red-600 hover:scale-110 transition duration-300 cursor-pointer">
              <Youtube className="w-5 h-5" />
            </li>
            <a href='https://github.com/edwardogheneochuko/001.git'
            className="hover:text-red-600 hover:scale-110 transition duration-300 cursor-pointer">
              <Github className="w-5 h-5" />
            </a>
            <a
            href='https://www.linkedin.com/in/edward-ogheneochuko/'
            className="hover:text-red-600 hover:scale-110 transition duration-300 cursor-pointer">
              <Linkedin className="w-5 h-5" />
            </a>
          </ul>

          <div className="text-xs text-gray-600 tracking-widest opacity-70">
            © 2026 zerozerOne
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;