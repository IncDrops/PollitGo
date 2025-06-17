import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6 text-foreground">Search Polls</h1>
      <div className="flex w-full max-w-sm items-center space-x-2 mb-8">
        <Input type="text" placeholder="Search by keyword, user, or tag" className="flex-grow" />
        <Button type="submit" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>
      {/* Placeholder for search results */}
      <div className="text-center text-muted-foreground py-10">
        <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Enter a search term to find polls.</p>
        <p className="text-sm">You can search for poll questions, creators, or tags.</p>
      </div>
    </div>
  );
}
