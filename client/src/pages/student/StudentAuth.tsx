// Create a new file for the StudentAuth page, e.g., pages/StudentAuth.tsx

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
import { useSendOTPStudent } from "@/hooks/useSendOTPStudent";
import { useLoginStudent } from "@/hooks/useLoginStudent";

const StudentAuth = () => {
  const [onOTP, setOnOTP] = useState<boolean>(false);
  const [student_phone, setStudentPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const sendOTPMutation = useSendOTPStudent();
  const loginMutation = useLoginStudent();

  // Handle sending OTP
  const handleSendOTP = () => {
    if (!student_phone || !/^\d{10,11}$/.test(student_phone)) {
      setError("لطفاً شماره موبایل معتبر وارد کنید (۱۰ یا ۱۱ رقم)");
      return;
    }
    setError(null);
    sendOTPMutation.mutate(student_phone, {
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
    loginMutation.mutate({ student_phone, otp }, {
      onSuccess: () => {
        navigate("/student"); // Adjust the redirect path as needed (e.g., to student dashboard)
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
          <p className="font-bold text-lg">ورود به پنل دانش‌آموز</p>
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
                value={student_phone}
                onChange={(e) => setStudentPhone(e.target.value)}
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

export default StudentAuth;