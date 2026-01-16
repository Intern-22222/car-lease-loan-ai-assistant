export default function Card({ children, title, style }) {
  return (
    <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', ...style }}>
      {title && <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>{title}</h3>}
      {children}
    </div>
  );
}