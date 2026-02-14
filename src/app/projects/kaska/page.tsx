"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import "./kaska.css";

// --- Green Cursor Controller ---
function GreenCursorController() {
  useEffect(() => {
    const el = document.getElementById("green-cursor");
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

function NeuronBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Skip if not mounted on client
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;
    const neurons: any[] = [];
    const neuronCount = 60;

    const resize = () => {
      width = window.innerWidth * dpr;
      height = window.innerHeight * dpr;
      canvas.width = width;
      canvas.height = height;
    };

    const init = () => {
      resize();
      neurons.length = 0;
      const colors = ["#ffffff", "#00aaff", "#00cccc"];

      for (let i = 0; i < neuronCount; i++) {
        neurons.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          r: Math.random() * 2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 120 * dpr;

      // Connections
      for (let i = 0; i < neuronCount; i++) {
        for (let j = i + 1; j < neuronCount; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            ctx.save();
            ctx.globalAlpha = 0.8 - dist / maxDist;
            ctx.strokeStyle = neurons[i].color;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Nodes & Movement
      for (const neuron of neurons) {
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = neuron.color;
        ctx.shadowColor = neuron.color;
        ctx.shadowBlur = 10 * dpr;
        ctx.fill();

        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        if (neuron.x < 0 || neuron.x > width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > height) neuron.vy *= -1;
      }

      rafId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="neuron-bg-canvas" aria-hidden="true" />;
}

export default function KaskaPage() {
  const [darkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="kaska-page">
        <div className="content-container">
          <div className="skeleton-loading" />
        </div>
      </main>
    );
  }

  return (
    <main className="kaska-page">
      <NeuronBackground darkMode={darkMode} />

      <div className="green-cursor" id="green-cursor" />
      <GreenCursorController />

      <div className="content-container">
        <Link href="/home#projects-work" className="back-button">
          ←
        </Link>
        <div className="kaska-inner">
          <section className="kaska-left">
            <div className="hero-video-container">
              <video
                className="project-video"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://res.cloudinary.com/dztthidxb/video/upload/v1767122007/KASKA-video_yrz3eh.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </section>

          <section className="kaska-right">
            <p className="kaska-year">2025</p>

            <div className="title-row">
              <h1 className="kaska-title">KASKA</h1>
              <a
                href="https://github.com/kruhela777/KASKA"
                target="_blank"
                rel="noopener noreferrer"
                className="github-icon-link"
                aria-label="Kaska GitHub"
              >
                <FaGithub size={32} />
              </a>
            </div>

            <p className="kaska-tagline">
              "Modern Android Application" — A comprehensive platform built with
              cutting-edge technologies for optimal performance and user experience.
            </p>

            <div className="info-block">
              <h2 className="section-heading">DESCRIPTION</h2>
              <div className="body-text">
                <p>Kaska is a modern android application designed to provide exceptional user experiences with innovative features and seamless functionality.</p>
                <p>Built with performance and scalability in mind, offering a robust platform for various digital needs.</p>
              </div>
            </div>

            <div className="kaska-columns">
              <div className="info-block">
                <h3 className="subheading">TECH STACK</h3>
                <ul className="custom-list">
                  <li>Android Application Development / Next.js</li>
                  <li>Python Backend</li>
                  <li>JAVA Frameworks</li>
                  <li>Android Studio</li>
                </ul>
              </div>

              <div className="info-block">
                <h3 className="subheading">HIGHLIGHTS</h3>
                <ul className="custom-list">
                  <li>Responsive design</li>
                  <li>Modern UI/UX</li>
                  <li>Performance optimized</li>
                  <li>Scalable architecture</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}