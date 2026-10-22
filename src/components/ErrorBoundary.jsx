import { Component } from 'react';
import ErrorToon from './ErrorToon.jsx';
import { track } from '../lib/track.js';

// If a page crashes, show LAGZILLA chewing a cable instead of a blank screen.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    track('Error', '500', String(error?.message || error).slice(0, 200));
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="wrap" style={{ padding: 'clamp(60px, 12vh, 140px) 0' }}>
        <ErrorToon code={500} message={String(this.state.error?.message || '')}>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>↻ Reload the page</button>
          <a className="btn" href="#/">🏠 Home</a>
        </ErrorToon>
      </section>
    );
  }
}
