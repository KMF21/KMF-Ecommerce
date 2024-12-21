'use client'
import { Category } from '@/sanity.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from './button'

interface CategorySelectorProps {
  categories: Category[]
}

export function CategorySelectorComponent({
  categories,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')
  const router = useRouter()

  const handleSelect = (category: string) => {
    setValue(category)
    setOpen(false)
    router.push(`/categories/${category}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className=" items-center justify-center w-full mx-w-full relative sm:justify-start sm:flex-none space-x-2 bg-blue-500 hover:bg-blue-700 hover:text-white text-white font-bold px-4 py-2 text-sm 
        border rounded focus:outline-none"
        >
          {value
            ? categories.find((cat) => cat._id === value)?.title
            : 'Select a category'}
          <ChevronsUpDown className="w-4 h-4 ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        // className="w-full p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search categories..."
            className="w-[h-9]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const selectedCategory = categories.find((c) =>
                  c.title
                    ?.toLocaleLowerCase()
                    .includes(e.currentTarget.value.toLowerCase())
                )
                if (selectedCategory?.slug?.current) {
                  setValue(selectedCategory._id)
                  router.push(`/categories/${selectedCategory.slug.current}`)
                  setOpen(false)
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.title}
                  onSelect={() => {
                    setValue(value === category._id ? '' : category._id)
                    router.push(`/categories/${category.slug?.current}`)
                    setOpen(false)
                  }}
                >
                  {category.title}
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category._id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
