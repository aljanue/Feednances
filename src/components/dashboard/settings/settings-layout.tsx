import ProfileInfo from "./profile-info";
import Security from "./security";
import DangerZone from "./danger-zone";

import { UserSettingsDTO } from "@/lib/dtos/user";
import Integrations from "./integrations";
import Preferences from "./preferences";
import Support from "./support";

interface SettingsLayoutProps {
    user: UserSettingsDTO;
}

export default function SettingsLayout({ user }: SettingsLayoutProps) {
    return (
        <div className="flex flex-col gap-4">
            <ProfileInfo user={user} />
            <Preferences user={user} />
            <Security user={user} />
            <Integrations user={user} />
            <Support />
            <DangerZone user={user} />
        </div>
    );
}