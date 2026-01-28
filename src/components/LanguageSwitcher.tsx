import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, languageNames, languageFlags, Language } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const languages: Language[] = ['en', 'nl', 'es', 'fr'];

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <span className="text-lg">{languageFlags[language]}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px] bg-popover z-50">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
              className={lang === language ? 'bg-accent' : ''}
            >
              <span className="text-lg mr-2">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <span className="text-lg mr-1">{languageFlags[language]}</span>
          <span className="hidden sm:inline">{languageNames[language]}</span>
          <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] bg-popover z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => {
              setLanguage(lang);
              setOpen(false);
            }}
            className={lang === language ? 'bg-accent' : ''}
          >
            <span className="text-lg mr-2">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
