import { useLocation } from 'react-router';

import { ROUTE_LABELS } from '../../constants';

export const PartnerHeader = () => {
  const location = useLocation();

  const getRouteLabel = (pathname: string) => {
    const matched = Object.keys(ROUTE_LABELS)
      .filter((route) => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length)[0];

    return ROUTE_LABELS[matched] ?? { main: '', sub: '' };
  };

  const { main, sub } = getRouteLabel(location.pathname);

  return (
    <header className="flex h-[4.5rem] w-full items-center bg-white px-6">
      <h2 className="text-lg font-semibold">
        {sub ? `${main} / ${sub}` : main}
      </h2>
    </header>
  );
};
