export default function Table({ headers = [], children }) {
  return (
    <table width="100%" border="1" cellPadding="8">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
