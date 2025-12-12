import type { FC } from "react";
import { Button } from "@/presentation/components/ui/button";

type Props = {
  onLogin: () => void;
};

const LoginPage: FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-white shadow-lg border border-slate-200 p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-wide text-orange-500 uppercase">
            サンエムシステム
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            上流工程標準テンプレート
          </h1>
          <p className="text-sm text-slate-600">
            社内の Microsoft アカウントでサインインして利用してください。
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={onLogin}>
            Microsoft アカウントでログイン
          </Button>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            このアプリは社内限定です。社外アカウントではサインインできません。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
