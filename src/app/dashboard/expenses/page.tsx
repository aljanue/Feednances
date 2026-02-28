import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import ExpensesDataSummary from "@/components/dashboard/expenses/expenses-data-summary";
import ExpensesTable from "@/components/dashboard/expenses/expenses-table";
import MainSection from "@/components/dashboard/main-section";
import TitleHeader from "@/components/dashboard/title-header";
import NewExpenseModal from "@/components/dashboard/new-expense-modal";
import { ReceiptText } from "lucide-react";
import { getExpensesPageData } from "@/lib/services/expenses";
import { ExportButton } from "@/components/dashboard/export/ExportButton";
import { format } from "date-fns";
import type { ExpenseSortField, SortDirection } from "@/lib/dtos/expenses.dto";

const VALID_SORT_FIELDS: ExpenseSortField[] = ["expenseDate", "amount", "concept"];
const VALID_SORT_DIRS: SortDirection[] = ["asc", "desc"];

interface ExpensesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const sortBy = VALID_SORT_FIELDS.includes(params.sortBy as ExpenseSortField)
    ? (params.sortBy as ExpenseSortField)
    : "expenseDate";
  const sortDir = VALID_SORT_DIRS.includes(params.sortDir as SortDirection)
    ? (params.sortDir as SortDirection)
    : "desc";

  const data = await getExpensesPageData(session.user.id, page, 10, {
    search: params.search || undefined,
    categoryId: params.category || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
    sortBy,
    sortDir,
  });

  return (
    <MainSection>
      <div className="flex sm:items-center items-start justify-between gap-4 mb-4 sm:flex-row flex-col">
        <TitleHeader
          title="Expenses"
          description="Real-time audit log and historical expenditure tracking."
          icon={<ReceiptText />}
        />
        <div className="flex items-center gap-3">
          <ExportButton
            data={{
              title: "Expenses Report",
              filename: `expenses_${format(new Date(), "yyyy-MM-dd")}`,
              columns: [
                { header: "Date", key: "formattedDate" },
                { header: "Concept", key: "concept" },
                { header: "Category", key: "categoryName" },
                { header: "Amount", key: "formattedAmount" }
              ],
              data: data.expenses.map(e => ({
                ...e,
                categoryName: e.category?.name ?? "Uncategorized",
                formattedDate: format(new Date(e.expenseDate), "PP"),
                formattedAmount: `${Number(e.amount).toFixed(2)}`
              })),
              summary: {
                "Total (This Month)": `${data.summary.monthTotal.toFixed(2)}`,
                "Count": data.expenses.length
              }
            }}
          />
          <NewExpenseModal />
        </div>
      </div>
      <ExpensesDataSummary summary={data.summary} />
      <ExpensesTable
        expenses={data.expenses}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        categories={data.categories}
        filters={data.filters}
      />
    </MainSection>
  );
}
