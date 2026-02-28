import { Github, Linkedin, Youtube } from 'lucide-react';
import { Icon } from 'lucide-react';
import { pumpkin } from '@lucide/lab';

const Footer = () => {
  return (
    <footer className="ml-3 md:ml-7 p-4 text-white">
      {/* Top grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 w-3/4">
        <div className="md:col-span-3 lg:col-span-1">001</div>
        <div>Footer Content 2</div>
        <div>Footer Content 3</div>
        <div>Footer Content 4</div>
      </div>

      {/* Divider */}
      <hr className="border-t border-amber-50 my-6 w-full lg:w-3/4" />

      {/* Bottom section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full lg:w-3/4 gap-6 md:gap-0">
        
        {/* Left: Pumpkin */}
        <div className="flex justify-start">
              <Icon iconNode={pumpkin} className="w-12 h-12 text-orange-500"/>
        </div>

        {/* Right: Links + Socials + © */}
        <div className="flex flex-col md:items-end gap-4">
          {/* Links */}
          <ul className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm">
            <li>Sitemap</li>
            <li>Terms of service</li>
            <li>Privacy policy</li>
          </ul>

          {/* Social icons */}
          <ul className="flex gap-4 text-sm">
            <li><Youtube className="w-5 h-5" /></li>
            <li><Github className="w-5 h-5" /></li>
            <li><Linkedin className="w-5 h-5" /></li>
          </ul>

          {/* Copyright */}
          <div className="text-white text-sm mt-1">
            © 2026 zerozerOne
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;