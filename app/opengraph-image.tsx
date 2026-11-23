import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}. ${site.course}, an 8-week field course.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          background: "#f5f0e6", color: "#1c1a17", padding: 64, border: "12px solid #1c1a17", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>
          <div style={{ width: 28, height: 28, borderRadius: 28, background: "#b93c0a", marginRight: 18 }} />
          {site.course} · 8-week field course
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
          <div>People Don&rsquo;t Want to Be Fixed&hellip;</div>
          <div style={{ color: "#8f2d06" }}>They Want to Be Seen &amp; Not Judged</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, borderTop: "4px solid #1c1a17", paddingTop: 22 }}>
          Hear the need, the decision, and the value in what people say. By {site.author}.
        </div>
      </div>
    ),
    size,
  );
}
