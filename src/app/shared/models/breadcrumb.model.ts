export interface Breadcrumb {
    label: string;
    url: string;
    action?: () => void;
}
