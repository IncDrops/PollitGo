
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function NewOpinionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center text-foreground">
            Post a 2nd Opinion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            The 2nd Opinion form is temporarily disabled for debugging. We will restore it shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
