import type { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        padding: "0 1rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 400 }}>
        {statusCode ? `${statusCode}` : "Error"}
      </h1>
      <p style={{ marginTop: "1rem", color: "#666", fontSize: "1.125rem" }}>
        {statusCode === 404
          ? "This page could not be found."
          : "An unexpected error occurred."}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
