import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { generateRockGeometry } from "@/lib/rockGenerator";
import { mergeRockGeometries } from "@/lib/csgMerge";
import { registerRenderer, unregisterRenderer } from "@/hooks/useScreenshotCapture";
import type { RockParams } from "@/types/rockParams";

interface Rock3DPreviewProps {
  params: RockParams;
  seed?: number;
  className?: string;
}

function buildMeshFromGeo(geo: ReturnType<typeof generateRockGeometry>, params: RockParams): THREE.Mesh {
  const bufGeo = new THREE.BufferGeometry();
  bufGeo.setAttribute("position", new THREE.Float32BufferAttribute(geo.positions, 3));
  bufGeo.setAttribute("normal", new THREE.Float32BufferAttribute(geo.normals, 3));
  bufGeo.setAttribute("color", new THREE.Float32BufferAttribute(geo.colors, 3));
  bufGeo.setAttribute("uv", new THREE.Float32BufferAttribute(geo.uvs, 2));
  bufGeo.setAttribute("tangent", new THREE.Float32BufferAttribute(geo.tangents, 4));
  bufGeo.setAttribute("aRoughness", new THREE.Float32BufferAttribute(geo.roughnessMap, 1));
  bufGeo.setAttribute("aMetalness", new THREE.Float32BufferAttribute(geo.metalnessMap, 1));
  bufGeo.setIndex(geo.indices);

  const roughness = (params.roughness as number) ?? 0.88;
  const metalness = (params.metalness as number) ?? 0.02;
  const bumpScale = (params.surfaceBumpScale as number) ?? 0.04;
  const wireframe = (params.wireframe as boolean) ?? false;
  const flatShading = (params.flatShading as boolean) ?? false;

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness,
    metalness,
    side: THREE.FrontSide,
    flatShading,
    wireframe,
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uBumpScale = { value: bumpScale };
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vWorldPos;
      attribute float aRoughness;
      attribute float aMetalness;
      varying float vVertRoughness;
      varying float vVertMetalness;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <worldpos_vertex>",
      `#include <worldpos_vertex>
      vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vVertRoughness = aRoughness;
      vVertMetalness = aMetalness;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vWorldPos;
      varying float vVertRoughness;
      varying float vVertMetalness;
      uniform float uBumpScale;
      float rockHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float rockNoise3(vec3 p) {
        vec3 i = floor(p); vec3 f = fract(p); vec3 u = f*f*(3.0-2.0*f);
        float n000=rockHash(i); float n100=rockHash(i+vec3(1,0,0));
        float n010=rockHash(i+vec3(0,1,0)); float n110=rockHash(i+vec3(1,1,0));
        float n001=rockHash(i+vec3(0,0,1)); float n101=rockHash(i+vec3(1,0,1));
        float n011=rockHash(i+vec3(0,1,1)); float n111=rockHash(i+vec3(1,1,1));
        return mix(mix(mix(n000,n100,u.x),mix(n010,n110,u.x),u.y),mix(mix(n001,n101,u.x),mix(n011,n111,u.x),u.y),u.z);
      }
      float rockFbm(vec3 p, int oct) {
        float v=0.0,a=0.5,f=1.0;
        for(int i=0;i<6;i++){if(i>=oct)break;v+=a*rockNoise3(p*f);f*=2.1;a*=0.48;}
        return v;
      }`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>
      { vec3 wp=vWorldPos; float eps=0.015;
        float c=rockFbm(wp*8.0,5);
        float dx=rockFbm((wp+vec3(eps,0,0))*8.0,5)-c;
        float dy=rockFbm((wp+vec3(0,eps,0))*8.0,5)-c;
        float dz=rockFbm((wp+vec3(0,0,eps))*8.0,5)-c;
        normal=normalize(normal+vec3(dx,dy,dz)*uBumpScale*20.0);
      }`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      { float rN=rockFbm(vWorldPos*12.0,3);
        roughnessFactor=clamp(vVertRoughness+(rN-0.5)*0.15,0.0,1.0);
      }`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <metalnessmap_fragment>",
      `#include <metalnessmap_fragment>
      { metalnessFactor=vVertMetalness; }`
    );
  };

  const mesh = new THREE.Mesh(bufGeo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export default function Rock3DPreview({ params, seed = 42, className = "" }: Rock3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    rockGroup: THREE.Group;
    animFrame: number;
    clock: THREE.Clock;
  } | null>(null);
  const paramsRef = useRef(params);
  const seedRef = useRef(seed);
  paramsRef.current = params;
  seedRef.current = seed;

  const { viewportSettings, savedRocks, sceneRocks } = useProVegLayout();
  const viewportRef = useRef(viewportSettings);
  viewportRef.current = viewportSettings;
  const savedRocksRef = useRef(savedRocks);
  const sceneRocksRef = useRef(sceneRocks);
  savedRocksRef.current = savedRocks;
  sceneRocksRef.current = sceneRocks;

  const buildRock = useCallback(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    // Clear existing
    while (ctx.rockGroup.children.length) {
      const child = ctx.rockGroup.children[0] as THREE.Mesh;
      ctx.rockGroup.remove(child);
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) child.material.dispose();
    }

    const p = paramsRef.current;
    const csgEnabled = (p.csgEnabled as boolean) && sceneRocksRef.current.length > 0;

    if (csgEnabled && sceneRocksRef.current.length > 0) {
      // Multi-rock CSG scene
      const rockGeos = sceneRocksRef.current.map(sr => {
        const saved = savedRocksRef.current.find(r => r.id === sr.savedRockId);
        if (!saved) return null;
        const geo = generateRockGeometry(saved.params, saved.seed);
        return { geometry: geo, offset: sr.position as [number,number,number] };
      }).filter(Boolean) as { geometry: ReturnType<typeof generateRockGeometry>; offset: [number,number,number] }[];

      if (rockGeos.length > 0) {
        const merged = mergeRockGeometries(rockGeos, p);
        const mesh = buildMeshFromGeo(merged, p);
        ctx.rockGroup.add(mesh);
      }
    } else if (sceneRocksRef.current.length > 0 && !csgEnabled) {
      // Render scene rocks individually
      for (const sr of sceneRocksRef.current) {
        const saved = savedRocksRef.current.find(r => r.id === sr.savedRockId);
        if (!saved) continue;
        const geo = generateRockGeometry(saved.params, saved.seed);
        const mesh = buildMeshFromGeo(geo, saved.params);
        mesh.position.set(...sr.position);
        mesh.rotation.set(...sr.rotation);
        mesh.scale.setScalar(sr.scale);
        ctx.rockGroup.add(mesh);
      }
    }

    // Always render the current "editor" rock
    const mainGeo = generateRockGeometry(p, seedRef.current);
    const mainMesh = buildMeshFromGeo(mainGeo, p);
    ctx.rockGroup.add(mainMesh);

    // Fit camera
    const scale = (p.scale as number) || 1.5;
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

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
      console.warn("Rock3DPreview: WebGL context unavailable", e);
      return;
    }
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

    const rockGroup = new THREE.Group();
    scene.add(rockGroup);

    const clock = new THREE.Clock();
    sceneRef.current = { scene, camera, renderer, controls, rockGroup, animFrame: 0, clock };

    // Register for screenshot capture
    registerRenderer(renderer, scene, camera, controls);

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
        while (ctx.rockGroup.children.length) {
          const child = ctx.rockGroup.children[0] as THREE.Mesh;
          ctx.rockGroup.remove(child);
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
        container.removeChild(ctx.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => { buildRock(); }, [params, seed, savedRocks, sceneRocks, buildRock]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.scene.background = new THREE.Color(viewportSettings.backgroundColor);
    if (ctx.scene.fog instanceof THREE.FogExp2) ctx.scene.fog.color.set(viewportSettings.backgroundColor);
    ctx.renderer.toneMappingExposure = viewportSettings.exposure;
  }, [viewportSettings]);

  const showNormals = (params.showNormals as boolean) ?? false;
  const showUVs = (params.showUVs as boolean) ?? false;
  const csgEnabled = (params.csgEnabled as boolean) ?? false;

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ position: "absolute", inset: 0 }}>
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
        <span className="text-[10px] font-mono text-editor-text-dim">Seed: {seed}</span>
        <span className="text-[10px] font-mono text-editor-text-dim">Rock Editor</span>
        {csgEnabled && <span className="text-[10px] font-mono text-emerald-400">CSG Merge Active</span>}
        {showNormals && <span className="text-[10px] font-mono text-amber-400">Normal Debug</span>}
        {showUVs && <span className="text-[10px] font-mono text-cyan-400">UV Debug</span>}
      </div>
    </div>
  );
}
