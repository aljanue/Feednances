export interface CreateUserDTO {
  email: string;
  username: string;
  fullName?: string;
  password: string;
}

export interface UserSettingsDTO {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  image: string | null;
  currency: string;
  timeZone: string;
  telegramChatId: string | null;
  hasPassword: boolean;
  hasApiKey: boolean;
  connectedProviders: string[];
}
