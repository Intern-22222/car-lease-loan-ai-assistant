export default function Button({ children, variant = 'primary', onClick, loading, fullWidth }) {
  const style = {
    width: fullWidth ? '100%' : 'auto',
    padding: '12px 24px',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.2s',
    backgroundColor: variant === 'primary' ? 'var(--accent)' : 'transparent',
    color: variant === 'primary' ? '#0F172A' : 'var(--text-main)',
    border: variant === 'outline' ? '1px solid var(--border)' : 'none'
  };
  return (
    <button style={style} onClick={onClick} disabled={loading}>
      {loading ? 'Processing...' : children}
    </button>
  );
}