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

export type ColumnType = 'text' | 'date' | 'currency' | 'badge' | 'boolean' | 'avatar';

export interface TableColumn {
    key: string;          // Propiedad del DTO (ej: 'email')
    label: string;        // Encabezado (ej: 'Correo')
    type: ColumnType;     // Formateador a usar

    /** * Control Responsive:
     * - 'always': Visible en todo dispositivo.
     * - 'md': Visible desde tablets en adelante.
     * - 'lg': Solo visible en desktop.
     */
    responsive?: 'always' | 'md' | 'lg';

    sortable?: boolean;
}

export interface ObjectPage {
    slug: string; // slug to identify the page (LINK TO OBJECTSIDEBAR)
    title: string;
    subtitle: string;
    columns: TableColumn[];
    actions: ObjectActionsScreens[];
    actionsRows: ObjectActionsRows[];
    form?: FormStructure;
}


export interface ObjectDashboard {
    sidebar: ObjectSidebar[];
    pages: ObjectPage[];
}
