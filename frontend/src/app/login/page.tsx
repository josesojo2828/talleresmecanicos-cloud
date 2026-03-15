import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout
            title="Bienvenido de vuelta"
            subtitle="Ingresa a tu cuenta de Somos Nexo"
        >
            <LoginForm />
        </AuthLayout>
    );
}
