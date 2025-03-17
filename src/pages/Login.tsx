
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        setLoading(false);
        return;
      }

      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate("/calendar");
        }
      } else {
        const success = await register(email, password);
        if (success) {
          toast.success("Verifique seu email para ativar sua conta.");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setConfirmPassword(""); // Clear confirmation field when switching
  };

  return (
    <div className="container flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-light text-center">
            {isLogin ? "Login" : "Cadastre-se"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Acesse para gerenciar seus eventos" 
              : "Crie sua conta para gerenciar seus eventos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Após o cadastro, você receberá um email de confirmação. 
                      Caso não receba, verifique sua caixa de spam.
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <Button 
              className="w-full" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={toggleMode}
            className="text-sm"
          >
            {isLogin
              ? "Não tem uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
