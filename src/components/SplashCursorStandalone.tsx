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
      CURL={2.0}
      SPLAT_RADIUS={0.15}
      SPLAT_FORCE={4000}
      SHADING={true}
      COLOR_UPDATE_SPEED={7}
      BACK_COLOR={{ r: 0.1, g: 0.1, b: 0.3 }}
      TRANSPARENT={true}
    />
  );
}
