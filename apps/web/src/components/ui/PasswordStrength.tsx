'use client';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
  bg: string;
} {
  if (!password) return { score: 0, label: '', color: '', bg: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'text-emergency', bg: 'bg-emergency' };
  if (score <= 4) return { score, label: 'Fair', color: 'text-warning', bg: 'bg-warning' };
  if (score === 5) return { score, label: 'Good', color: 'text-safe', bg: 'bg-safe' };
  return { score, label: 'Strong', color: 'text-safe', bg: 'bg-safe' };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color, bg } = getStrength(password);
  if (!password) return null;

  const segments = 4;
  const filled = Math.ceil((score / 6) * segments);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < filled ? bg : 'bg-white/10',
            ].join(' ')}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${color}`}>{label} password</p>
    </div>
  );
}
