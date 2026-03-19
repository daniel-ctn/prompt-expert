import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #0E7490, #0D9488)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
          stroke="none"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M19 2.5l-.38 1.157a.6.6 0 0 1-.383.383L17.08 4.42l1.157.38a.6.6 0 0 1 .383.383L19 6.34l.38-1.157a.6.6 0 0 1 .383-.383l1.157-.38-1.157-.38a.6.6 0 0 1-.383-.383L19 2.5Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
