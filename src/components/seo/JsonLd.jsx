export default function JsonLd({ data }) {
  if (!data) return null;

  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.filter(Boolean).map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
              .replace(/</g, '\\u003c')  // Prevent script breakout
              .replace(/>/g, '\\u003e')
              .replace(/&/g, '\\u0026'),
          }}
        />
      ))}
    </>
  );
}
