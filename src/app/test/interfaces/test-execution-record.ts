export interface TestExecutionRecord {
    id:                number;
    test_execution_id: string;
    test_id:           number;
    test_results_dir:  string;
    status:            number;
    date:              Date;
    user:              string;
}