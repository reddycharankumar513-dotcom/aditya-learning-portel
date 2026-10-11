import React from 'react';
import { Hero } from '../components/home/Hero';
import { AboutPreview } from '../components/home/AboutPreview';
import { ProgramsPreview } from '../components/home/ProgramsPreview';
import { LearningProcess } from '../components/home/LearningProcess';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { AITutorTeaser } from '../components/home/AITutorTeaser';
import { FAQ } from '../components/home/FAQ';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <AboutPreview />
      <ProgramsPreview />
      <LearningProcess />
      <FeaturedProjects />
      <AITutorTeaser />
      <FAQ />
    </div>
  );
};
