import React from 'react';
import { ProjectProvider } from '@/contexts';
import { ProjectPage } from '../ProjectPage';
import { sampleWorkflows } from '@/data';

const Project2Content = () => {
    return <ProjectPage agentWorkflowData={sampleWorkflows} />;
};

export const Project2 = () => (
    <ProjectProvider>
        <Project2Content />
    </ProjectProvider>
);