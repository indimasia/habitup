'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { habitIcons, habitIconNames, HabitIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface IconPickerProps {
  value: HabitIcon;
  onChange: (value: HabitIcon) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = habitIcons[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-5 w-5" />
            {value}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <ScrollArea className="h-72">
          <div className="grid grid-cols-5 gap-1 p-2">
            {habitIconNames.map(iconName => {
              const Icon = habitIcons[iconName];
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-12 w-full',
                    value === iconName && 'bg-accent'
                  )}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
