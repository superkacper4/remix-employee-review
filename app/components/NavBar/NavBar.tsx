import React from "react";
import LinkButton from "../LinkButton";

export default function NavBar() {
  return (
    <header className="relative top-0 left-0 flex h-24 w-screen flex-wrap items-center justify-between bg-gradient-to-r from-[#026BB5] to-[#22357E]">
      <LinkButton to="/review">Wypełnij ankiete</LinkButton>
      <LinkButton to="/review-overview">Pokaz poprzednie anikety</LinkButton>
      <LinkButton to="/subordinates-reviews">
        Wypełnij anikety podwładnych
      </LinkButton>
      <LinkButton to="/subordinates-reviews-overview">
        Pokaz anikety podwładnych
      </LinkButton>
    </header>
  );
}
