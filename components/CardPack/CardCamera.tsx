import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { Camera, CatmullRomCurve3, MathUtils, Vector3 } from "three";
import { CrateTimer } from "../../utils/classes/CrateTimer";
import { PackTimer } from "../../utils/classes/PackTimer";
type Waypoint = {
  position: Vector3;
  lookat: Vector3;
};
// get vector from circle
const getVector = (radius: number, angle: number) => {
  return new Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
};
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}
class ScreenShake {
  // When a function outside ScreenShake handle the camera, it should
  // always check that ScreenShake.enabled is false before.
  enabled: boolean;
  shakeStage: number;
  originalPosition?: Vector3;
  lastPosition?: Vector3;
  nextLocation?: Vector3;
  intensity = 1;
  deltaElapsed = 0;
  constructor() {
    this.enabled = false;
    this.shakeStage = 0;
  }
  shake(camera: Camera, intensity: number) {
    // if (this.enabled) return;
    this.enabled = true;
    this.shakeStage = 0;
    this.originalPosition = camera.position.clone();
    this.lastPosition = camera.position.clone();
    this.intensity = intensity;
    this.nextLocation = this.getRandomPositionFromCameraPos();
    console.log("shake", this.nextLocation);
  }
  getRandomPositionFromCameraPos() {
    return new Vector3(
      this.originalPosition!.x + (Math.random() - 0.5) * this.intensity,
      this.originalPosition!.y + (Math.random() - 0.5) * this.intensity,
      this.originalPosition!.z + (Math.random() - 0.5) * this.intensity
    );
  }
  update(camera: Camera, delta: number) {
    if (!this.nextLocation) return;
    this.deltaElapsed += delta;
    // console.log(this.deltaElapsed);
    // if (!this.enabled) return;
    // every frame, we lerp the camera position to the next location, each move takes 0.3 seconds

    camera.position.set(
      MathUtils.lerp(
        this.lastPosition!.x,
        this.nextLocation!.x,
        this.deltaElapsed * 10
      ),
      MathUtils.lerp(
        this.lastPosition!.y,
        this.nextLocation!.y,
        this.deltaElapsed * 10
      ),
      MathUtils.lerp(
        this.lastPosition!.z,
        this.nextLocation!.z,
        this.deltaElapsed * 10
      )
    );
    if (this.deltaElapsed >= 0.1) {
      this.deltaElapsed = 0;
      this.shakeStage++;
      if (this.shakeStage > 3) {
        this.lastPosition = this.nextLocation!.clone();
        this.nextLocation = this.originalPosition!.clone();
        this.shakeStage = 0;
        if (!this.enabled) {
          this.nextLocation = undefined;
        }
      } else if (this.enabled) {
        this.lastPosition = this.nextLocation!.clone();
        this.nextLocation = this.getRandomPositionFromCameraPos();
      }
    }
  }
}
export const CardCamera = () => {
  const camera = useRef<THREE.PerspectiveCamera>();
  const shaker = useRef(new ScreenShake());
  const totalDelta = useRef(0);
  const cameraMove = useRef(false);
  useEffect(() => {
    if (camera.current) {
      camera.current!.position.set(4, 2, 2);
      camera.current.lookAt(0, 2.5, 0);
      // camera.current!.lookAt(0, 9, 0);
    }
    const listener = () => {};
    const startCameraListener = () => (cameraMove.current = true);
    const stopCameraListener = () => (cameraMove.current = false);
    PackTimer.getInstance().once("preOpen", startCameraListener);
    PackTimer.getInstance().once("stopCameraShake", stopCameraListener);
    return () => {
      PackTimer.getInstance().off("preOpen", startCameraListener);
      PackTimer.getInstance().off("stopCameraShake", stopCameraListener);
    };
  }, []);
  useFrame((state, delta, f) => {
    shaker.current.update(camera.current!, delta);
    if (cameraMove.current) {
      if (totalDelta.current < 1) {
        totalDelta.current += delta;
        totalDelta.current = Math.min(totalDelta.current, 1);
        camera.current!.position.set(
          4,
          2 + 3 * easeInOutSine(totalDelta.current),
          2
        );
        camera.current!.lookAt(
          0,
          2.5 + 2 * easeInOutSine(totalDelta.current),
          0
        );
      }
    }
  });
  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera makeDefault ref={camera} />
    </>
  );
};
