"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { updateUserProfile } from "@/lib/data/users.queries";

export type ProfileFormState = {
  message?: string;
  success?: boolean;
};

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;

  if (!username || !email) {
    return { success: false, message: "Username and email are required." };
  }

  try {
    await updateUserProfile(session.user.id, {
      username,
      fullName: fullName || null,
      email,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile. Username or email might be taken." };
  }
}

export async function updatePreferencesAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const currency = formData.get("currency") as string;
  const timeZone = formData.get("timeZone") as string;

  if (!currency || !timeZone) {
    return { success: false, message: "Currency and timeZone are required." };
  }

  try {
    const { updateUserPreferences } = await import("@/lib/data/users.queries");
    await updateUserPreferences(session.user.id, {
      currency,
      timeZone,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Preferences updated successfully." };
  } catch (error) {
    console.error("Error updating preferences:", error);
    return { success: false, message: "Failed to update preferences." };
  }
}

export async function updatePasswordAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters long." };
  }

  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\[\]\\;'`~_+\-=/]/.test(newPassword);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { success: false, message: "New password does not meet complexity requirements." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  try {
    const { getUserById, updateUserPassword } = await import("@/lib/data/users.queries");
    const bcrypt = await import("bcryptjs");
    
    const user = await getUserById(session.user.id);
    if (!user) {
       return { success: false, message: "User not found." };
    }

    if (user.password) {
      if (!currentPassword) {
         return { success: false, message: "Current password is required to change it." };
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
         return { success: false, message: "Incorrect current password." };
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(session.user.id, hashedPassword);

    revalidatePath("/dashboard/settings");
    return { success: true, message: user.password ? "Password updated successfully." : "Password created successfully." };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, message: "An error occurred while saving the password." };
  }
}

export async function generateApiKeyAction(): Promise<{ success: boolean; message: string; key?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { getUserById, updateUserKey } = await import("@/lib/data/users.queries");
    const { generateUserKey, hashUserKey } = await import("@/lib/crypto");

    const user = await getUserById(session.user.id);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    const newKey = generateUserKey(user.username);
    const hashedKey = hashUserKey(newKey);

    await updateUserKey(user.id, hashedKey);

    revalidatePath("/dashboard/settings");
    revalidatePath("/configuration");
    return { success: true, message: "API Key generated successfully.", key: newKey };
  } catch (error) {
    console.error("Error generating API key:", error);
    return { success: false, message: "Failed to generate API Key." };
  }
}

export async function unlinkTelegramAction(): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { updateUserTelegramChatId } = await import("@/lib/data/users.queries");
    await updateUserTelegramChatId(session.user.id, null);

    revalidatePath("/dashboard/settings");
    revalidatePath("/configuration");
    return { success: true, message: "Telegram account unlinked successfully." };
  } catch (error) {
    console.error("Error unlinking Telegram:", error);
    return { success: false, message: "Failed to unlink Telegram account." };
  }
}

export async function dismissProfileSetupBannerAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await updateUserProfile(session.user.id, {
      profileSetupDismissed: true,
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error dismissing banner:", error);
    return { success: false, message: "Failed to dismiss banner." };
  }
}

export async function deleteApiKeyAction(): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { updateUserKey } = await import("@/lib/data/users.queries");
    await updateUserKey(session.user.id, null);

    revalidatePath("/dashboard/settings");
    revalidatePath("/configuration");
    return { success: true, message: "API Key deleted successfully." };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, message: "Failed to delete API Key." };
  }
}

export async function cleanUserDataAction(options: { expenses: boolean; subscriptions: boolean; categories: boolean }): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { deleteUserExpenses, deleteUserSubscriptions, deleteUserCategories } = await import("@/lib/data/users.queries");

    if (options.expenses) await deleteUserExpenses(session.user.id);
    if (options.subscriptions) await deleteUserSubscriptions(session.user.id);
    if (options.categories) await deleteUserCategories(session.user.id);

    revalidatePath("/", "layout"); // Revalidate everything to reflect empty states
    return { success: true, message: "Data cleaned successfully." };
  } catch (error) {
    console.error("Error cleaning user data:", error);
    return { success: false, message: "Failed to clean data." };
  }
}

export async function deleteUserAccountAction(): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { deleteUserAccount } = await import("@/lib/data/users.queries");
    await deleteUserAccount(session.user.id);

    return { success: true, message: "Account deleted successfully." };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, message: "Failed to delete account." };
  }
}
