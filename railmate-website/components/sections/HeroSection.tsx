"use client";

import { GooglePlayLogo, AndroidLogo, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";

const PhoneMockup = () => (
  <div className="w-[280px] h-[560px] rounded-[36px] border-2 border-border-strong bg-bg-elevated p-5 shadow-[0_32px_64px_rgba(0,0,0,0.6),_0_0_40px_rgba(0,168,89,0.08)]">
    <div className="h-full w-full bg-bg-base rounded-[16px] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <p className="font-semibold text-sm text-text-primary text-center">← Dhaka → Chittagong</p>
        <p className="text-xs text-text-secondary text-center mt-1">Thu 11 Jun · All Classes</p>
      </div>
      
      {/* Train Cards */}
      <div className="flex-grow p-4 space-y-4 overflow-hidden">
        {/* Card 1 */}
        <div className="p-3 rounded-lg border-l-4 border-primary bg-bg-card space-y-2">
          <p className="font-semibold text-sm">Subarna Express #721</p>
          <p className="font-mono text-xs text-text-primary">06:40 ──── 11:15 <span className="text-text-secondary">(4h 35m)</span></p>
          <div className="inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
            ⚠ 15 min delay reported
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">S_CHAIR</span>
            <span className="text-[10px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">SNIGDHA</span>
            <span className="text-[10px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">AC_BERTH</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-3 rounded-lg border-l-4 border-primary bg-bg-card space-y-2">
          <p className="font-semibold text-sm">Sonar Bangla Exp #787</p>
          <p className="font-mono text-xs text-text-primary">07:00 ──── 12:00 <span className="text-text-secondary">(5h 00m)</span></p>
           <div className="inline-flex items-center text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
            ✓ On time
          </div>
        </div>
      </div>

      {/* Live Report */}
      <div className="p-4">
        <div className="bg-bg-overlay rounded-md p-2.5 text-center animate-float">
          <p className="text-xs">🔴 8 travelers confirm delay on Subarna Express</p>
        </div>
      </div>
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-bg-base overflow-hidden">
      {/* Background patterns */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at bottom left, rgba(0,168,89,0.05) 0%, transparent 40%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <div className="inline-flex items-center bg-primary-subtle text-primary text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1.5 mb-6">
              🇧🇩 Bangladesh's #1 Railway Companion App
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-[56px] leading-tight text-text-primary">
              Your Railway,<br />Simplified<span className="text-primary">.</span>
            </h1>
            
            <p className="font-bengali text-lg text-text-secondary mt-2">
              আপনার রেলযাত্রা, সহজ করা হলো।
            </p>

            <p className="mt-4 max-w-lg mx-auto lg:mx-0 text-base md:text-lg text-text-secondary leading-relaxed">
              Stop using 3 different apps just to catch one train. RailMate gives you real schedules, real fares, and live delay reports from fellow travelers — all in one place. Free.
            </p>
            
            <div className="mt-5 flex justify-center lg:justify-start flex-wrap gap-3">
              <div className="flex items-center gap-2 border border-border-strong rounded-full px-3.5 py-1.5 text-xs font-medium text-text-secondary">
                <CheckCircle size={14} className="text-success" weight="fill" />
                Free Forever
              </div>
              <div className="flex items-center gap-2 border border-border-strong rounded-full px-3.5 py-1.5 text-xs font-medium text-text-secondary">
                 <CheckCircle size={14} className="text-success" weight="fill" />
                Bengali + English
              </div>
              <div className="flex items-center gap-2 border border-border-strong rounded-full px-3.5 py-1.5 text-xs font-medium text-text-secondary">
                 <CheckCircle size={14} className="text-success" weight="fill" />
                Works Offline
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <Link href="#download" className="inline-flex items-center gap-3 bg-primary text-text-inverse font-semibold h-14 px-7 rounded-md hover:bg-primary-dim transition-colors">
                <GooglePlayLogo size={24} weight="fill" />
                <span>Download on Google Play</span>
              </Link>
              <Link href="#download" className="inline-flex items-center gap-3 border-2 border-border-strong text-text-secondary font-semibold h-14 px-7 rounded-md hover:bg-border-strong transition-colors">
                <AndroidLogo size={24} weight="fill" />
                <span>Download APK</span>
              </Link>
            </div>
            
            <p className="mt-4 text-xs text-text-tertiary">
              App Store version coming soon · Free · Android 7.0+
            </p>
          </div>

          {/* Right Column */}
          <div className="hidden lg:col-span-2 lg:flex justify-center items-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
