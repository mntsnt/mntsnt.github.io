import { getPortfolioData } from '@/lib/db';
import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Practice } from '@/components/sections/Practice';
import { Currently } from '@/components/sections/Currently';
import { Work } from '@/components/sections/Work';
import { Certificates } from '@/components/sections/Certificates';
import { Lab } from '@/components/sections/Lab';
import { Education } from '@/components/sections/Education';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { CustomSections } from '@/components/sections/CustomSections';
import { Footer } from '@/components/Footer';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <>
      <Header />
      <main id="main">
        {/* 01 Identity / Hero */}
        <Hero data={data.hero} socials={data.socials} />

        {/* 02 About */}
        <About data={data.about} stats={data.stats} />

        {/* 03 Practice */}
        <Practice data={data.practice} />

        {/* 04 Currently */}
        <Currently data={data.currently} />

        {/* 05 Selected Work */}
        <Work
          header={data.work_header}
          projects={data.projects}
          socials={data.socials}
        />

        {/* 06 Certificates */}
        <Certificates data={data.certificates} />

        {/* 07 Lab */}
        <Lab data={data.lab} />

        {/* 08 Education */}
        <Education data={data.education} />

        {/* 09 Skills */}
        <Skills data={data.skills} />

        {/* 10 Contact */}
        <Contact data={data.contact} socials={data.socials} />

        {/* Optional Custom Sections created via /admin */}
        <CustomSections sections={data.custom_sections} />
      </main>

      {/* Footer */}
      <Footer footer={data.footer} socials={data.socials} />
    </>
  );
}
