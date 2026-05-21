import { Select } from './ui/select';

type UserRole = 'hq' | 'regional' | 'facility';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'hq',
      label: 'HQ Dashboard',
      description: 'Chief Operating Officer - Pan-India Network View',
    },
    {
      value: 'regional',
      label: 'Regional Dashboard',
      description: 'Regional Operations Manager - South Region',
    },
    {
      value: 'facility',
      label: 'Facility Dashboard',
      description: 'Facility Manager - Chennai Facility',
    },
  ];

  return (
    <div className="w-full max-w-md p-4 bg-card rounded-lg shadow-md border border-border">
      <label className="text-sm font-semibold text-foreground mb-2 block">
        Select Dashboard Role
      </label>
      <Select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value as UserRole)}
        className="w-full"
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </Select>
      <p className="text-xs text-muted-foreground mt-2">
        {roles.find((r) => r.value === currentRole)?.description}
      </p>
    </div>
  );
}
