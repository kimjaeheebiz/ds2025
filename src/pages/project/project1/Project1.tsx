import React from 'react';
import { ProjectProvider } from '../ProjectContext';
import { ProjectPage } from '../components';
import { sampleWorkflows } from '../ProjectData';

const Project1Content = () => {
    return <ProjectPage agentWorkflowData={sampleWorkflows as any} />;
};

export const Project1 = () => (
    <ProjectProvider>
        <Project1Content />
    </ProjectProvider>
);
