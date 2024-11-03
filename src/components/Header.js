'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Logo from '@/assets/images/Logo.png'

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background-light dark:bg-background-dark shadow-md">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-primary-600 dark:text-primary-600 flex " href="#">
              <Image
                src={Logo}
                width={70}
                height={70}
                alt='Woolf and Fox connection'
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                {['About', 'Careers', 'History', 'Services', 'Projects', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-primary-500 transition"
                href="#"
              >
                Login
              </Link>
              <Link
                className="hidden sm:block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-primary-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75 transition"
                href="#"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-md bg-white dark:bg-gray-800 shadow-lg">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-4 p-4">
                {['About', 'Careers', 'History', 'Services', 'Projects', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link
                      className="block text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
