"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/UserContext";
import ProfileDropdown from "@/components/ProfileDropDown";

export default function FixedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const dropdownRefs = useRef({});
  const searchParams = useSearchParams();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSigninClick = (redirectPage) => {
    const query = searchParams.toString();
    const currentUrl = pathname + (query ? `?${query}` : "");
    document.cookie = `redirect=${encodeURIComponent(currentUrl)}; path=/; max-age=600`;
    router.push(redirectPage);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target) &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      // Check if click is outside all dropdowns
      const clickedOutsideDropdowns = Object.values(dropdownRefs.current).every(
        ref => !ref || !ref.contains(event.target)
      );
      
      if (clickedOutsideDropdowns && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    if (menuOpen || activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, activeDropdown]);

  // Mega menu configurations
  const megaMenus = {
    services: {
      title: "Services",
      categories: [
        {
          title: "Development",
          items: [
            { name: "Web Development", desc: "Modern & scalable websites", href: "/web-dev" },
            { name: "Mobile App Development", desc: "Android & iOS solutions", href: "/services/mobile-apps" },
            { name: "Custom Software", desc: "Tailored business software", href: "/services/custom-software" },
          ]
        },
        {
          title: "Design & Branding",
          items: [
            { name: "UI/UX Design", desc: "User-centric digital experiences", href: "/services/ui-ux" },
            { name: "Branding", desc: "Identity & brand strategy", href: "/services/branding" },
            { name: "Graphic Design", desc: "Creative visual solutions", href: "/services/graphic-design" },
          ]
        },
        {
          title: "Marketing & AI",
          items: [
            { name: "Digital Marketing", desc: "Growth-driven marketing", href: "/services/digital-marketing" },
            { name: "SEO & Performance", desc: "Rank higher & convert more", href: "/services/seo" },
            { name: "AI Automation", desc: "Smart AI-powered solutions", href: "/services/ai-automation" },
          ]
        }
      ]
    },

    solutions: {
      title: "Solutions",
      categories: [
        {
          title: "Industries",
          items: [
            { name: "Startups", desc: "Launch & scale faster", href: "/solutions/startups" },
            { name: "E-commerce", desc: "Sell smarter online", href: "/solutions/ecommerce" },
            { name: "Enterprises", desc: "Enterprise-grade solutions", href: "/solutions/enterprise" },
          ]
        },
        {
          title: "Use Cases",
          items: [
            { name: "Lead Generation", desc: "Convert visitors into clients", href: "/solutions/lead-generation" },
            { name: "Process Automation", desc: "Reduce manual work", href: "/solutions/automation" },
            { name: "Digital Transformation", desc: "Modernize your business", href: "/solutions/digital-transformation" },
          ]
        }
      ]
    }
  };

  const simpleLinks = [
    { name: "Portfolio", href: "/portfolio" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when mouse leaves the entire navigation area
  const handleNavMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header
      style={{
        background: isScrolled
          ? "rgba(255, 255, 255, 0.85)"
          : "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        boxShadow: isScrolled
          ? "0 4px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06)"
          : "0 2px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.55)",
        transition: "background 0.35s ease, box-shadow 0.35s ease",
      }}
      className="fixed top-0 z-50 w-full"
    >
      <div className="mx-auto flex lg:grid max-w-7xl lg:grid-cols-[1fr_auto_1fr] items-center justify-between px-4 sm:px-6 py-3 md:py-3.5">

        {/* Left — Logo */}
        <div className="flex items-center">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="shrink-0 focus:outline-none flex items-center transition-transform duration-300 ease-out hover:scale-105"
            aria-label="Go to home"
          >
            <Image
              src="/images/logo (2).svg"
              alt="Evolkun"
              width={170}
              height={140}
              priority
              className="h-14 w-auto object-contain"
            />
          </button>
        </div>

        {/* Centre — Desktop Navigation (own grid column for true centering) */}
        <nav
          className="hidden lg:flex items-center justify-center gap-8"
          onMouseLeave={handleNavMouseLeave}
        >
            {/* Services Mega Menu */}
            <div
              className="relative"
              ref={el => dropdownRefs.current['services'] = el}
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('services')}
                className="py-2 text-[15px] font-medium text-slate-700 rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:text-violet-600"
              >
                Services
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute left-0 top-full pt-3">
                  <div className="w-[680px] rounded-xl border border-zinc-100 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-3 divide-x divide-zinc-100">
                      {megaMenus.services.categories.map((category) => (
                        <div key={category.title} className="p-6">
                          <h3 className="mb-4 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                            {category.title}
                          </h3>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group block rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-zinc-50 hover:-translate-y-0.5 hover:shadow-sm"
                              >
                                <div className="text-[14px] font-semibold text-zinc-900 mb-0.5">
                                  {item.name}
                                </div>
                                <div className="text-[13px] text-zinc-500">
                                  {item.desc}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-zinc-900">Ready to transform your business?</p>
                          <p className="text-[13px] text-zinc-500">Let's build something amazing together.</p>
                        </div>
                        <Link
                          href="/survey-page"
                          onClick={() => setActiveDropdown(null)}
                          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.22)]"
                        >
                          Get Started
                          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Mega Menu */}
            <div
              className="relative"
              ref={el => dropdownRefs.current['solutions'] = el}
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('solutions')}
                className="py-2 text-[15px] font-medium text-slate-700 rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:text-violet-600"
              >
                Solutions
              </button>

              {activeDropdown === 'solutions' && (
                <div className="absolute left-0 top-full pt-3">
                  <div className="w-[540px] rounded-xl border border-zinc-100 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-zinc-100">
                      {megaMenus.solutions.categories.map((category) => (
                        <div key={category.title} className="p-6">
                          <h3 className="mb-4 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                            {category.title}
                          </h3>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <div
                                key={item.name}
                                className="group block rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-zinc-50 hover:-translate-y-0.5 hover:shadow-sm cursor-default"
                              >
                                <div className="text-[14px] font-semibold text-zinc-900 mb-0.5">
                                  {item.name}
                                </div>
                                <div className="text-[13px] text-zinc-500">
                                  {item.desc}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-zinc-900">Need a custom solution?</p>
                          <p className="text-[13px] text-zinc-500">We'll tailor it to your needs.</p>
                        </div>
                        <Link
                          href="/contact"
                          onClick={() => setActiveDropdown(null)}
                          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.22)]"
                        >
                          Contact Us
                          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simple Navigation Links */}
            {simpleLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-2 text-[15px] font-medium text-slate-700 rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:text-violet-600"
              >
                {link.name}
              </Link>
            ))}
        </nav>

        {/* Right — Auth Buttons & Mobile Toggle */}
        <div className="flex items-center justify-end gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleSigninClick("/signin")}
                  className="text-[15px] font-medium text-slate-700 transition-all duration-300 ease-out hover:text-black hover:-translate-y-1"
                >
                  Log in
                </button>
                <button
                  onClick={() => handleSigninClick("/signup")}
                  className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-7 py-3 text-[15px] font-semibold text-white shadow-md transition-all duration-300 ease-out hover:bg-black hover:-translate-y-1 hover:shadow-xl"
                >
                  Sign up
                </button>
              </>
            ) : isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="lg:hidden group relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white active:scale-95"
          >
            <span
              className={`absolute block h-0.5 w-5 rounded-full bg-zinc-900 transition-all duration-300 ${
                menuOpen ? "translate-y-0 rotate-45" : "translate-y-[-4px]"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 rounded-full bg-zinc-900 transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 rounded-full bg-zinc-900 transition-all duration-300 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {menuOpen && (
        <div
          ref={navRef}
          className="lg:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-xl absolute top-full left-0 w-full max-h-[calc(100vh-76px)] overflow-y-auto shadow-2xl"
        >
          <div className="mx-4 my-5 space-y-1">
            {/* Mobile Navigation Links */}
            <div className="space-y-1 pb-4 border-b border-zinc-100">
              {/* Services with submenu */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'mobile-services' ? null : 'mobile-services')}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 min-h-[44px] text-[15px] sm:text-[14px] font-medium text-zinc-900 active:bg-zinc-100 transition-colors"
                >
                  Services
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'mobile-services' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'mobile-services' && (
                  <div className="ml-4 space-y-1">
                    {megaMenus.services.categories.flatMap(cat => cat.items).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="block rounded-lg px-4 py-3 min-h-[44px] flex items-center text-[15px] sm:text-[14px] text-zinc-600 active:bg-zinc-100 active:text-zinc-900 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions with submenu */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'mobile-solutions' ? null : 'mobile-solutions')}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 min-h-[44px] text-[15px] sm:text-[14px] font-medium text-zinc-900 active:bg-zinc-100 transition-colors"
                >
                  Solutions
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'mobile-solutions' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'mobile-solutions' && (
                  <div className="ml-4 space-y-1">
                    {megaMenus.solutions.categories.flatMap(cat => cat.items).map((item) => (
                      <div
                        key={item.name}
                        className="block rounded-lg px-4 py-3 min-h-[44px] flex items-center text-[15px] sm:text-[14px] text-zinc-600 active:bg-zinc-100 cursor-default"
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Simple Links */}
              {simpleLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3.5 min-h-[44px] flex items-center text-[15px] sm:text-[14px] font-medium text-zinc-900 active:bg-zinc-100 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            {!isAuthenticated ? (
              <div className="grid gap-2.5 pt-4">
                <button
                  onClick={() => {
                    handleSigninClick("/signin");
                    setMenuOpen(false);
                  }}
                  className="rounded-xl border border-zinc-200 px-4 py-3.5 min-h-[44px] text-[15px] font-medium text-zinc-900 transition-colors active:bg-zinc-100"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleSigninClick("/signup");
                    setMenuOpen(false);
                  }}
                  className="rounded-xl bg-zinc-900 px-4 py-3.5 min-h-[44px] text-[15px] font-semibold text-white transition-colors active:bg-black"
                >
                  Sign up
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center gap-3 pt-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                <span className="text-[14px] text-zinc-600">Loading…</span>
              </div>
            ) : (
              <div className="pt-4">
                <ProfileDropdown />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}