import { getPortfolioData } from '@/lib/db';
import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { Practice } from '@/components/sections/Practice';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Certificates } from '@/components/sections/Certificates';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/Footer';
import { CommandPalette } from '@/components/CommandPalette';
import { CustomSections } from '@/components/sections/CustomSections';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <>
      <Header />
      <main id="main">
        {/* 01 Identity & Availability */}
        <Hero data={data.hero} socials={data.socials} />

        {/* 02 Focus Matrix (Medicine × Design × Tech) */}
        <Practice data={data.practice} />

        {/* 03 Story & Background */}
        <About data={data.about} stats={data.stats} />

        {/* 04 Curated Selected Work with Live Search & Category Counts */}
        <Work
          header={data.work_header}
          projects={data.projects}
          socials={data.socials}
        />

        {/* 05 Verified Credentials & Certificates */}
        <Certificates data={data.certificates} />

        {/* 06 Capabilities & Toolkit */}
        <Skills data={data.skills} />

        {/* 07 Academic Journey & CV */}
        <Education data={data.education} />

        {/* 08 Direct Inquiry & Reachout */}
        <Contact data={data.contact} socials={data.socials} />

        {/* Optional Custom Sections created via /admin */}
        <CustomSections sections={data.custom_sections} />
      </main>

      {/* Global Command Palette (⌘K) with Project Search */}
      <CommandPalette
        projects={data.projects}
        certificates={data.certificates.items}
      />

      {/* Footer */}
      <Footer footer={data.footer} socials={data.socials} />
    </>
  );
}
