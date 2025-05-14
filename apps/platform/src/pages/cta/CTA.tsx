import { Button } from "@/components/ui/button";
import { Camera, MenuSquare } from "lucide-react";
import { Link } from "wouter";

const CTA = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Create your digital menu</h1>
          <div className="mt-1 h-px w-full bg-gray-200"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/photomenu">
            <Button className="flex items-center gap-2 px-6" variant="outline">
              <Camera size={20} />
              <span>Photo Menu</span>
            </Button>
          </Link>

          <Button className="flex items-center gap-2 px-6">
            <MenuSquare size={20} />
            <span>Digital Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
