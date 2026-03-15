"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 3800;
type Cleanup = (() => void) | null;
const ARM_COUNT = 4;
const SPIRAL_TURNS = 2.2;
const SPREAD = 4.2;
const CORE_RADIUS = 0.8;
const FAR_COUNT = 800;

const PALETTE_HEX = [
  0x6b7fff, 0x8b5cf6, 0xa78bfa, 0x818cf8,
  0xc4b5fd, 0xffffff, 0x93c5fd, 0xbfdbfe,
];

export default function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<Cleanup>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let animationId: number;
    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let galaxy: import("three").Points;
    let farStars: import("three").Points;
    let galaxyGeom: import("three").BufferGeometry;
    let origPositions: Float32Array;
    let clock: { getElapsedTime: () => number; getDelta: () => number };
    let scrollProgress = 0;
    let targetScroll = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };

    void import("three").then((THREE) => {
      const container = containerRef.current!;
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x030308);

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        500
      );
      camera.position.set(0, 0, 28);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      const positions = new Float32Array(PARTICLE_COUNT * 3);
      origPositions = new Float32Array(PARTICLE_COUNT * 3);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const randoms = new Float32Array(PARTICLE_COUNT * 2);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const arm = Math.floor(Math.random() * ARM_COUNT);
        const t = Math.random();
        const angle =
          (arm / ARM_COUNT) * Math.PI * 2 +
          t * Math.PI * 2 * SPIRAL_TURNS +
          (Math.random() - 0.5) * 0.8;
        const r =
          CORE_RADIUS + t * SPREAD + (Math.random() - 0.5) * 0.5;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        const z = (Math.random() - 0.5) * 4;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        origPositions[i * 3] = x;
        origPositions[i * 3 + 1] = y;
        origPositions[i * 3 + 2] = z;

        const c = new THREE.Color(
          PALETTE_HEX[Math.floor(Math.random() * PALETTE_HEX.length)]
        );
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        randoms[i * 2] = angle;
        randoms[i * 2 + 1] = Math.random();
      }

      galaxyGeom = new THREE.BufferGeometry();
      galaxyGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      galaxyGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      galaxyGeom.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 2));

      const galaxyMat = new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      galaxy = new THREE.Points(galaxyGeom, galaxyMat);
      scene.add(galaxy);

      const farPos = new Float32Array(FAR_COUNT * 3);
      const farColors = new Float32Array(FAR_COUNT * 3);
      for (let i = 0; i < FAR_COUNT; i++) {
        farPos[i * 3] = (Math.random() - 0.5) * 60;
        farPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
        farPos[i * 3 + 2] = -15 - Math.random() * 35;
        const c = new THREE.Color(
          PALETTE_HEX[Math.floor(Math.random() * PALETTE_HEX.length)]
        );
        farColors[i * 3] = c.r;
        farColors[i * 3 + 1] = c.g;
        farColors[i * 3 + 2] = c.b;
      }
      const farGeom = new THREE.BufferGeometry();
      farGeom.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
      farGeom.setAttribute("color", new THREE.BufferAttribute(farColors, 3));
      farStars = new THREE.Points(
        farGeom,
        new THREE.PointsMaterial({
          size: 0.12,
          vertexColors: true,
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      scene.add(farStars);

      const onResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = 1 - e.clientY / window.innerHeight;
      };
      const onScroll = () => {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        targetScroll = window.scrollY / maxScroll;
      };

      window.addEventListener("resize", onResize);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("scroll", onScroll, { passive: true });

      function animate() {
        animationId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        scrollProgress += (targetScroll - scrollProgress) * 0.04;
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;

        const camZ = 28 - scrollProgress * 42;
        camera.position.z = camZ;
        camera.lookAt(0, 0, camZ - 5);

        galaxy.rotation.z = t * 0.018;
        farStars.rotation.z = t * 0.012;

        const mx = (smoothMouse.x - 0.5) * 2.5;
        const my = (smoothMouse.y - 0.5) * 2.5;
        const posAttr = galaxyGeom.attributes.position;
        if (posAttr?.array) {
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const px = origPositions[ix];
            const py = origPositions[ix + 1];
            const dx = mx - px;
            const dy = my - py;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
            const force = 0.022 / (1 + dist * 1.5);
            (posAttr.array as Float32Array)[ix] = px + dx * force;
            (posAttr.array as Float32Array)[ix + 1] = py + dy * force;
            (posAttr.array as Float32Array)[ix + 2] = origPositions[ix + 2];
          }
          posAttr.needsUpdate = true;
        }

        renderer.render(scene, camera);
      }
      animate();

      const cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
      cleanupRef.current = cleanup;
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -50, pointerEvents: "none" }}
      aria-hidden
    />
  );
}
