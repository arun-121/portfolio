import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Arun S R, developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F3EEE1",
          color: "#24301F",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#A4441B" }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, lineHeight: 1.05 }}>
            Calm products start with thoughtful systems.
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 32, color: "#5C5A45" }}>
            Developer · {SITE.location}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
