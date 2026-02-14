"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import "./dreampartner.css";

// --- Enhanced Hearts & Twinkle Background ---
function HeartsBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth * dpr;
    let height = window.innerHeight * dpr;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth * dpr;
      height = window.innerHeight * dpr;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    // Cute Color Palette
    const colors = [
      { h: 330, s: 90, l: 70 }, // Pink
      { h: 280, s: 70, l: 75 }, // Lilac
      { h: 350, s: 95, l: 80 }, // Soft Rose
      { h: 0, s: 0, l: 95 },    // Soft White
    ];

    const hearts = Array.from({ length: 40 }, () => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 0.3 + Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        size: 10 + Math.random() * 12,
        alpha: 0.2 + Math.random() * 0.5,
        color: `hsl(${colorBase.h}, ${colorBase.s}%, ${colorBase.l}%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    });

    // Added "Cute Twinkle" Particles
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      blink: Math.random() * Math.PI,
    }));

    function drawHeart(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      rotation: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 20, size / 20);
      ctx.beginPath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      
      // Plumper, cuter heart shape
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-5, -5, -15, -5, -15, 7);
      ctx.bezierCurveTo(-15, 15, 0, 25, 0, 32);
      ctx.bezierCurveTo(0, 25, 15, 15, 15, 7);
      ctx.bezierCurveTo(15, -5, 5, -5, 0, 5);

      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, width, height);

      // Dreamy Background Gradient
      const gradient = context.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.1
      );
      gradient.addColorStop(0, "rgba(35, 10, 30, 1)");
      gradient.addColorStop(0.6, "rgba(10, 5, 15, 1)");
      gradient.addColorStop(1, "rgba(5, 2, 8, 1)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      // Draw Twinkles
      stars.forEach(s => {
        s.blink += 0.03;
        context.globalAlpha = (Math.sin(s.blink) + 1) / 2;
        context.fillStyle = "white";
        context.beginPath();
        context.arc(s.x, s.y, s.size * dpr, 0, Math.PI * 2);
        context.fill();
      });

      // Draw Hearts
      hearts.forEach(h => {
        drawHeart(context, h.x, h.y, h.size, h.color, h.alpha, h.rotation);
        h.y -= h.vy;
        h.x += h.vx + Math.sin(h.y / 60) * 0.4;
        h.rotation += h.rotationSpeed;

        if (h.y < -50) {
          h.y = height + 50;
          h.x = Math.random() * width;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, [darkMode]);

  return <canvas ref={canvasRef} className="dreampartner-bg-canvas" />;
}

function HeartCursorController() {
  useEffect(() => {
    const el = document.getElementById("heart-cursor");
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

export default function DreamPartnerPage() {
  return (
    <main className="dreampartner-page">
      <HeartsBackground darkMode={true} />

      <div className="heart-cursor" id="heart-cursor" />
      <HeartCursorController />

      <div className="dp-content-container">
        <Link href="/home#projects-work" className="dp-back-button">
          ←
        </Link>
        <div className="dp-inner">
          <section className="dp-left">
            <p className="dp-year">2025</p>

            <div className="dp-title-row">
              <h1 className="dp-title">DREAMPARTNER</h1>
              <a
                href="https://github.com/kruhela777/DreamPartner"
                target="_blank"
                rel="noopener noreferrer"
                className="dp-github-icon-link"
                aria-label="Open DreamPartner GitHub repository"
              >
                <FaGithub />
              </a>
            </div>

            <p className="dp-tagline">
              Emotion‑based compatibility website with an integrated game that turns AI‑driven partner
              analysis into an immersive, playful experience.
            </p>

            <div className="dp-hero-video-container">
              <video
                className="dp-project-video"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="https://res.cloudinary.com/dztthidxb/video/upload/v1766933725/DREAMPARTNER_1_hvlhn9.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>

          <section className="dp-right">
            <div className="dp-info-block">
              <h2 className="dp-section-heading">DESCRIPTION</h2>
              <p className="dp-body-text">
                DreamPartner is a web‑based platform that combines an interactive game built with
                Godot Engine and machine learning models trained on emotional datasets to analyze
                and predict partner compatibility.
              </p>
              <p className="dp-body-text">
                It uses a full‑stack architecture with Python on the backend, React.js on the frontend,
                and MySQL for data management, delivering a responsive, engaging, AI‑powered experience
                around relationships and emotions.
              </p>
            </div>

            <div className="dp-columns">
              <div className="dp-info-block">
                <h3 className="dp-subheading">TECH STACK</h3>
                <ul className="dp-custom-list">
                  <li>React.js frontend</li>
                  <li>Python backend</li>
                  <li>TensorFlow &amp; Scikit‑learn</li>
                  <li>Godot Engine (game)</li>
                  <li>MySQL database</li>
                </ul>
              </div>

              <div className="dp-info-block">
                <h3 className="dp-subheading">HIGHLIGHTS</h3>
                <ul className="dp-custom-list">
                  <li>Emotion‑driven compatibility scoring using ML models.</li>
                  <li>Interactive Godot‑based game integrated into the website.</li>
                  <li>End‑to‑end full‑stack flow: Python backend, React.js UI, MySQL data.</li>
                  <li>Responsive, immersive interface tuned for user engagement.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}