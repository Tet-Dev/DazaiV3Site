import { Float, useAnimations, useGLTF } from "@react-three/drei";
import { act, useFrame, useLoader } from "@react-three/fiber";
import { group } from "console";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, LoopOnce, MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CrateTimer } from "../../utils/classes/CrateTimer";
// const EffectComposer = loadable(() =>
//   import("@react-three/postprocessing").then((mod) => mod.EffectComposer)
// );
export const Crate = () => {
  const [speed, setSpeed] = useState(3);
  const returnState = useRef(false);
  const { nodes, materials, scene, animations } = useLoader(
    GLTFLoader,
    "/crate.gltf"
  );
  useEffect(() => {
    scene.traverse((node) => {
      if (node) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    Object.values(materials).map((mat) => {
      mat.opacity = 1;
      mat.transparent = false;
    });
  }, [nodes]);
  const { actions } = useAnimations(animations, scene);
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const anis = useMemo(
    () =>
      animations.map((ani) => {
        const action = mixer.clipAction(ani);
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(0.4);
        action.setEffectiveWeight(1);
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
    };
    const preHandler = () => {
      returnState.current = true;
    };
    CrateTimer.getInstance().on("cameraShake", preHandler);
    CrateTimer.getInstance().on("crateOpen", clickHandler);

    return () => {
      CrateTimer.getInstance().off("cameraShake", preHandler);
      CrateTimer.getInstance().off("crateOpen", clickHandler);
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
    console.log(scene.rotation.y);
    if (returnState.current) {
      if (Math.abs(scene.rotation.y) >= 0.02) {
        if (scene.rotation.y > 0)
          scene.rotateY(MathUtils.degToRad(-120 * delta * (Math.abs(scene.rotation.y))**.9));
        else scene.rotateY(MathUtils.degToRad(120 * delta * (Math.abs(scene.rotation.y))**.9) );
      } else {
        scene.rotation.y = 0;
      }
    } else {
      scene.rotateY(MathUtils.degToRad(25 * delta));
    }
  });
  return (
    // <Float
    //   speed={speed} // Animation speed, defaults to 1
    //   rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
    //   floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
    //   floatingRange={[0,0]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    // >

    <primitive object={scene} />
    // </Float>
  );
};
