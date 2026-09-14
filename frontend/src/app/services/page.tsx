import { redirect } from "next/navigation";

export default function ServicesRootPage() {
  redirect("/solutions?type=services");
}
