export interface AiInteraction {
    id: number;
    testExecutionId: string;
    agentName: string;
    prompt: string;
    response: string;
    status: string;
    errorMessage: string;
    createdAt: string;
}
