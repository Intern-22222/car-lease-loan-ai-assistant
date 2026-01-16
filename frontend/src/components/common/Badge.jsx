export default function Badge({ type = 'success', text }) {
  const colors = {
    success: { bg: '#22c55e20', text: 'var(--success)' },
    warning: { bg: '#f59e0b20', text: 'var(--warning)' },
    danger: { bg: '#ef444420', text: 'var(--danger)' }
  };
  return (
    <span style={{ background: colors[type].bg, color: colors[type].text, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
      {text}
    </span>
  );
}