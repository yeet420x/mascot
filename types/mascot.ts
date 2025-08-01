export type TraitCategory = 'head' | 'eyes' | 'glasses' | 'shirt' | 'pants' | 'shoes' | 'accessories' | 'background' | 'hat' | 'bowtie'

export interface MascotTraits {
  head: string
  eyes: string
  glasses: string
  shirt: string
  pants: string
  shoes: string
  accessories: string
  background: string
  hat: string
  bowtie: string
}

export interface MascotData {
  id?: string
  name: string
  traits: MascotTraits
  imageUrl?: string
}

export interface TraitOption {
  id: string
  name: string
  imageUrl?: string
  color?: string
}

export interface TraitCategoryData {
  category: TraitCategory
  label: string
  options: TraitOption[]
} 