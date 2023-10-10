export class TestModel {
    id!:                   number;
    test_id!:              string;
    name!:                 string;
    threads!:              number;
    folder_id!:            number;
    script:                string = "";
    before_script:         string = "";
    after_script:          string = "";
    permissions!:          string;
    web:                   boolean = false;
    test_cases_id!:        number;
    test_cases:            string = "";  
    last_execution_state!: string;
    is_running!:           boolean;
    description!:          string;
}