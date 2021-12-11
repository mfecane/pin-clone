import { FirebaseOptions, initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const config: FirebaseOptions = {
	apiKey: import.meta.env.PINC_API_KEY,
	authDomain: import.meta.env.PINC_AUTH_DOMAIN,
	projectId: import.meta.env.PINC_PROJECTID,
	storageBucket: import.meta.env.PINC_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PINC_MESSAGING_SENDER_ID,
	appId: import.meta.env.PINC_APP_ID,
}

const app = initializeApp(config)
export const db = getFirestore(app)
export const storage = getStorage(app)

if (location.hostname === 'localhost') {
	connectFirestoreEmulator(db, 'localhost', 8080)
	connectStorageEmulator(storage, 'localhost', 9199)
}
