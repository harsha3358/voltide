import Logo from './Logo.jsx';

export default function Loader({ label = 'LOADING' }) {
  return (
    <div className="loader" role="status">
      <div>
        <Logo size={64} />
        {label}…
      </div>
    </div>
  );
}
