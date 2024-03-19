import TableApp from "@/components/dashboard/TableApp";
import MainNav from "@/components/dashboard/MainNav";
import { redirect } from "next/navigation";
import { readUserSession } from "../actions";

export default async function DashboardPage() {
  const { data } = await readUserSession();

  if (!data.session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col">
      <MainNav user={data.session.user} />
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your licenses!
            </p>
          </div>
        </div>
        <TableApp />
      </div>
    </div>
  );
}
