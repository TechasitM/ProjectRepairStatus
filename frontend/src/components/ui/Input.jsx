export default function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 10,
        borderRadius: 6,
        border: "1px solid #d1d5db",
        marginBottom: 10,
      }}
    />
  );
}
