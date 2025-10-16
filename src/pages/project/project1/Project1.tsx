import React from 'react';
import { ProjectProvider } from '@/contexts';
import { ProjectPage } from '../ProjectPage';
import { sampleWorkflows } from '@/data';

const Project1Content = () => {
    return <ProjectPage agentWorkflowData={sampleWorkflows} />;
};

export const Project1 = () => (
    <ProjectProvider>
        <Project1Content />
    </ProjectProvider>
);
