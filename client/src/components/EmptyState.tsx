/**
 * Empty State Component
 * Shown when no data is available for a section
 */

import { Scroll } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="fantasy-card p-8 md:p-12 flex flex-col items-center justify-center gap-3 text-center">
      {icon ?? <Scroll className="w-10 h-10 text-amber-600/40" />}
      <h3 className="text-base font-bold" style={{ color: "#3B2F2F" }}>
        {title}
      </h3>
      <p className="text-xs text-amber-800/50 max-w-md leading-relaxed">
        {description}
      </p>
    </div>
  );
}
