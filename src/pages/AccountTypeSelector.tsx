
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  role: "user" | "admin";
  setRole: (role: "user" | "admin") => void;
}

const AccountTypeSelector = ({ role, setRole }: Props) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      Account Type
    </label>
    <RadioGroup
      value={role}
      onValueChange={(value) => setRole(value as "user" | "admin")}
      className="flex space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="user" id="user-role" />
        <Label htmlFor="user-role">User</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="admin" id="admin-role" />
        <Label htmlFor="admin-role">Admin</Label>
      </div>
    </RadioGroup>
  </div>
);

export default AccountTypeSelector;
