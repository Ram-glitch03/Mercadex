import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'client' | null;

interface AuthContextType {
    role: UserRole;
    login: (role: UserRole) => void;
    logout: () => void;
    saeClientId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>(null);

    const login = (newRole: UserRole) => setRole(newRole);
    const logout = () => setRole(null);

    return (
        <AuthContext.Provider value={{ role, login, logout, saeClientId: role === 'client' ? 'CLI-001' : undefined }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
