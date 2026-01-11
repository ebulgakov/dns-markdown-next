"use client";

import { UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

function ClientSideUserButton() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Render the UserButton only after the DOM is fully loaded on the client
  return isClient ? <UserButton afterSignOutUrl="/" /> : null;
}

export { ClientSideUserButton };
