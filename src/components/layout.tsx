import { Cursor, CursorFollow, CursorProvider } from './animate-ui/primitives/animate/cursor';

import { AppCommands } from './common/app-commands';
import { AppHeader } from './common/app-header';
import { Badge } from './ui/badge';
import { CursorIcon } from './icons/cursor';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useCursorStore } from '@/store/cursor';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const {
    enableCursor,
    enableCursorFollow,
    cursorFollowSide,
    cursorFollowAlign,
    cursorFollowSideOffset,
    cursorFollowAlignOffset,
    cursorFollowContent,
    cursorFollowBadgeVariant,
  } = useCursorStore((s) => s)

  return (
    <div className={cn("relative h-full w-full", className)}>
      <AppHeader />
      <main className="pt-12">
        {children}
      </main>
      <CursorProvider global={true}>
        {enableCursor && (
          <Cursor>
            <CursorIcon />
          </Cursor>
        )}
        {enableCursorFollow && (
          <CursorFollow
            side={cursorFollowSide}
            sideOffset={cursorFollowSideOffset}
            align={cursorFollowAlign}
            alignOffset={cursorFollowAlignOffset}
          >
            <Badge variant={cursorFollowBadgeVariant}>{cursorFollowContent}</Badge>
          </CursorFollow>
        )}
      </CursorProvider>
      <AppCommands />
    </div>
  );
} 