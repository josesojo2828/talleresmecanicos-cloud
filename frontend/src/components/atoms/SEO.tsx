import React from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    schema?: any; // JSON-LD
    image?: string;
    url?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, schema, image, url }) => {
    return (
        <>
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            )}
        </>
    );
};
