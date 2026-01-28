export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}
