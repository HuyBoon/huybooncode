import About from "@/components/homelayout/About";
import Contact from "@/components/homelayout/Contact";
import Hero from "@/components/homelayout/Hero";
import ProfessionalExperience from "@/components/homelayout/ProfessionalExperience";
import Projects from "@/components/homelayout/Projects";
import Skills from "@/components/homelayout/Skills";
import HBHero from "@/components/services/HBHero";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-800">
			<div id="#">
				<HBHero />
			</div>
		</div>
	);
}
