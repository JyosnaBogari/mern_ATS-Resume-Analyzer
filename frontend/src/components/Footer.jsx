

import { bodyText, linkClass, mutedText } from '../styles/common';

function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-[#1d1d1f] mb-4">ATS Resume Checker</h3>
            <p className={bodyText}>Optimize your resume for Applicant Tracking Systems with our AI-powered tools.</p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className={linkClass}>Home</a></li>
              <li><a href="/signup" className={linkClass}>Sign Up</a></li>
              <li><a href="/signin" className={linkClass}>Sign In</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-4">Contact</h4>
            <p className={bodyText}>support@atsresumechecker.com</p>
            <p className={mutedText}>© 2024 ATS Resume Checker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
