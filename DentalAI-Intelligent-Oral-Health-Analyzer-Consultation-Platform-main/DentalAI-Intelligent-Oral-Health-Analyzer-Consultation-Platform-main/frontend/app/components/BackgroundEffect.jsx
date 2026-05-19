"use client";

import { useEffect, useRef } from "react";

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const mouse = { x: -9999, y: -9999 };
    const MOUSE_RADIUS = 200;
    const NODE_COUNT = 90;
    const MAX_DIST = 160;
    const DOT_RADIUS = 2.5;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      baseVx: (Math.random() - 0.5) * 0.45,
      baseVy: (Math.random() - 0.5) * 0.45,
      r: DOT_RADIUS + Math.random() * 1.2,
    }));

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          node.vx += (dx / dist) * force * 0.14;
          node.vy += (dy / dist) * force * 0.14;
        }

        node.vx = node.vx * 0.91 + node.baseVx * 0.09;
        node.vy = node.vy * 0.91 + node.baseVy * 0.09;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 2.8) {
          node.vx = (node.vx / speed) * 2.8;
          node.vy = (node.vy / speed) * 2.8;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) { node.x = 0; node.vx *= -1; node.baseVx *= -1; }
        if (node.x > w) { node.x = w; node.vx *= -1; node.baseVx *= -1; }
        if (node.y < 0) { node.y = 0; node.vy *= -1; node.baseVy *= -1; }
        if (node.y > h) { node.y = h; node.vy *= -1; node.baseVy *= -1; }
      }

      // Node-to-node lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 185, 215, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse-to-node lines
      const inCanvas = mouse.x > 0 && mouse.x < w && mouse.y > 0 && mouse.y < h;
      if (inCanvas) {
        for (const node of nodes) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.7;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 160, 205, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        }

        // Mouse dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 145, 195, 0.85)";
        ctx.fill();
      }

      // Node dots
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const nearMouse = Math.sqrt(dx * dx + dy * dy) < MOUSE_RADIUS;

        if (nearMouse) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 160, 210, 0.18)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = nearMouse
          ? "rgba(0, 115, 170, 1)"
          : "rgba(0, 145, 185, 0.85)";
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",      // ← stays put while scrolling
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #dff6fb 0%, #c8eef5 40%, #ddeeff 100%)",
        zIndex: 0,
        display: "block",
        pointerEvents: "none", // ← lets clicks pass through to your content
      }}
    />
  );
}