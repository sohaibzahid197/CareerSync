import Image from "next/image";
import RedirectToLogin from "@/components/redirectComponents/RedirectToLogin";
import CanidateHeroSection from "@/components/dashboardComponents/CanidateHeroSection";

export default function Home() {

  return <RedirectToLogin><CanidateHeroSection/></RedirectToLogin>
}
