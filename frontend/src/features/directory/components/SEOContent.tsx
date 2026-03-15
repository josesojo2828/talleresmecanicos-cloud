import React from 'react';

export const SEOContent = () => {
    return (
        <section className="mt-12 p-8 bg-white/40 border border-white rounded-[3rem] text-slate-500 text-[10px] leading-relaxed">
            <h2 className="text-slate-900 font-black uppercase tracking-widest mb-4">Los Mejores Talleres Mecánicos en México y Latinoamérica</h2>
            <p className="mb-4">
                Si estás buscando <strong>talleres mecánicos en México</strong>, has llegado al lugar indicado. Nuestra red conecta a conductores con los expertos más calificados en mecánica automotriz, desde mantenimiento preventivo hasta reparaciones complejas de motor y transmisión.
            </p>
            <p className="mb-4">
                En nuestro directorio, puedes encontrar <strong>talleres mecánicos cerca de tu ubicación</strong> con servicios garantizados. Contamos con una amplia base de datos que incluye talleres especializados en marcas específicas, frenos, suspensión, y diagnóstico por computadora.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                    <h3 className="text-slate-800 font-bold uppercase mb-2">Servicios Populares</h3>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Afinación Mayor</li>
                        <li>Cambio de Aceite y Filtros</li>
                        <li>Reparación de Frenos</li>
                        <li>Diagnóstico con Escáner</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-slate-800 font-bold uppercase mb-2">Presencia en LATAM</h3>
                    <p>
                        Estamos presentes en las principales ciudades de México, Argentina, Chile y Colombia, asegurando que siempre encuentres un experto de confianza.
                    </p>
                </div>
            </div>
        </section>
    );
};
