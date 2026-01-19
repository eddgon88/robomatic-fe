export interface TestRecord {
    id:                   number;
    record_id:            string;
    name:                 string;
    user:                 string;
    folder_id:            number;
    type:                 string;
    permissions:          string;
    last_update:          Date;
    last_execution:       Date;
    last_execution_state: string;
    is_running:           boolean;
    web:                  boolean;
}