import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  BrightnessContrast,
  SSAO,
  Bloom,
  Glitch,
  Noise,
} from "@react-three/postprocessing";
import { MathUtils } from "three";
import {
  SpotLightShadow,
  SpotLight,
  OrbitControls,
  useTexture,
  Stars,
} from "@react-three/drei";
import { useState, useEffect, Suspense, useMemo } from "react";
import { PackTimer } from "../../utils/classes/PackTimer";
import { CardPackThree } from "./CardPack";
import { CardCamera } from "./CardCamera";
import {
  getBackgroundColor,
  getComplemetaryColor,
  getEmissiveColor,
  useImageColorScheme,
} from "../../utils/hooks/useImageColorScheme";

export const CardCanvas = () => {
  const [brightness, setBrightness] = useState(0);
  const image = "/bsdcardpack.png";
  const colorScheme = useImageColorScheme(image);
  const primaryColor = useMemo(() => {
    console.log({ cs: colorScheme, gb: getBackgroundColor(colorScheme!) });
    if (!colorScheme) return "#000000";
    return getBackgroundColor(colorScheme);
  }, [colorScheme]);
  const complementColor = useMemo(() => {
    if (!colorScheme) return "#000000";
    return getComplemetaryColor(colorScheme);
  }, [colorScheme]);
  const emissiveColor = useMemo(() => {
    if (!colorScheme) return "#000000";
    return getEmissiveColor(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const openSequenceListener = async () => {
      for (let i = 0; i < 100; i++) {
        await new Promise((res) => setTimeout(res, 10));
        setBrightness((prev) => prev + 0.01);
      }
    };
    PackTimer.getInstance().on("preOpen", openSequenceListener);
    return () => {
      PackTimer.getInstance().off("preOpen", openSequenceListener);
    };
  }, []);
  return (
    <Suspense
      fallback={
        <div className={`pt-[66%] font-wsans text-3xl`}>
          Loading Card Pack...
        </div>
      }
    >
      <Canvas
        className={`!h-screen cursor-pointer`}
        shadows="soft"
        onClick={() => {
          PackTimer.getInstance().open();
          PackTimer.getInstance().tapCard()
        }}
      >
        <color attach="background" args={[primaryColor]} />
        <fog attach="fog" args={[primaryColor, 4, 20]} />
        <SpotLight
          distance={50}
          intensity={1}
          angle={MathUtils.degToRad(45)}
          color={emissiveColor}
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
          distance={50}
          intensity={1}
          angle={MathUtils.degToRad(45)}
          color={complementColor}
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

        {/* <Crate />
        <CrateCamera /> */}
        <CardCamera />
        <CardPackThree textureURL={image} emissiveColor={emissiveColor} />
        {/* <OrbitControls /> */}
        {/* <ambientLight intensity={0.1} color={`#ffffff`} /> */}
        <mesh receiveShadow position={[0, 0.2, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[50, 50]} />
          <meshPhongMaterial color={primaryColor} />
        </mesh>
        <EffectComposer resolutionScale={2}>
          <Bloom
            radius={100}
            luminanceThreshold={0.4}
            intensity={1}
            luminanceSmoothing={0}
          />
          {/* <BrightnessContrast brightness={brightness} contrast={0} /> */}
          {/* make good ambient occlusion */}
          {/* <SSAO samples={10} /> */}
          {/* <Noise opacity={0.1} /> */}
          {/* <Glitch /> */}
        </EffectComposer>
        <Stars radius={250} depth={50} count={5000} factor={1} saturation={1} />
      </Canvas>
    </Suspense>
  );
};
