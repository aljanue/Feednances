"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";
import AppleShortcutsIntegration from "./apple-shortcuts-integration";
import TelegramIntegration from "./telegram-integration";

interface Props {
  user: UserSettingsDTO;
}

export default function Integrations({ user }: Props) {
  return (
    <InfoContainer title="Integrations">
      <div className="space-y-6">
        <AppleShortcutsIntegration user={user} />
        <div className="h-px bg-border w-full" />
        <TelegramIntegration user={user} />
        <div className="h-px bg-border w-full" />
      </div>
    </InfoContainer>
  );
}
