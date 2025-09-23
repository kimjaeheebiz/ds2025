import React from 'react';
import { ProjectProvider } from '../ProjectContext';
import { ProjectPage } from '../components';
import { sampleWorkflows } from '../ProjectData';

const Project2Content = () => {
    return <ProjectPage agentWorkflowData={sampleWorkflows as any} />;
};

export const Project2 = () => (
    <ProjectProvider>
        <Project2Content />
    </ProjectProvider>
);