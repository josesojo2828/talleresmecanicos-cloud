import { FormStructure } from "../form/generic.form";

export interface ObjectSidebar {
    icon: string;
    label: string;
    path: string;
    slug: string; // slug to identify the page (LINK TO OBJECTPAGE)
    childs?: ObjectSidebar[];
}

export interface ObjectActionsScreens {
    icon: string;
    label: string;
    action: string;
    type: 'page' | 'modal';
}

export interface ObjectActionsRows {
    icon: string;
    label: string;
    action: string;
    type: 'page' | 'modal';
}

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'date' | 'currency' | 'badge' | 'boolean' | 'avatar';
    responsive?: 'always' | 'md' | 'lg';
    sortable?: boolean;
}

export interface ObjectPage {
    slug: string; // slug to identify the page (LINK TO OBJECTSIDEBAR)
    title: string;
    subtitle: string;
    actions: ObjectActionsScreens[];
    actionsRows: ObjectActionsRows[];
    columns?: TableColumn[];
    form?: FormStructure;
    filters?: { key: string; label: string; type: 'select' | 'text'; options?: { label: string; value: string }[] }[];
}

export interface ObjectUserProfile {
}

export interface ObjectDashboard {
    sidebar: ObjectSidebar[];
    pages: ObjectPage[];
}
