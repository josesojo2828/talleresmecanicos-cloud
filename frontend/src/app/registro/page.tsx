import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Únete a Somos Nexo"
            subtitle="Crea tu cuenta gratis en minutos"
        >
            <RegisterForm />
        </AuthLayout>
    );
}
