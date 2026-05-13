export default function Footer() {
  return (
    <footer className="bg-slate-50 py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <span className="text-lg font-bold text-blue-900 tracking-tighter font-['Plus_Jakarta_Sans']">
            StayLink
          </span>
          <p className="text-slate-400 text-xs mt-4 leading-relaxed">
            © 2024 StayLink. The Fluid Concierge experience.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h5 className="text-blue-900 font-bold text-sm mb-4">Explore</h5>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="#"
                className="text-slate-400 text-xs hover:text-blue-700 transition-all duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 text-xs hover:text-blue-700 transition-all duration-200"
              >
                Partner with us
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="text-blue-900 font-bold text-sm mb-4">Legal</h5>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="#"
                className="text-slate-400 text-xs hover:text-blue-700 transition-all duration-200"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-slate-400 text-xs hover:text-blue-700 transition-all duration-200"
              >
                Terms
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="text-blue-900 font-bold text-sm mb-4">Newsletter</h5>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-700 shadow-sm"
            />
            <button className="bg-[#003d9b] text-white rounded-lg px-4 py-2 text-xs font-bold hover:bg-blue-800 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}