import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProfessionalExperience from "@/components/ProfessionalExperience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-800">
			<div id="#">
				<Hero />
			</div>
			<div id="about" className="py-8 xl:py-12">
				<About />
			</div>
			<div id="skills" className="py-8 xl:py-12">
				<Skills />
			</div>
			<div id="experience" className="py-8 xl:py-12">
				<ProfessionalExperience />
			</div>
			<div id="projects" className="py-8 xl:py-12">
				<Projects />
			</div>
			<div id="contact" className="py-8 xl:py-12">
				<Contact />
			</div>
		</div>
	);
}
