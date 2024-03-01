import { STORAGE_URL, db, storage } from '@/firebase'
import { uploadImage } from '@/firebase/functions'
import { Collection, CollectionImage } from '@/model/Data'
import { makeid } from '@/utils/utils'
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { CollectionData } from './collections'

const FOLDER = 'images'

// won't work for free 😭
export async function createImageFromUrl(imageUrl: string): Promise<string> {
	const {
		data: { path },
	} = await uploadImage({ url: imageUrl })
	return createTmpImageRecord(path)
}

export async function uploadBlob(blob: Blob, imageType: string): Promise<string> {
	const filename = generateFilename(imageType)
	const path = `${FOLDER}/${filename}`
	const imagesRef = ref(storage, path)
	await uploadBytes(imagesRef, blob, {
		contentType: imageType,
	})
	return createTmpImageRecord(path)
}

function generateFilename(imageType: string): string {
	const filename = makeid(32)
	switch (imageType) {
		case 'image/png':
			return `${filename}.png`
		case 'image/jpeg':
			return `${filename}.jpg`
		default:
			throw new Error(`Image type ${imageType} is not supported`)
	}
}

export async function uploadFile(file: File): Promise<string> {
	const path = `${FOLDER}/${file.name}`
	const imagesRef = ref(storage, path)
	await uploadBytes(imagesRef, await file.arrayBuffer(), {
		contentType: file.type,
	})
	return createTmpImageRecord(path)
}

async function createTmpImageRecord(path: string): Promise<string> {
	const { id } = await addDoc(collection(db, 'tmp_images'), { path: path })
	return id
}

export async function getTmpImage(tmpImageId: string) {
	const { path } = (await getDoc(doc(db, 'tmp_images', tmpImageId))).data() as { path: string }
	return path
}

export async function assignTmpImageToCollection(collectionId: string, tmpImageId: string): Promise<void> {
	const path = await getTmpImage(tmpImageId)

	const r = doc(db, 'collections', collectionId)
	const cd = await getDoc(r)
	const cdd = cd.data() as CollectionData
	const images = [...(cdd.images ?? []), path]

	await updateDoc(doc(db, 'collections', collectionId), {
		images,
		updated: Timestamp.now(),
	})

	// discard tmp image record
	await deleteDoc(doc(db, 'tmp_images', tmpImageId))
}

export async function getTmpImageSource(tmpImageId: string) {
	const path = await getTmpImage(tmpImageId)
	return resolvePath(path)
}

export async function discardTmpImage(id: string): Promise<void> {
	const docRef = await getDoc(doc(db, 'images', id))
	if (!docRef.exists()) {
		throw 'File does not exist'
	}
	const path = docRef.data().path
	const imagesRef = ref(storage, path)
	try {
		await deleteObject(imagesRef)
	} catch {
		throw 'Could not delete'
	}
	// discard tmp image record
	await deleteDoc(doc(db, 'tmp_images', id))
}

export async function deleteImage(id: string): Promise<void> {
	throw new Error('Looks like some moron forgot to implement this shit')
}

export async function resolvePath(path: string): Promise<string | null> {
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