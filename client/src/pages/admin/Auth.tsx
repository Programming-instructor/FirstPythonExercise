import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "@/hooks/useSendOTP";
import { useLogin } from "@/hooks/useLogin";

const Auth = () => {
  const [onOTP, setOnOTP] = useState<boolean>(false);
  const [mobile, setMobile] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const sendOTPMutation = useSendOTP();
  const loginMutation = useLogin();

  // Handle sending OTP
  const handleSendOTP = () => {
    if (!mobile || !/^\d{10,11}$/.test(mobile)) {
      setError("لطفاً شماره موبایل معتبر وارد کنید (۱۰ یا ۱۱ رقم)");
      return;
    }
    setError(null);
    sendOTPMutation.mutate(mobile, {
      onSuccess: () => {
        setOnOTP(true);
      },
    });
  };

  // Handle login with OTP
  const handleLogin = () => {
    if (!otp || otp.length !== 6) {
      setError("لطفاً کد ۶ رقمی معتبر وارد کنید");
      return;
    }
    setError(null);
    loginMutation.mutate({ mobile, otp }, {
      onSuccess: () => {
        navigate("/admin/dashboard");
      },
    });
  };

  // Handle button click (send OTP or login)
  const handleSubmit = () => {
    if (!onOTP) {
      handleSendOTP();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader className="flex justify-center">
          <p className="font-bold text-lg">ورود به سامانه اتوماسیون اداری</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 items-center">
          {error && (
            <p className="text-red-500 text-sm text-center" dir="rtl">
              {error}
            </p>
          )}
          {onOTP ? (
            <div className="w-full flex flex-col gap-3 items-center">
              <Label htmlFor="otpInput" dir="rtl" className="mb-3">
                کد ۶ رقمی
              </Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <div dir="rtl" className="w-full flex flex-col gap-3">
              <Label htmlFor="phoneNumberInput">شماره موبایل</Label>
              <Input
                type="tel"
                id="phoneNumberInput"
                placeholder="09123456789"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            disabled={sendOTPMutation.isPending || loginMutation.isPending}
          >
            {(sendOTPMutation.isPending || loginMutation.isPending)
              ? "در حال پردازش..."
              : onOTP
                ? "تایید کد"
                : "ارسال کد"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;