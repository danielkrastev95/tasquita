import { ImageResponse } from "next/og";
import { getMenu, getSiteSettings } from "@/lib/data/public";
import { isCloudinaryUrl } from "@/lib/cloudinary";
import { BRAND, isFont, loadGoogleFont } from "@/components/site/brand-image";
import { heroPhotos } from "@/components/site/photos";
import { splitCity } from "@/components/site/utils";

export const alt = "La Tasquita de Sara, bar de tapas en Valdemoro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const PHOTO = { width: 440, height: 520 };

/** URL JPG recortada a medida (next/og no lee webp/avif). Solo Cloudinary o Unsplash. */
function photoUrl(src: string) {
  if (isCloudinaryUrl(src)) {
    return src.replace("/image/upload/", `/image/upload/f_jpg,q_80,c_fill,g_auto,w_${PHOTO.width},h_${PHOTO.height}/`);
  }
  if (src.startsWith("https://images.unsplash.com/")) {
    const u = new URL(src);
    u.search = `?w=${PHOTO.width}&h=${PHOTO.height}&fit=crop&fm=jpg&q=80`;
    return u.toString();
  }
  return null;
}

export default async function OpengraphImage() {
  const [s, menu] = await Promise.all([getSiteSettings(), getMenu()]);
  const photo = photoUrl(heroPhotos(s, menu).main.src);
  const kicker = `Bar de tapas · ${splitCity(s.addressCity).locality}`.toUpperCase();
  const name = s.name.toUpperCase();
  const address = `${s.addressStreet} · ${s.addressCity}`;

  const fonts = (
    await Promise.all([
      loadGoogleFont("Newsreader", 800, "normal", name),
      loadGoogleFont("Space Grotesk", 700, "normal", kicker + address),
      loadGoogleFont("Space Grotesk", 400, "normal", s.heroTagline),
    ])
  ).filter(isFont);
  const serif = fonts.some((f) => f.name === "Newsreader") ? "Newsreader" : undefined;
  const sans = fonts.some((f) => f.name === "Space Grotesk") ? "Space Grotesk" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: BRAND.cream,
          backgroundImage: `linear-gradient(to right, rgba(47,119,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,119,128,0.07) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: BRAND.gold, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 0 56px 72px", width: 700 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", alignSelf: "flex-start", background: BRAND.primary, padding: "10px 18px" }}>
              <div style={{ width: 10, height: 10, background: BRAND.gold, marginRight: 14, display: "flex" }} />
              <div style={{ display: "flex", fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "#fff" }}>{kicker}</div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 30,
                fontFamily: serif,
                fontWeight: 800,
                fontSize: 98,
                lineHeight: 0.88,
                letterSpacing: -3,
                color: BRAND.primary,
              }}
            >
              {name}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {s.heroTagline && (
              <div style={{ display: "flex", fontFamily: sans, fontSize: 28, lineHeight: 1.3, color: BRAND.inkMuted, maxWidth: 560 }}>
                {s.heroTagline}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
              <div style={{ width: 48, height: 5, background: BRAND.gold, marginRight: 16, display: "flex" }} />
              <div style={{ display: "flex", fontFamily: sans, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: BRAND.ink }}>{address}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            top: 55,
            width: PHOTO.width + 20,
            height: PHOTO.height + 20,
            border: `10px solid ${BRAND.primary}`,
            background: BRAND.ink,
            display: "flex",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- next/og: <img> obligatorio
            <img src={photo} width={PHOTO.width} height={PHOTO.height} />
          ) : (
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", background: BRAND.primary }}>
              <div style={{ display: "flex", fontFamily: serif, fontWeight: 800, fontSize: 360, color: BRAND.cream }}>T</div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
