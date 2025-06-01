"use client";

import { useEffect, useRef } from "react";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: any, animationId: number;
    let particlesMesh: any, camera: any, scene: any;
    //let mouseX = 0, mouseY = 0;

    import("three").then(THREE => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 150;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x64ffda,
        transparent: true,
        opacity: 0.6,
      });

      particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      camera.position.z = 3;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener("resize", handleResize);
      //   document.addEventListener('mousemove', handleMouseMove);

      function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      //   function handleMouseMove(event: MouseEvent) {
      //     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      //     mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      //     if (particlesMesh) {
      //       particlesMesh.rotation.x = mouseY * 0.1;
      //       particlesMesh.rotation.y = mouseX * 0.1;
      //     }
      //   }

      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
        // document.removeEventListener('mousemove', handleMouseMove);
        if (renderer && renderer.domElement && mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    });
  }, []);

  return (
    <div
      id="background"
      ref={mountRef}
      style={{
        position: "fixed",
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeBackground;
