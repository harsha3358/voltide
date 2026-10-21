import { useCallback } from 'react';
import source from '../../guide.md?raw';
import Backdrop from '../components/Backdrop.jsx';
import { MarkdownPage } from '../components/Markdown.jsx';

export default function Handbook({ route }) {
  const anchorHref = useCallback(id => `#/handbook/${id}`, []);
  return (
    <>
      <Backdrop kind="world" opacity={0.35} />
      <MarkdownPage source={source} anchor={route.topic} anchorHref={anchorHref} />
    </>
  );
}
