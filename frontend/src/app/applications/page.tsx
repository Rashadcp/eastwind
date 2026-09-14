import { redirect } from "next/navigation";

export default function ApplicationsRootPage() {
  redirect("/solutions?type=applications");
}
