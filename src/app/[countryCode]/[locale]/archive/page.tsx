import Link from "next/link";
import { getCollections } from "@/lib/medusa/products";

export const dynamic = "force-dynamic";

type MedusaCollection = {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, any>;
};

function collectionEmoji(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("outerwear") || lower.includes("jacket")) return "🧥";
  if (lower.includes("shirt") || lower.includes("t-shirt") || lower.includes("top")) return "👔";
  if (lower.includes("denim") || lower.includes("trouser") || lower.includes("pant")) return "👖";
  if (lower.includes("knitwear") || lower.includes("sweater")) return "🧶";
  if (lower.includes("dress") || lower.includes("skirt")) return "👗";
  if (lower.includes("bag")) return "👜";
  if (lower.includes("scarf") || lower.includes("hat")) return "🧣";
  if (lower.includes("belt")) return "🤠";
  if (lower.includes("men") || lower.includes("women") || lower.includes("unisex")) return "👤";
  if (lower.includes("accessorie")) return "💎";
  if (lower.includes("new") || lower.includes("arrival")) return "✨";
  return "📁";
}

export default async function ArchivePage() {
  let collections: MedusaCollection[] = [];

  try {
    const raw = await getCollections();
    collections = raw as MedusaCollection[];
  } catch (error) {
    console.error("Error fetching collections:", error);
  }

  const archiveCollections = collections.filter(
    (c) => c.metadata?.show_in_archive === true || c.metadata?.show_in_archive === "true"
  );

  return (
    <div
      className="MuiScopedCssBaseline-root"
      style={{ backgroundColor: "rgb(248, 248, 248)", minHeight: "100vh" }}
    >
      <div className="MuiBox-root">
        <div className="MuiBox-root" style={{ paddingTop: "80px" }}>
          <div
            className="MuiBox-root"
            style={{
              maxWidth: "538px",
              margin: "0 auto",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            <h1
              className="MuiTypography-root MuiTypography-headline-m DS-Typography Heading__fade-element"
              style={{
                fontFamily: "Hellix, arial, sans-serif",
                fontWeight: 400,
                fontSize: "32px",
                lineHeight: "42px",
                letterSpacing: "-0.64px",
                margin: 0,
                color: "#33383c",
              }}
            >
              Archive
            </h1>
            <p
              className="MuiTypography-root MuiTypography-body-s DS-Typography Heading__fade-element"
              style={{
                fontFamily: "Hellix, arial, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#7b8487",
                margin: "16px 0 0",
              }}
            >
              {archiveCollections.length
                ? `${archiveCollections.length} archived collection${archiveCollections.length > 1 ? "s" : ""}`
                : "Past collections"}
            </p>
          </div>
        </div>
        {archiveCollections.length === 0 ? (
          <div style={{ paddingTop: 64, paddingBottom: 64, textAlign: "center" }}>
            <p
              className="MuiTypography-root MuiTypography-headline-xs DS-Typography"
              style={{
                margin: 0,
                fontFamily: "Hellix, arial, sans-serif",
                fontSize: "20px",
                lineHeight: "26px",
                color: "#33383c",
                letterSpacing: "0.01em",
              }}
            >
              No archived collections yet
            </p>
            <p
              className="MuiTypography-root MuiTypography-label-m-regular DS-Typography"
              style={{
                margin: "12px 0 0",
                color: "#7b8487",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              Past collections will appear here once they are archived.
            </p>
          </div>
        ) : (
          <div style={{ padding: "40px 16px 80px", maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {archiveCollections.map((collection) => {
                const desc = collection.metadata?.description as string | undefined;
                return (
                  <Link
                    key={collection.id}
                    href={`/archive/${collection.handle}`}
                    style={{
                      display: "block",
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid #e5e5e5",
                      transition: "box-shadow 0.2s",
                    }}
                    className="hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                  >
                    <div
                      style={{
                        aspectRatio: "16 / 9",
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                        overflow: "hidden",
                      }}
                    >
                      {collection.metadata?.thumbnail ? (
                        <img
                          src={collection.metadata.thumbnail as string}
                          alt={collection.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        collectionEmoji(collection.title)
                      )}
                    </div>
                    <div style={{ padding: "16px" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#33383c",
                        }}
                      >
                        {collection.title}
                      </h3>
                      {desc && (
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 13,
                            color: "#7b8487",
                            lineHeight: "18px",
                          }}
                        >
                          {desc}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
