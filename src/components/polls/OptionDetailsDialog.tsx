
'use client';

import type { PollOption as PollOptionType } from '@/types'; // Renamed to avoid conflict
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link as LinkIconLucide } from 'lucide-react'; // Renamed to avoid conflict with NextLink
import NextLink from 'next/link'; // Using NextLink for consistency

interface OptionDetailsDialogProps {
  option: PollOptionType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function OptionDetailsDialog({ option, isOpen, onOpenChange }: OptionDetailsDialogProps) {
  if (!option) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-headline text-foreground">Option Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Full Text:</h4>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words">
              {option.text}
            </p>
          </div>
          {option.affiliateLink && (
            <div className="pt-2 border-t mt-4">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Affiliate Link:</h4>
              <NextLink 
                href={option.affiliateLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:text-primary/80 hover:underline break-all flex items-center transition-colors"
              >
                <LinkIconLucide className="w-4 h-4 mr-1.5 shrink-0" />
                {option.affiliateLink}
              </NextLink>
            </div>
          )}
          {/* Placeholder for future: User can edit affiliate link if they are the creator */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
