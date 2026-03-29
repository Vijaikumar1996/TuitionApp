export default function FormGrid({
  children,
  cols = 2,
  className = "",
}) {

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-${cols} ${className}`}
    >
      {children}
    </div>
  );
}