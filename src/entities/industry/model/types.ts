export interface IndustryItem {
  id: string
  name: string
}

export interface IndustryCategory {
  id: string
  name: string
  industries: IndustryItem[]
}
