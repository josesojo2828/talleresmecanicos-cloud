import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Únete a Somos Nexo"
            subtitle="Crea tu cuenta gratis en minutos"
        >
            <Suspense fallback={<div className="h-96 flex items-center justify-center">Cargando...</div>}>
                <RegisterForm />
            </Suspense>
        </AuthLayout>
    );
}
