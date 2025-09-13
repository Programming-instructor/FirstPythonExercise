import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllUsers } from '@/hooks/useGetAllUsers';
import { useAddUser } from '@/hooks/useAddUser';
import type { AddUserData } from '@/types/user';

export default function UsersPage() {
  const { data, isLoading, error } = useGetAllUsers();
  const { mutate: addUser, isPending: isAdding } = useAddUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddUserData>({
    mobile: '',
    role: '',
    name: '',
    permissions: [],
  });

  const roleTranslations: { [key: string]: string } = {
    principal: 'مدیر',
    academic_counseling: 'مشاوره تحصیلی',
    educational_deputy: 'معاونت آموزشی',
    psych_counselor: 'مشاور روانکاوی',
    disciplinary_deputy: 'معاونت انضباطی'
  };

  const permissionTranslations: { [key: string]: string } = {
    register_student: 'ثبت نام هنرجوی جدید',
    manage_students: 'لیست دانش آموزان',
    register_teachers: 'ثبت نام اساتید',
    evaluate_performance: 'ارزیابی و عملکرد',
    academic_counseling: 'واحد مشاوره تحصیلی',
    educational_deputy: 'معاونت آموزشی',
    psych_counselor: 'مشاور روانکاوی',
    disciplinary_deputy: 'معاونت انضباطی',
    principal: 'مدیر',
    manage_users: 'مدیریت کاربران ویژه',
  };

  const validRoles = ['principal', 'academic_counseling', 'educational_deputy', 'psych_counselor', 'disciplinary_deputy'];
  const validPermissions = [
    'register_student',
    'manage_students',
    'register_teachers',
    'evaluate_performance',
    'academic_counseling',
    'educational_deputy',
    'psych_counselor',
    'principal',
    'manage_users',
    'disciplinary_deputy'
  ];

  const handleAddUser = () => {
    addUser(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ mobile: '', role: '', name: '', permissions: [] });
      },
      onError: (error) => {
        console.error('خطا در افزودن کاربر:', error);
      },
    });
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...(prev.permissions || []), permission]
        : (prev.permissions || []).filter((p) => p !== permission),
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8 font-noto" dir="rtl">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            مدیریت کاربران
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-200"
            >
              افزودن کاربر
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-200"
            >
              <Link to="/admin">بازگشت به داشبورد</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <Table className="w-full min-w-full overflow-visible">
            <TableCaption className="text-gray-600">لیست کاربران</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 text-start">نام</TableHead>
                <TableHead className="font-semibold text-gray-700 text-start">موبایل</TableHead>
                <TableHead className="font-semibold text-gray-700 text-start">نقش</TableHead>
                <TableHead className="font-semibold text-gray-700 text-start">مجوزها</TableHead>
                <TableHead className="font-semibold text-gray-700 text-start">ادمین</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>در حال بارگذاری...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-red-500">
                    خطا: {error.message}
                  </TableCell>
                </TableRow>
              ) : data?.users && data?.users.length > 0 ? (
                data.users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="text-gray-800">{user.name}</TableCell>
                    <TableCell className="text-gray-800">{user.mobile}</TableCell>
                    <TableCell className="text-gray-800">
                      {roleTranslations[user.role] || user.role}
                    </TableCell>
                    <TableCell className="text-gray-800 max-w-xl text-wrap whitespace-normal leading-7">
                      {user.permissions
                        .map((p) => permissionTranslations[p] || p)
                        .join(' - ') || 'هیچکدام'}
                    </TableCell>
                    <TableCell className="text-gray-800">{user.isAdmin ? 'بله' : 'خیر'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    هیچ کاربری یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="font-noto" dir='rtl'>
          <DialogHeader dir='ltr'>
            <DialogTitle>افزودن کاربر جدید</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">نام</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">موبایل</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">نقش</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                value={formData.role}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="انتخاب نقش" />
                </SelectTrigger>
                <SelectContent>
                  {validRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleTranslations[role] || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">مجوزها</Label>
              <div className="col-span-3 flex flex-col gap-2">
                {validPermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id="permission"
                      checked={formData.permissions?.includes(permission)}
                      onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                    />
                    <Label htmlFor={permission}>{permissionTranslations[permission] || permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              لغو
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={isAdding || !formData.name || !formData.mobile || !formData.role}
            >
              {isAdding ? 'در حال افزودن...' : 'افزودن کاربر'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}