
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

// Nome público do site Supabase para o captcha
const SITE_KEY = "HOSTED";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [isAuthenticated, navigate]);

  // Carregar o script do Turnstile (Cloudflare Captcha)
  useEffect(() => {
    const loadTurnstile = () => {
      const existingScript = document.getElementById('cf-turnstile-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.id = 'cf-turnstile-script';
        document.body.appendChild(script);
      }
    };

    if (!isLogin) {
      loadTurnstile();
      
      // Limpar função de callback ao desmontar
      return () => {
        window.turnstileCallback = undefined;
      };
    }
  }, [isLogin]);

  // Renderizar o captcha quando o script estiver carregado
  useEffect(() => {
    if (!isLogin && window.turnstile) {
      // Definir callback para o captcha
      window.turnstileCallback = (token: string) => {
        setCaptchaToken(token);
      };

      // Renderizar o widget do captcha
      const turnstileContainer = document.getElementById('cf-turnstile-container');
      if (turnstileContainer && turnstileContainer.childElementCount === 0) {
        window.turnstile.render('#cf-turnstile-container', {
          sitekey: SITE_KEY,
          callback: 'turnstileCallback',
        });
      }
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        setLoading(false);
        return;
      }

      const success = isLogin
        ? await login(email, password)
        : await register(email, password, captchaToken);

      if (success) {
        navigate("/calendar");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setConfirmPassword(""); // Limpar o campo de confirmação ao alternar
    setCaptchaToken(null); // Limpar token do captcha
    
    // Recarregar o captcha quando mudar para registro
    if (isLogin && window.turnstile) {
      setTimeout(() => {
        window.turnstile.reset();
      }, 100);
    }
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
                
                <div className="space-y-2">
                  <Label htmlFor="captcha">Verificação de Segurança</Label>
                  <div id="cf-turnstile-container" className="flex justify-center mt-2"></div>
                </div>
              </>
            )}
            
            <Button className="w-full" type="submit" disabled={loading || (!isLogin && !captchaToken)}>
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

// Declarar tipos globais para o Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (selector: string, options: any) => string;
      reset: (widgetId?: string) => void;
    };
    turnstileCallback?: (token: string) => void;
  }
}

export default Login;
