// Stroke icons drawn on a 24px grid. All inherit `currentColor`.
const make = paths => props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {paths}
  </svg>
);

export const Lock = make(<><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /><circle cx="12" cy="16" r="1.3" /></>);
export const Unlock = make(<><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" /><circle cx="12" cy="16" r="1.3" /></>);
export const Bolt = make(<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />);
export const Drop = make(<path d="M12 2.7S5 10.4 5 15a7 7 0 0 0 14 0c0-4.6-7-12.3-7-12.3z" />);
export const Wave = make(<><path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /></>);
export const Book = make(<><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 21.5V4.5M8 7h8M8 11h6" /></>);
export const Terminal = make(<><rect x="2.5" y="4" width="19" height="16" rx="2.5" /><path d="m7 9 3 3-3 3M12.5 15H17" /></>);
export const Check = make(<path d="m4.5 12.5 5 5 10-11" />);
export const Shield = make(<><path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>);
export const Play = make(<path d="M7 4.5v15l12-7.5z" />);
export const Arrow = make(<path d="M5 12h14M13 6l6 6-6 6" />);
export const Back = make(<path d="M19 12H5M11 6l-6 6 6 6" />);
export const Search = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>);
export const Alert = make(<><path d="M12 3 2 20.5h20z" /><path d="M12 10v4.5M12 17.6v.1" /></>);
export const Eye = make(<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>);
export const Home = make(<><path d="m3 11 9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></>);
export const Map = make(<><path d="m9 4-6 2.5v14L9 18l6 2.5 6-2.5V4l-6 2.5z" /><path d="M9 4v14M15 6.5v14" /></>);
export const Sparkle = make(<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />);
export const Flag = make(<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>);
export const Users = make(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.2a5 5 0 0 1 5.5 5.8" /></>);
export const Chip = make(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>);
export const Copy = make(<><rect x="8" y="8" width="13" height="13" rx="2.5" /><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8" /></>);
export const Reset = make(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>);
