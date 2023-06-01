import {
  Float,
  Sparkles,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { act, useFrame, useLoader } from "@react-three/fiber";
import { group } from "console";
import { useEffect, useMemo, useRef, useState } from "react";
import THREE, {
  AnimationMixer,
  Color,
  LoopOnce,
  MathUtils,
  MeshStandardMaterial,
  RepeatWrapping,
  Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CrateTimer } from "../../utils/classes/CrateTimer";
import { PackTimer } from "../../utils/classes/PackTimer";
// const EffectComposer = loadable(() =>
//   import("@react-three/postprocessing").then((mod) => mod.EffectComposer)
// );
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}
export const CardPackThree = (props: {
  textureURL: string;
  emissiveColor?: string;
}) => {
  const [speed, setSpeed] = useState(3);
  const fading = useRef(false); // fading out top + moving down
  const fadingDelta = useRef(0);
  const { nodes, materials, scene, animations } = useLoader(
    GLTFLoader,
    "/cardpack.gltf"
  );
  const mapText = useTexture(props.textureURL, (tex) => {
    const text = tex as Texture;
    text.flipY = false;
    text.needsUpdate = true;
  });
  useEffect(() => {
    scene.scale.set(0.025, 0.025, 0.025);
    scene.position.set(0, 3, 0);
    scene.rotation.set(
      (90 * Math.PI) / 180,
      (10 * Math.PI) / 180,
      (-80 * Math.PI) / 180
    );
    console.log({ nodes, materials });
  }, [scene]);
  useEffect(() => {
    if (!mapText) return;
    console.log({ mapText });

    // mapText.wrapS = RepeatWrapping;
    // mapText.wrapT = RepeatWrapping;
    // mapText.repeat.y = -1
    // mapText.repeat.x = -1
    const stMat = materials.cardpack as MeshStandardMaterial;
    stMat.map = mapText;
    stMat.map.flipY = false;
    stMat.needsUpdate = true;
    stMat.roughness = 1;
    stMat.metalness = 0;

    const topMesh = nodes.top as THREE.Mesh;
    const bottomMesh = nodes.bottom as THREE.Mesh;
    const topMeshMat = (bottomMesh.material as MeshStandardMaterial).clone();
    topMeshMat.transparent = true;
    topMeshMat.opacity = 1;
    topMesh.material = topMeshMat;
    const beamMat = materials.beam as MeshStandardMaterial;
    console.log({ beamMat });
    beamMat.color = new Color(0.2, 0.2, 0.8);
    beamMat.emissive = beamMat.color;
    beamMat.emissiveIntensity = 2;
  }, [mapText]);
  useEffect(() => {
    scene.traverse((node) => {
      if (node) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    // Object.values(materials).map((mat) => {
    //   mat.opacity = 1;
    //   mat.transparent = false;
    // });
  }, [nodes]);
  useEffect(() => {
    if (!materials) return;
    if (!props.emissiveColor) return;
    const mat2 = materials.cardpack as MeshStandardMaterial;
    mat2.emissive.set(props.emissiveColor!);
    mat2.emissiveIntensity = 0;
  }, [materials, props.emissiveColor]);

  const { actions } = useAnimations(animations, scene);
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const anis = useMemo(
    () =>
      animations.map((ani) => {
        const action = mixer.clipAction(ani);
        action.setLoop(LoopOnce, 1);
        console.log(action);
        action.clampWhenFinished = true;
        if (action.getClip().name === "topAction")
          action.setEffectiveTimeScale(0.4);
        // else action.setEffectiveTimeScale(0.01);
        else action.setEffectiveTimeScale(1.8);
        return action;
      }),
    [animations]
  );
  useEffect(() => {
    console.log({ nodes });

    const clickHandler = () => {
      setSpeed(0);
      anis.map((ani) => {
        ani.reset();
        ani.play();
      });
      const top = nodes.top as THREE.Mesh;
      top.material;
    };
    const preHandler = () => {
      fading.current = true;
    };
    PackTimer.getInstance().on("preOpen", preHandler);
    PackTimer.getInstance().on("ripPack", clickHandler);

    return () => {
      PackTimer.getInstance().off("preOpen", preHandler);
      PackTimer.getInstance().off("ripPack", clickHandler);
    };
  }, [anis]);
  useEffect(() => {
    let count = 0;
    mixer.addEventListener("finished", (e) => {
      count++;
      if (count === anis.length) {
        console.log("all finished");
        anis.map((ani) => {
          ani.stop();
          // ani.reset();
        });
      }
    });
  }, [anis, mixer]);

  useFrame((state, delta, f) => {
    mixer.update(delta);
    if (fading.current) {
      if (fadingDelta.current < 2) {
        fadingDelta.current += delta * 1;
        fadingDelta.current = Math.min(fadingDelta.current, 2);
        const top = nodes.top as THREE.Mesh;
        const topMat = top.material as MeshStandardMaterial;
        topMat.opacity = 1 - easeInOutSine(fadingDelta.current / 2);
        topMat.needsUpdate = true;
        scene.position.set(
          0,
          3 - 1.8 * easeInOutSine(fadingDelta.current / 2),
          0
        );
      }
      if (fadingDelta.current >= 1.5 && fadingDelta.current < 3) {
        const bottom = nodes.bottom as THREE.Mesh;
        const bottomMat = bottom.material as MeshStandardMaterial;
        bottomMat.opacity = easeInOutSine((fadingDelta.current - 1.5) / 1.5);
        bottomMat.needsUpdate = true;
      }
    }
    // console.log(scene.rotation.y);
    // if (returnState.current) {
    //   if (Math.abs(scene.rotation.y) >= 0.02) {
    //     if (scene.rotation.y > 0)
    //       scene.rotateY(
    //         MathUtils.degToRad(-120 * delta * Math.abs(scene.rotation.y) ** 0.9)
    //       );
    //     else
    //       scene.rotateY(
    //         MathUtils.degToRad(120 * delta * Math.abs(scene.rotation.y) ** 0.9)
    //       );
    //   } else {
    //     scene.rotation.y = 0;
    //   }
    // } else {
    //   scene.rotateY(MathUtils.degToRad(25 * delta));
    // }
  });
  return (
    <Float
      speed={fading.current ? 0 : 2} // Animation speed, defaults to 1
      rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
      floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    >
      <primitive object={scene}>
        <Sparkles
          count={30}
          color={props.emissiveColor}
          scale={80}
          size={2}
          speed={2}
        />
      </primitive>
    </Float>
  );
};
