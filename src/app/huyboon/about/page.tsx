import About from "@/components/homelayout/About";
import Contact from "@/components/homelayout/Contact";
import Hero from "@/components/homelayout/Hero";
import ProfessionalExperience from "@/components/homelayout/ProfessionalExperience";
import Projects from "@/components/homelayout/Projects";
import Skills from "@/components/homelayout/Skills";

export default function AboutHuyBoon() {
	return (
		<div className="min-h-screen bg-gray-800">
			<div>
				<Hero />
			</div>
			<div className="py-8 xl:py-12">
				<About />
			</div>
			<div className="py-8 xl:py-12">
				<Skills />
			</div>
			<div className="py-8 xl:py-12">
				<ProfessionalExperience />
			</div>
			<div className="py-8 xl:py-12">
				<Projects />
			</div>
			<div className="py-8 xl:py-12">
				<Contact />
			</div>
		</div>
	);
}
