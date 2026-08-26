/**
 * Рендерить Schema.org структуровані дані (JSON-LD) для Rich Snippets.
 * Використання: <JsonLd schema={{ "@context": "https://schema.org", ... }} />
 */
export default function JsonLd({
  schema,
}: {
  schema: Record<string, unknown> | Record<string, unknown>[];
}) {
  // Екрануємо `<`, щоб захиститись від XSS через дані з БД у JSON-LD
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}