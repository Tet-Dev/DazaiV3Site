import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  BrightnessContrast,
  SSAO,
} from "@react-three/postprocessing";
import { MathUtils } from "three";
import { SpotLightShadow, SpotLight } from "@react-three/drei";
import { Crate } from "./Crate";
import { CrateCamera } from "./CrateCamera";
import { useState, useEffect, Suspense } from "react";
import { CrateTimer } from "../../utils/classes/CrateTimer";

export const CrateCanvas = () => {
  const [brightness, setBrightness] = useState(0);
  useEffect(() => {
    const openSequenceListener = async () => {
      for (let i = 0; i < 100; i++) {
        await new Promise((res) => setTimeout(res, 10));
        setBrightness((prev) => prev + 0.01);
      }
    };
    CrateTimer.getInstance().on("crateOpen", openSequenceListener);
    return () => {
      CrateTimer.getInstance().off("crateOpen", openSequenceListener);
    };
  }, []);
  return (
    <Suspense
      fallback={
        <div className={`pt-[66%] font-wsans text-3xl`}>
          Loading Crate Render
        </div>
      }
    >
      <Canvas className={`!h-screen`} shadows="soft">
        <color attach="background" args={["#a182ff"]} />
        <fog attach="fog" args={["#a182ff", 4, 20]} />
        <ambientLight intensity={0.25} />
        <SpotLight
          distance={40}
          intensity={1}
          angle={MathUtils.degToRad(45)}
          color={"#b00c3f"}
          position={[6, 5, 4]}
          // target={}
          volumetric={false}
          // debug
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-radius={1}
          penumbra={1}
        >
          <SpotLightShadow
            scale={100}
            distance={40}
            width={4096}
            height={4096}
            shader={`
          varying vec2 vUv;
          uniform sampler2D uShadowMap;
          uniform float uTime;
          void main() {
            // material.repeat.set(2.5) - Since repeat is a shader feature not texture
            // we need to implement it manually
            vec2 uv = mod(vUv, 0.4) * 2.5;

            // Fake wind distortion
            uv.x += sin(uv.y * 10.0 + uTime * 0.5) * 0.02;
            uv.y += sin(uv.x * 10.0 + uTime * 0.5) * 0.02;
            
            vec3 color = texture2D(uShadowMap, uv).xyz;
            gl_FragColor = vec4(color, 1.);
          }
        `}
          />
        </SpotLight>
        <SpotLight
          distance={40}
          intensity={1}
          angle={MathUtils.degToRad(45)}
          color={"#0c8cbf"}
          position={[-2, 8, 4]}
          // target={}
          volumetric={false}
          // debug
          // ref={lightRef}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-radius={1}
          penumbra={1}
        >
          <SpotLightShadow
            scale={100}
            distance={40}
            width={4096}
            height={4096}
            shader={`
          varying vec2 vUv;
          uniform sampler2D uShadowMap;
          uniform float uTime;
          void main() {
            // material.repeat.set(2.5) - Since repeat is a shader feature not texture
            // we need to implement it manually
            vec2 uv = mod(vUv, 0.4) * 2.5;

            // Fake wind distortion
            uv.x += sin(uv.y * 10.0 + uTime * 0.5) * 0.02;
            uv.y += sin(uv.x * 10.0 + uTime * 0.5) * 0.02;
            
            vec3 color = texture2D(uShadowMap, uv).xyz;
            gl_FragColor = vec4(color, 1.);
          }
        `}
          />
        </SpotLight>
        {/* <directionalLight intensity={0.5} position={[0, 10, 0]} castShadow  /> */}

        <Crate />
        <CrateCamera />
        {/* <OrbitControls /> */}
        {/* <ambientLight intensity={0.1} color={`#ffffff`} /> */}
        <mesh receiveShadow position={[0, 0.2, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[50, 50]} />
          <meshPhongMaterial color={`#a182ff`} />
        </mesh>
        <EffectComposer resolutionScale={1}>
          {/* <Bloom radius={4} luminanceThreshold={0.4} intensity={1} /> */}
          <BrightnessContrast brightness={brightness} contrast={0} />
          {/* make good ambient occlusion */}
          {/* <SSAO samples={10} /> */}
          {/* <Noise opacity={0.05} /> */}
          {/* <Glitch /> */}
        </EffectComposer>
      </Canvas>
    </Suspense>
  );
};
