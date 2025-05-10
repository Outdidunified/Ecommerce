import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticleBackground = () => {
  const particlesInit = async (main) => {
    // This loads the tsParticles configuration for react-tsparticles
    await loadFull(main);
  };

  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: 0, // Ensure particles are behind other content
    },
    particles: {
      number: {
        value: 50, // Number of particles
        density: {
          enable: true,
          value_area: 800,
        },
      },
      shape: {
        type: 'circle', // The shape of the particles
      },
      size: {
        value: 5, // Size of particles
        random: true,
      },
      opacity: {
        value: 0.5, // Transparency of particles
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none', // Random direction
        random: true,
        straight: false,
        out_mode: 'out',
      },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
    />
  );
};

export default ParticleBackground;
