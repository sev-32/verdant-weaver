import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { generateTreeGeometry } from "@/lib/treeGenerator";
import { registerRenderer, unregisterRenderer } from "@/hooks/useScreenshotCapture";
import type { TreeParams } from "@/types/treeParams";

interface Tree3DPreviewProps {
  params: TreeParams;
  seed?: number;
  isPlaying?: boolean;
  className?: string;
  showOverlay?: boolean;
}

export default function Tree3DPreview({
  params,
  seed = 1337,
  isPlaying = false,
  className = "",
  showOverlay = true,
}: Tree3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    woodMesh: THREE.Mesh | null;
    leafMesh: THREE.Mesh | null;
    woodShader: any;
    leafShader: any;
    animFrame: number;
    clock: THREE.Clock;
  } | null>(null);
  const paramsRef = useRef(params);
  const seedRef = useRef(seed);
  const playingRef = useRef(isPlaying);

  paramsRef.current = params;
  seedRef.current = seed;
  playingRef.current = isPlaying;

  const { viewportSettings } = useProVegLayout();
  const viewportRef = useRef(viewportSettings);
  viewportRef.current = viewportSettings;

  const buildTree = useCallback(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    // Remove old meshes
    if (ctx.woodMesh) { ctx.scene.remove(ctx.woodMesh); ctx.woodMesh.geometry.dispose(); }
    if (ctx.leafMesh) { ctx.scene.remove(ctx.leafMesh); ctx.leafMesh.geometry.dispose(); }

    const geo = generateTreeGeometry(paramsRef.current, seedRef.current);
    const treeHeight = geo.meta.height;

    // Wood mesh
    if (geo.wood.positions.length > 0) {
      const woodGeo = new THREE.BufferGeometry();
      woodGeo.setAttribute("position", new THREE.Float32BufferAttribute(geo.wood.positions, 3));
      woodGeo.setAttribute("normal", new THREE.Float32BufferAttribute(geo.wood.normals, 3));
      woodGeo.setAttribute("color", new THREE.Float32BufferAttribute(geo.wood.colors, 3));
      woodGeo.setIndex(geo.wood.indices);
      woodGeo.computeVertexNormals();

      const woodMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.88,
        metalness: 0.0,
        side: THREE.FrontSide,
      });

      // Inject wind into vertex shader
      woodMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uWindStrength = { value: 0.6 };
        shader.uniforms.uTreeHeight = { value: treeHeight };
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          uniform float uWindStrength;
          uniform float uTreeHeight;`
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float windH = max(0.0, transformed.y) / max(1.0, uTreeHeight);
          float windEffect = windH * windH;
          float phase = transformed.x * 0.3 + transformed.z * 0.2;
          transformed.x += sin(uTime * 1.2 + phase + transformed.y * 0.4) * windEffect * uWindStrength * 0.15;
          transformed.z += cos(uTime * 0.9 + phase * 1.3 + transformed.y * 0.3) * windEffect * uWindStrength * 0.1;
          transformed.x += sin(uTime * 2.8 + transformed.y * 1.2) * windEffect * windH * uWindStrength * 0.04;`
        );
        ctx.woodShader = shader;
      };

      ctx.woodMesh = new THREE.Mesh(woodGeo, woodMat);
      ctx.woodMesh.castShadow = true;
      ctx.woodMesh.receiveShadow = true;
      ctx.scene.add(ctx.woodMesh);
    }

    // Leaf mesh
    if (geo.leaves.positions.length > 0) {
      const leafGeo = new THREE.BufferGeometry();
      leafGeo.setAttribute("position", new THREE.Float32BufferAttribute(geo.leaves.positions, 3));
      leafGeo.setAttribute("normal", new THREE.Float32BufferAttribute(geo.leaves.normals, 3));
      leafGeo.setAttribute("color", new THREE.Float32BufferAttribute(geo.leaves.colors, 3));
      leafGeo.setIndex(geo.leaves.indices);

      const leafMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.65,
        metalness: 0.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
        alphaTest: 0.1,
      });

      leafMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uWindStrength = { value: 0.6 };
        shader.uniforms.uTreeHeight = { value: treeHeight };
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          uniform float uWindStrength;
          uniform float uTreeHeight;`
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float windH = max(0.0, transformed.y) / max(1.0, uTreeHeight);
          float windEffect = windH * windH;
          float phase = transformed.x * 0.5 + transformed.z * 0.3;
          transformed.x += sin(uTime * 1.2 + phase + transformed.y * 0.4) * windEffect * uWindStrength * 0.18;
          transformed.z += cos(uTime * 0.9 + phase * 1.3 + transformed.y * 0.3) * windEffect * uWindStrength * 0.12;
          // Leaf flutter
          float flutter = sin(uTime * 4.5 + phase * 3.0 + transformed.y * 2.0) * 0.02 * uWindStrength * windH;
          transformed.x += flutter;
          transformed.y += flutter * 0.5;`
        );
        ctx.leafShader = shader;
      };

      ctx.leafMesh = new THREE.Mesh(leafGeo, leafMat);
      ctx.leafMesh.castShadow = true;
      ctx.leafMesh.receiveShadow = true;
      ctx.scene.add(ctx.leafMesh);
    }

    // Adjust camera to fit tree
    const targetY = treeHeight * 0.35;
    ctx.controls.target.set(0, targetY, 0);
    ctx.camera.position.set(treeHeight * 0.8, targetY + treeHeight * 0.3, treeHeight * 1.2);
    ctx.controls.update();
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(viewportRef.current.backgroundColor);
    scene.fog = new THREE.FogExp2(viewportRef.current.backgroundColor, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    camera.position.set(8, 5, 12);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (e) {
      console.warn("Tree3DPreview: WebGL context unavailable", e);
      return;
    }
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = viewportRef.current.exposure;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 3, 0);
    controls.minDistance = 2;
    controls.maxDistance = 50;

    // Lights
    const ambient = new THREE.AmbientLight(
      viewportRef.current.ambientLightColor,
      viewportRef.current.ambientLightIntensity
    );
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(
      viewportRef.current.mainLightColor,
      viewportRef.current.mainLightIntensity
    );
    mainLight.position.set(...viewportRef.current.mainLightPosition);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -5;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(
      viewportRef.current.fillLightColor,
      viewportRef.current.fillLightIntensity
    );
    fillLight.position.set(...viewportRef.current.fillLightPosition);
    scene.add(fillLight);

    const hemi = new THREE.HemisphereLight(
      viewportRef.current.hemiSkyColor,
      viewportRef.current.hemiGroundColor,
      viewportRef.current.hemiIntensity
    );
    scene.add(hemi);

    // Ground plane
    const groundGeo = new THREE.CircleGeometry(20, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a1a,
      roughness: 0.95,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper (subtle)
    const grid = new THREE.GridHelper(40, 40, 0x1a3a2a, 0x0f1f0f);
    grid.position.y = 0;
    (grid.material as THREE.Material).opacity = 0.3;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    const clock = new THREE.Clock();

    sceneRef.current = {
      scene, camera, renderer, controls,
      woodMesh: null, leafMesh: null,
      woodShader: null, leafShader: null,
      animFrame: 0, clock,
    };

    // Register for screenshot capture
    registerRenderer(renderer, scene, camera, controls);

    // Build initial tree
    buildTree();

    // Animation loop
    const animate = () => {
      const ctx = sceneRef.current;
      if (!ctx) return;
      ctx.animFrame = requestAnimationFrame(animate);
      ctx.controls.update();

      const elapsed = ctx.clock.getElapsedTime();

      if (playingRef.current) {
        const ws = (paramsRef.current.windStrength as number) ?? 0.6;
        if (ctx.woodShader) {
          ctx.woodShader.uniforms.uTime.value = elapsed;
          ctx.woodShader.uniforms.uWindStrength.value = ws;
        }
        if (ctx.leafShader) {
          ctx.leafShader.uniforms.uTime.value = elapsed;
          ctx.leafShader.uniforms.uWindStrength.value = ws;
        }
      }

      ctx.renderer.render(ctx.scene, ctx.camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const ctx = sceneRef.current;
      if (!ctx || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      ctx.camera.aspect = w / h;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(w, h);
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
        if (ctx.woodMesh) ctx.woodMesh.geometry.dispose();
        if (ctx.leafMesh) ctx.leafMesh.geometry.dispose();
        container.removeChild(ctx.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []); // Mount once

  // Rebuild tree on params/seed change
  useEffect(() => {
    buildTree();
  }, [params, seed, buildTree]);

  // Update viewport settings
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.scene.background = new THREE.Color(viewportSettings.backgroundColor);
    if (ctx.scene.fog instanceof THREE.FogExp2) {
      ctx.scene.fog.color.set(viewportSettings.backgroundColor);
    }
    ctx.renderer.toneMappingExposure = viewportSettings.exposure;
  }, [viewportSettings]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ position: "absolute", inset: 0 }}>
      {showOverlay && (
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
          <span className="text-[10px] font-mono text-editor-text-dim">
            Seed: {seed}
          </span>
          <span className="text-[10px] font-mono text-editor-text-dim">
            {isPlaying ? "▶ Wind active" : "⏸ Wind paused"}
          </span>
        </div>
      )}
    </div>
  );
}
