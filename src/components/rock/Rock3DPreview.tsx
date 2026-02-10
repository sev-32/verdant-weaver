import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { generateRockGeometry } from "@/lib/rockGenerator";
import type { RockParams } from "@/types/rockParams";

interface Rock3DPreviewProps {
  params: RockParams;
  seed?: number;
  className?: string;
}

export default function Rock3DPreview({ params, seed = 42, className = "" }: Rock3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    rockMesh: THREE.Mesh | null;
    animFrame: number;
    clock: THREE.Clock;
  } | null>(null);
  const paramsRef = useRef(params);
  const seedRef = useRef(seed);
  paramsRef.current = params;
  seedRef.current = seed;

  const { viewportSettings } = useProVegLayout();
  const viewportRef = useRef(viewportSettings);
  viewportRef.current = viewportSettings;

  const buildRock = useCallback(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    if (ctx.rockMesh) {
      ctx.scene.remove(ctx.rockMesh);
      ctx.rockMesh.geometry.dispose();
    }

    const geo = generateRockGeometry(paramsRef.current, seedRef.current);

    const bufGeo = new THREE.BufferGeometry();
    bufGeo.setAttribute("position", new THREE.Float32BufferAttribute(geo.positions, 3));
    bufGeo.setAttribute("normal", new THREE.Float32BufferAttribute(geo.normals, 3));
    bufGeo.setAttribute("color", new THREE.Float32BufferAttribute(geo.colors, 3));
    bufGeo.setIndex(geo.indices);

    const roughness = (paramsRef.current.roughness as number) ?? 0.88;
    const metalness = (paramsRef.current.metalness as number) ?? 0.02;

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness,
      metalness,
      side: THREE.FrontSide,
      flatShading: false,
    });

    ctx.rockMesh = new THREE.Mesh(bufGeo, mat);
    ctx.rockMesh.castShadow = true;
    ctx.rockMesh.receiveShadow = true;
    ctx.scene.add(ctx.rockMesh);

    // Fit camera
    const scale = (paramsRef.current.scale as number) || 1.5;
    const dist = scale * 3;
    ctx.controls.target.set(0, scale * 0.3, 0);
    ctx.camera.position.set(dist * 0.8, dist * 0.5, dist);
    ctx.controls.update();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(viewportRef.current.backgroundColor);
    scene.fog = new THREE.FogExp2(viewportRef.current.backgroundColor, 0.02);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    camera.position.set(4, 2.5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = viewportRef.current.exposure;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.5, 0);
    controls.minDistance = 1;
    controls.maxDistance = 30;

    // Lights
    const ambient = new THREE.AmbientLight(viewportRef.current.ambientLightColor, viewportRef.current.ambientLightIntensity);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(viewportRef.current.mainLightColor, viewportRef.current.mainLightIntensity);
    mainLight.position.set(...viewportRef.current.mainLightPosition);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -5;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(viewportRef.current.fillLightColor, viewportRef.current.fillLightIntensity);
    fillLight.position.set(...viewportRef.current.fillLightPosition);
    scene.add(fillLight);

    const hemi = new THREE.HemisphereLight(viewportRef.current.hemiSkyColor, viewportRef.current.hemiGroundColor, viewportRef.current.hemiIntensity);
    scene.add(hemi);

    // Ground
    const groundGeo = new THREE.CircleGeometry(15, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(30, 30, 0x2a2a2e, 0x151518);
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    const clock = new THREE.Clock();

    sceneRef.current = {
      scene, camera, renderer, controls,
      rockMesh: null, animFrame: 0, clock,
    };

    buildRock();

    const animate = () => {
      const ctx = sceneRef.current;
      if (!ctx) return;
      ctx.animFrame = requestAnimationFrame(animate);
      ctx.controls.update();
      ctx.renderer.render(ctx.scene, ctx.camera);
    };
    animate();

    const onResize = () => {
      const ctx = sceneRef.current;
      if (!ctx || !container) return;
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      if (w2 === 0 || h2 === 0) return;
      ctx.camera.aspect = w2 / h2;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(w2, h2);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      const ctx = sceneRef.current;
      if (ctx) {
        cancelAnimationFrame(ctx.animFrame);
        ctx.renderer.dispose();
        ctx.controls.dispose();
        if (ctx.rockMesh) ctx.rockMesh.geometry.dispose();
        container.removeChild(ctx.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => { buildRock(); }, [params, seed, buildRock]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.scene.background = new THREE.Color(viewportSettings.backgroundColor);
    if (ctx.scene.fog instanceof THREE.FogExp2) ctx.scene.fog.color.set(viewportSettings.backgroundColor);
    ctx.renderer.toneMappingExposure = viewportSettings.exposure;
  }, [viewportSettings]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ position: "absolute", inset: 0 }}>
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
        <span className="text-[10px] font-mono text-editor-text-dim">Seed: {seed}</span>
        <span className="text-[10px] font-mono text-editor-text-dim">Rock Editor</span>
      </div>
    </div>
  );
}
