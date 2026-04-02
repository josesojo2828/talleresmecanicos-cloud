
export const getFullImagePath = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
        return path;
    }

    const returnPath = `/talleres-mecanicos/${path}`;
    console.log('IMAGE PATH:', returnPath)
    // Todos los archivos subidos están en el bucket de MinIO expuesto vía Nginx en /talleres-mecanicos/
    return returnPath;
};
