import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Camera, CatmullRomCurve3, MathUtils, Vector3 } from "three";
import { CrateTimer } from "../../utils/classes/CrateTimer";
type Waypoint = {
  position: Vector3;
  lookat: Vector3;
};
// get vector from circle
const getVector = (radius: number, angle: number) => {
  return new Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
};

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
          this.nextLocation =undefined;
        }
      } else if (this.enabled) {
        this.lastPosition = this.nextLocation!.clone();
        this.nextLocation = this.getRandomPositionFromCameraPos();
      }
    }
  }
}
export const CrateCamera = () => {
  const camera = useRef<THREE.PerspectiveCamera>();
  const shaker = useRef(new ScreenShake());
  useEffect(() => {
    if (camera.current) {
      camera.current!.position.set(10, 3, 0);
      camera.current!.lookAt(0, 3, 0);
    }
    const listener = () => {};
    const startShakeListener = () => shaker.current.shake(camera.current!, 0.8);
    const stopShakeListener = () => (shaker.current.enabled = false);
    CrateTimer.getInstance().once("cameraShake", startShakeListener);
    CrateTimer.getInstance().once("stopCameraShake", stopShakeListener);
    return () => {
      CrateTimer.getInstance().off("cameraShake", startShakeListener);
      CrateTimer.getInstance().off("stopCameraShake", stopShakeListener);
    };
  }, []);
  useFrame((state, delta, f) => {
    shaker.current.update(camera.current!, delta);
  });
  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera makeDefault ref={camera} />
    </>
  );
};
