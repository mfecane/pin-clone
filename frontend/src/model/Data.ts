export interface Collection {
	id: string
	name: string
	pinned: boolean
}

export interface CollectionWithImages extends Collection {
	images: CollectionImage[]
}

export interface CollectionImage {
	id: string
	path: string
	collectionId: string
	width?: number
	height?: number
}