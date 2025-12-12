import { Toaster } from "@/presentation/components/ui/toaster";
import { Toaster as Sonner } from "@/presentation/components/ui/sonner";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./presentation/pages/Index";
import NotFound from "./presentation/pages/NotFound";
import Docs from "./presentation/pages/Docs";

import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useAuth } from "@/presentation/hooks/useAuth";
import LoginPage from "./presentation/pages/LoginPage";

const queryClient = new QueryClient();

const App = () => {
  const { isEmployee, isAdmin, login, logout } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* 未認証ユーザ用（SSOログイン画面だけを出す） */}
        <UnauthenticatedTemplate>
          <LoginPage onLogin={login} />
        </UnauthenticatedTemplate>

        {/* 認証済みユーザ用 */}
        <AuthenticatedTemplate>
          {/* 社員以外のアカウントは弾く */}
          {!isEmployee ? (
            <div className="p-4">
              <p className="mb-2">
                社内アカウント以外では、このアプリケーションは利用できません。
              </p>
              <button onClick={logout}>ログアウト</button>
            </div>
          ) : (
            // ここから先が「ログイン済み社員」だけに見せるルーティング
            <BrowserRouter>
              <Routes>
                {/* 必要なら Index 側で isAdmin を受け取って編集UIの表示制御に使う */}
                <Route path="/" element={<Index isAdmin={isAdmin} />} />
                {/* <Route path="/docs/*" element={<Docs />} /> */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </AuthenticatedTemplate>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
