"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "./spotifyclone.css";

// --- Floating Music Icons Background (Optimized) ---
function FloatingMusicIcons() {
  const iconsRef = useRef<Array<{id: number, x: number, y: number, symbol: string, size: number, speed: number}>>([]);
  const [, setTrigger] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const musicSymbols = ['♪', '♫', '♬', '♩', '♭', '𝄞'];

    // Initialize icons once
    if (iconsRef.current.length === 0) {
      for (let i = 0; i < 30; i++) { // Reduced from 60 to 30
        iconsRef.current.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          symbol: musicSymbols[Math.floor(Math.random() * musicSymbols.length)],
          size: 16 + Math.random() * 24,
          speed: 0.5 + Math.random() * 1.5
        });
      }
    }

    // Use RAF instead of setInterval for smoother animation
    const animate = () => {
      iconsRef.current = iconsRef.current.map(icon => {
        let newY = icon.y - icon.speed * 0.08;
        
        if (newY < -5) {
          return {
            ...icon,
            x: Math.random() * 100,
            y: 105 + Math.random() * 10,
            symbol: musicSymbols[Math.floor(Math.random() * musicSymbols.length)],
            size: 16 + Math.random() * 24,
            speed: 0.5 + Math.random() * 1.5
          };
        }
        
        return { ...icon, y: newY };
      });

      // Trigger re-render less frequently (every 2 frames)
      setTrigger(prev => (prev + 1) % 2);
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="floating-music-icons">
      {iconsRef.current.map(icon => (
        <div
          key={icon.id}
          className="music-icon"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: `${icon.size}px`,
          }}
        >
          {icon.symbol}
        </div>
      ))}
    </div>
  );
}

// --- Music Cursor Controller ---
function MusicCursorController() {
  useEffect(() => {
    const el = document.getElementById("music-cursor");
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return null;
}

// --- Radar + Audio Wave Background (Optimized) ---
function AudioEqualizerBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barsRef = useRef<{ x: number; phase: number }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let rafId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth * dpr;
      height = window.innerHeight * dpr;
      canvas.width = width;
      canvas.height = height;
    };

    resize();

    // Precompute bar positions once
    const barCount = 80; // Reduced from 120
    barsRef.current = [];
    for (let i = 0; i < barCount; i++) {
      barsRef.current.push({
        x: (i / (barCount - 1)) * width,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = (t: number) => {
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#02040a");
      bgGrad.addColorStop(1, "#050612");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const primary = "#28d7ff";

      // Radar-style circular UI on the left
      const centerX = width * 0.18;
      const centerY = height * 0.5;
      const maxR = Math.min(width, height) * 0.32;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer faint circle
      ctx.beginPath();
      ctx.arc(0, 0, maxR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(40, 215, 255, 0.25)";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // Multiple concentric circles (reduced count)
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (maxR * i) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(40, 215, 255, ${0.15 + i * 0.1})`;
        ctx.lineWidth = 1 * dpr;
        ctx.setLineDash([4 * dpr, 6 * dpr]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Rotating radial lines (reduced)
      const segments = 16;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + t * 0.0008;
        const innerR = maxR * 0.2;
        const outerR = maxR;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
        ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
        ctx.strokeStyle = "rgba(40, 215, 255, 0.25)";
        ctx.lineWidth = 0.8 * dpr;
        ctx.stroke();
      }

      // Central pulse circle
      const pulseR = maxR * (0.18 + 0.02 * Math.sin(t * 0.003));
      const radialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseR);
      radialGrad.addColorStop(0, "rgba(40, 215, 255, 0.9)");
      radialGrad.addColorStop(1, "rgba(40, 215, 255, 0.0)");
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.fill();

      // Small orbiting dots (reduced)
      const dotCount = 12;
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + t * 0.0012;
        const r = maxR * 0.85;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 3 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(40, 215, 255, 0.9)";
        ctx.fill();
      }

      ctx.restore();

      // Central audio waveform across screen
      const centerLineY = height * 0.5;
      const baseAmplitude = height * 0.12;
      const glowHeight = baseAmplitude * 1.1;

      ctx.save();
      ctx.translate(0, centerLineY);

      // Glow bars
      for (const bar of barsRef.current) {
        const progress = bar.x / width;
        const wave =
          Math.sin(progress * 3.5 * Math.PI + t * 0.002 + bar.phase) +
          0.5 * Math.sin(progress * 9 * Math.PI - t * 0.003);

        const barH = (Math.abs(wave) + 0.15) * glowHeight;
        const barW = (width / barCount) * 0.65;

        const barGrad = ctx.createLinearGradient(
          bar.x,
          -barH,
          bar.x,
          barH
        );
        barGrad.addColorStop(0, "rgba(148, 230, 255, 0.0)");
        barGrad.addColorStop(0.4, "rgba(148, 230, 255, 0.7)");
        barGrad.addColorStop(0.6, "rgba(148, 230, 255, 0.9)");
        barGrad.addColorStop(1, "rgba(148, 230, 255, 0.0)");

        ctx.fillStyle = barGrad;
        ctx.fillRect(bar.x - barW / 2, -barH, barW, barH * 2);
      }

      // Main waveform line
      ctx.beginPath();
      for (let i = 0; i < barsRef.current.length; i++) {
        const bar = barsRef.current[i];
        const x = bar.x;
        const progress = bar.x / width;
        const wave =
          Math.sin(progress * 3.5 * Math.PI + t * 0.002 + bar.phase) +
          0.5 * Math.sin(progress * 9 * Math.PI - t * 0.003);

        const y = wave * baseAmplitude * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2.2 * dpr;
      ctx.shadowColor = primary;
      ctx.shadowBlur = 16 * dpr;
      ctx.stroke();

      ctx.restore();

      rafId = requestAnimationFrame(draw);
    };

    let start = performance.now();
    const loop = (time: number) => {
      draw(time - start);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="neuron-bg-canvas"
      aria-hidden="true"
    />
  );
}

export default function SpotifyClonePage() {
  const [darkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !videoRef.current) return;

    // Auto-play video without user interaction when mounted
    const playVideo = async () => {
      try {
        await videoRef.current?.play();
      } catch (error) {
        console.log("Autoplay prevented or failed");
      }
    };

    playVideo();
  }, [mounted]);

  if (!mounted) {
    return (
      <main className="spotifyclone-page">
        <div className="content-container">
          <div className="skeleton-loading" />
        </div>
      </main>
    );
  }

  return (
    <main className="spotifyclone-page">
      <AudioEqualizerBackground darkMode={darkMode} />
      <FloatingMusicIcons />

      <div className="music-cursor" id="music-cursor">♬</div>
      <MusicCursorController />

      <div className="content-container">
        <Link href="/home" className="back-button">
          ←
        </Link>
        <div className="spotifyclone-inner">
          <section className="spotifyclone-left">
            <p className="spotifyclone-year">2024</p>

            <div className="title-row">
              <h1 className="spotifyclone-title">SPOTIFY CLONE</h1>
              <a
                href="https://github.com/kruhela777/SpotifyClone"
                target="_blank"
                rel="noopener noreferrer"
                className="github-icon-link"
                aria-label="Spotify Clone GitHub"
              >
                <FaGithub size={32} />
              </a>
              <a
                href="https://spotifyclone-opal-ten.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="live-link-icon"
                aria-label="Spotify Clone Live Demo"
              >
                LIVE LINK
              </a>
            </div>

            <p className="spotifyclone-tagline">
              "Full-Stack Music Streaming Web App (React)" A fully functional
              Spotify-inspired music streaming application built using React,
              featuring a modern UI, smooth playback experience, dynamic content
              rendering, and seamless backend integration.
            </p>

            <div className="hero-video-container">
              <video
                ref={videoRef}
                className="project-video"
                autoPlay
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/dztthidxb/video/upload/v1767121997/SPOTIFYCLONE-video_tmsh8f.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          <section className="spotifyclone-right">
            <div className="info-block">
              <h2 className="section-heading">DESCRIPTION</h2>
              <div className="body-text">
                <p>
                  A comprehensive music streaming platform built with React,
                  featuring user authentication, playlist management, and
                  real-time audio playback.
                </p>
                <p>
                  Integrated with a backend API for music data and user
                  management, providing a seamless streaming experience.
                </p>
              </div>
            </div>

            <div className="spotifyclone-columns">
              <div className="info-block">
                <h3 className="subheading">TECH STACK</h3>
                <ul className="custom-list">
                  <li>React.js frontend</li>
                  <li>Node.js backend</li>
                  <li>MongoDB database</li>
                  <li>Express.js API</li>
                </ul>
              </div>

              <div className="info-block">
                <h3 className="subheading">HIGHLIGHTS</h3>
                <ul className="custom-list">
                  <li>Real-time audio playback</li>
                  <li>User authentication</li>
                  <li>Playlist management</li>
                  <li>Responsive design</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
