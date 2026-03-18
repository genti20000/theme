import React from 'react';
import { Link } from 'react-router-dom';

type LinkItem = {
  to: string;
  label: string;
};

interface RelatedPlanningLinksProps {
  title?: string;
  intro: string;
  links: LinkItem[];
  className?: string;
}

const RelatedPlanningLinks: React.FC<RelatedPlanningLinksProps> = ({
  title = 'Related planning pages',
  intro,
  links,
  className = '',
}) => {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8 ${className}`}>
      <h2 className="mb-3 text-2xl font-black text-white">{title}</h2>
      <p className="text-base leading-7 text-zinc-300">
        {intro}
        {' '}
        {links.map((link, index) => (
          <React.Fragment key={link.to}>
            <Link to={link.to} className="text-yellow-300 hover:text-white">{link.label}</Link>
            {index < links.length - 1 ? ', ' : '.'}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default RelatedPlanningLinks;
