"use client";

import { useState } from "react";

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  if (!menuOpen) {
    return <></>
  }

  return 
}