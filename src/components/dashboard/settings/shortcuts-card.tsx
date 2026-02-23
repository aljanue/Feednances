import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";

interface Props {
  user: UserSettingsDTO;
}

export default function ShortcutsCard({ user }: Props) {
  return (
    <InfoContainer title="Shortcut Key">
      <h2>Shortcuts</h2>
    </InfoContainer>
  );
}
