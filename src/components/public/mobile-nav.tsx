"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavProps {
  user?: {
    username: string;
    fullName: string | null;
  } | null;
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-1" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-out mt-1 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-out mt-1 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-70 bg-background/95 backdrop-blur-xl border-l border-muted-foreground/20 z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground font-medium hover:bg-primary/10 transition-colors"
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground font-medium hover:bg-primary/10 hover:text-foreground transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Features
            </Link>
            <Link
              href="#installation"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground font-medium hover:bg-primary/10 hover:text-foreground transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Installation
            </Link>
          </nav>

          {/* Divider */}
          <div className="h-px bg-muted-foreground/20 my-6" />

          {/* Auth Buttons or User Info */}
          <div className="flex flex-col gap-6">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                    {user.fullName
                      ? user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                      : user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{user.username}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user.fullName}</span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-12 px-4 rounded-lg bg-primary text-primary-foreground font-bold glow-primary hover:bg-primary/90 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-11 px-4 rounded-lg border border-muted-foreground/30 text-foreground font-bold hover:bg-muted/50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-11 px-4 rounded-lg bg-primary text-primary-foreground font-bold glow-primary hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pb-8">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Feednances. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
