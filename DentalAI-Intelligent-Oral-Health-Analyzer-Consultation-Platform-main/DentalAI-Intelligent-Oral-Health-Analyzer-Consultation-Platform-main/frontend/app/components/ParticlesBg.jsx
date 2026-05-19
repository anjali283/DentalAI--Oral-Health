"use client";

import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function ParticlesBg() {

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0,   // IMPORTANT CHANGE
        },
        background: {
          color: "#cfe8ef", // slightly darker
        },
        particles: {
          number: { value: 80 },
          color: { value: "#0284c7" }, // darker blue
          links: {
            enable: true,
            distance: 140,
            color: "#0284c7",
            opacity: 0.5,   // INCREASED
            width: 1.2,
          },
          move: {
            enable: true,
            speed: 1.5,
          },
          size: { value: 3 },
          opacity: { value: 0.8 }, // INCREASED
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.8,
              },
            },
          },
        },
      }}
    />
  );
}