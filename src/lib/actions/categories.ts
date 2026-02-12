"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createCategory,
  deleteCategory,
  getActiveCategories,
  getCategoryById,
  hideCategory,
  unhideCategory,
  updateCategory,
} from "@/lib/data/categories.queries";
import { createCategorySchema } from "@/lib/validations/category";
import { createNotificationForUser } from "@/lib/services/notifications";

export interface CategoryActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function getCategoriesAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  return await getActiveCategories(session.user.id);
}

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = createCategorySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  try {
    await createCategory({
      name: validated.data.name,
      hexColor: validated.data.hexColor ?? null,
      userId: session.user.id,
      active: true,
    });

    await createNotificationForUser(session.user.id, {
      text: `Category created: ${validated.data.name}`,
      type: "success",
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = createCategorySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  try {
    await updateCategory(id, {
      name: validated.data.name,
      hexColor: validated.data.hexColor ?? null,
    });

    await createNotificationForUser(session.user.id, {
      text: `Category updated: ${validated.data.name}`,
      type: "info",
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const category = await getCategoryById(id);

    if (!category) {
      return { error: "Category not found" };
    }

    if (category.userId === null) {
      // Default category, hide it (soft delete via deleted=true)
      await hideCategory(session.user.id, id, true);
      await createNotificationForUser(session.user.id, {
        text: `Category deleted: ${category.name}`,
        type: "warning",
      });
    } else if (category.userId === session.user.id) {
      // User category, delete it
      await deleteCategory(id);
      await createNotificationForUser(session.user.id, {
        text: `Category deleted: ${category.name}`,
        type: "warning",
      });
    } else {
      return { error: "Unauthorized" };
    }

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}

export async function toggleCategoryAction(
  id: string,
  isActive: boolean
): Promise<CategoryActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const category = await getCategoryById(id);
    if (!category) return { error: "Category not found" };

    if (category.userId === null) {
        // Default category logic
        if (isActive) {
            await unhideCategory(session.user.id, id);
        } else {
            // Check if already hidden to prevent duplicate key error
            try {
                await hideCategory(session.user.id, id);
            } catch (error) {
                // If it fails, it might already be hidden, which is fine (?) 
                // But actually, if we are toggling to false, it shouldn't be hidden yet if the UI is correct.
                // However, let's be safe.
                console.log("Category might already be hidden", error);
            }
        }
    } else {
        // Custom category logic
        await updateCategory(id, { active: isActive });
    }
    
    await createNotificationForUser(session.user.id, {
        text: `Category ${isActive ? 'enabled' : 'disabled'}: ${category.name}`,
        type: "info",
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error toggling category:", error);
    return { error: "Failed to toggle category" };
  }
}
