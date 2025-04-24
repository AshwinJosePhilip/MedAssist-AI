import React from "react";
import SplashCursor from "./SplashCursor";

export default function SplashCursorStandalone() {
  return (
    <SplashCursor
      SIM_RESOLUTION={128}
      DYE_RESOLUTION={1440}
      DENSITY_DISSIPATION={4.0}
      VELOCITY_DISSIPATION={2.5}
      PRESSURE={0.1}
      PRESSURE_ITERATIONS={20}
      CURL={1.5}
      SPLAT_RADIUS={0.08}
      SPLAT_FORCE={2000}
      SHADING={true}
      COLOR_UPDATE_SPEED={7}
      BACK_COLOR={{ r: 0.1, g: 0.1, b: 0.3 }}
      TRANSPARENT={true}
    />
  );
}
