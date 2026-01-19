export interface CredentialModel {
    id?: number;
    credential_id?: string;
    test_id?: number;
    credential_type_id: number;
    credential_type_name?: string;
    name: string;
    file_name?: string;
    has_value?: boolean;
    // Campos solo para crear/actualizar (no se devuelven del backend)
    value?: string;
    file_content?: string;
}

export interface CreateCredentialRequest {
    test_id: number;
    credential_type_id: number;
    name: string;
    value?: string;
    file_name?: string;
    file_content?: string;
}

export interface UpdateCredentialRequest {
    id: number;
    credential_id?: string;
    name?: string;
    value?: string;
    file_name?: string;
    file_content?: string;
}

export enum CredentialType {
    PASSWORD = 1,
    CERTIFICATE = 2
}


