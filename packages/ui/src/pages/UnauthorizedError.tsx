import { Button } from "../components/ui/button";
import React from "react";

export function UnauthorizedError({
  onBack,
  onGoLogin,
}: {
  onBack: () => void;
  onGoLogin: () => void;
}) {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">401</h1>
        <span className="font-medium">Unauthorized</span>
        <p className="text-center text-muted-foreground">
          Please log in with appropriate credentials <br /> to access this
          resource.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
          <Button onClick={onGoLogin}>Log In</Button>
        </div>
      </div>
    </div>
  );
}