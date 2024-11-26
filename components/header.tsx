import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export const Header = ({
  title,
  hideBackButton,
}: {
  title: string;
  hideBackButton?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {!hideBackButton && (
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
    </div>
  );
};
