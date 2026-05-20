import { bodyText, linkClass, mutedText } from "../styles/common";

function Footer() {
  return (
    <footer className="bg-[#f4f8ff] border-t border-[#dbe7f7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              📄
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              ATS Resume Checker
            </h3>
          </div>

          <p className={bodyText}>
            Optimize your resume for Applicant Tracking Systems with intelligent AI guidance and polished templates.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4 uppercase tracking-[0.12em]">
            Quick Links
          </h4>

          <ul className="space-y-3">
            <li><a href="/" className={linkClass}>Home</a></li>
            <li><a href="/signup" className={linkClass}>Sign Up</a></li>
            <li><a href="/signin" className={linkClass}>Sign In</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4 uppercase tracking-[0.12em]">
            Contact
          </h4>

          <p className={bodyText}>support@atsresumechecker.com</p>
          <p className={mutedText + " mt-3 block"}>
            © 2024 ATS Resume Checker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;