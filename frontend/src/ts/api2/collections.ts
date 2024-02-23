import { Timestamp, addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db, storage, STORAGE_URL } from '@/ts/firebase'
import { Collection, CollectionImage, CollectionWithImages } from '@/ts/model/Data'
import { getDownloadURL, ref } from 'firebase/storage'
import { getImageDimensions } from '../utils/utils'

async function getCollections(userId: string): Promise<Collection[]> {
	const q = query(collection(db, 'collections'), where('user', '==', userId))
	const s = await getDocs(q)
	const d2: Collection[] = []
	s.forEach((d) => {
		let data = d.data() as Collection
		data = { ...data, id: d.id }
		d2.push(data)
	})
	return d2
}

export async function getCollectionsWithImages(userId: string): Promise<CollectionWithImages[]> {
	const collections = await getCollections(userId)
	const collections2: CollectionWithImages[] = []
	for (const c of collections) {
		const q = query(collection(db, 'images'), where('collectionId', '==', c.id))
		const s = await getDocs(q)
		const coll = c as CollectionWithImages
		coll.images = s.docs.map((i) => ({ ...i.data(), id: i.id } as CollectionImage))
		for (let i = 0; i < coll.images.length; ++i) {
			await resolveImage(coll.images[i])
		}
		collections2.push(coll)
	}
	return collections2
}

async function resolveImage(image: CollectionImage) {
	const p = image.path
	if (p) {
		image.path = (await resolvePath(p)) as string
	}
	const [width, height] = await getImageDimensions(image.path)
	image.width = width
	image.height = height
}

async function resolvePath(path: string): Promise<string | null> {
	const imagesRef = ref(storage, path)
	let downloadUrl = ''
	try {
		downloadUrl = await getDownloadURL(imagesRef)
	} catch (error) {
		return null
	}
	downloadUrl = downloadUrl.replace(/http\:\/\/database\:9199\//, STORAGE_URL)
	return downloadUrl
}

export async function createCollection(name: string, userId: string) {
	const docRef = await addDoc(collection(db, 'collections'), { name: name, user: userId, updated: Timestamp.now() })
	return docRef.id
}