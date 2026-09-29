import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeOrbViewer({ orbId = 'nexus_cyber', height = 340, interactive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 340;
    const h = height;

    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 100);
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.4, 20);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    let rimColor = 0x00a3a3;
    if (orbId === 'aura_quantum') rimColor = 0xb026ff;
    if (orbId === 'scifi_crimson') rimColor = 0xef4444;
    if (orbId === 'liquid_cobalt') rimColor = 0x3b82f6;
    if (orbId === 'solar_amber') rimColor = 0xf59e0b;

    const rimLight = new THREE.DirectionalLight(rimColor, 2.2);
    rimLight.position.set(-4, -2, -5);
    scene.add(rimLight);

    // 3. Mesh creation based on Orb Spec
    let mesh;
    const textureLoader = new THREE.TextureLoader();

    if (orbId === 'aura_quantum') {
      // 🟣 Aura Quantum (Viola Icosaedro Cristallo Sfaccettato Procedurale)
      const geometry = new THREE.IcosahedronGeometry(1.95, 3).toNonIndexed();
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#350858'),
        emissive: new THREE.Color('#1c0036'),
        emissiveIntensity: 0.6,
        sheen: 1.0,
        sheenColor: new THREE.Color('#f0abfc'),
        sheenRoughness: 0.2,
        roughness: 0.08,
        metalness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        iridescence: 0.75,
        iridescenceIOR: 1.6,
        flatShading: true
      });
      mesh = new THREE.Mesh(geometry, material);
    } else if (orbId === 'nexus_cyber') {
      // 🟢 Nexus Cyber (Marmo Smeraldo & Oro 24K PBR)
      const geometry = new THREE.SphereGeometry(2.0, 64, 64);
      const baseMap = textureLoader.load('/textures/marmo-smeraldo-base.jpg');
      baseMap.colorSpace = THREE.SRGBColorSpace;
      const metalMap = textureLoader.load('/textures/marmo-smeraldo-metallicita.jpg');
      const roughMap = textureLoader.load('/textures/marmo-smeraldo-ruvidita.jpg');

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: baseMap,
        metalnessMap: metalMap,
        roughnessMap: roughMap,
        roughness: 0.16,
        metalness: 0.90,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15
      });
      mesh = new THREE.Mesh(geometry, material);
    } else if (orbId === 'scifi_crimson') {
      // 🔴 Crimson Cyber Core
      const geometry = new THREE.SphereGeometry(2.0, 64, 64);
      const baseMap = textureLoader.load('/textures/scifi_red/scifi_red_basecolor.jpg');
      baseMap.colorSpace = THREE.SRGBColorSpace;
      const emissionMap = textureLoader.load('/textures/scifi_red/scifi_red_emission.jpg');

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: baseMap,
        emissiveMap: emissionMap,
        emissive: new THREE.Color('#ef4444'),
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.85,
        clearcoat: 1.0
      });
      mesh = new THREE.Mesh(geometry, material);
    } else if (orbId === 'liquid_cobalt') {
      // 🔵 Liquid Cobalt (Metallo Liquido Cromo Blu)
      const geometry = new THREE.SphereGeometry(2.0, 64, 64);
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1e3a8a'),
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        iridescence: 0.8,
        iridescenceIOR: 1.8
      });
      mesh = new THREE.Mesh(geometry, material);
    } else {
      // 🟡 Solar Amber Luxe
      const geometry = new THREE.SphereGeometry(2.0, 64, 64);
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d97706'),
        emissive: new THREE.Color('#451a03'),
        emissiveIntensity: 0.3,
        roughness: 0.12,
        metalness: 0.92,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        sheen: 0.8,
        sheenColor: new THREE.Color('#fef08a')
      });
      mesh = new THREE.Mesh(geometry, material);
    }

    scene.add(mesh);

    // 4. Interaction (Mouse / Touch Drag Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0.004, y: 0.002 };

    const onPointerDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging || !mesh) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mesh.rotation.y += deltaX * 0.008;
      mesh.rotation.x += deltaY * 0.008;

      velocity = { x: deltaX * 0.004, y: deltaY * 0.004 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    // 5. Animation loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (mesh) {
        if (!isDragging) {
          mesh.rotation.y += 0.006 + velocity.x;
          mesh.rotation.x += 0.002 + velocity.y;
          velocity.x *= 0.95;
          velocity.y *= 0.95;
        }

        // Gentle breathing pulse
        const pulse = Math.sin(elapsedTime * 1.5) * 0.025;
        mesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 340;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      }
    };
  }, [orbId, height, interactive]);

  return (
    <div
      ref={mountRef}
      className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
      style={{ height: `${height}px` }}
    />
  );
}
