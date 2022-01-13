import { getAuth } from 'firebase/auth'
import {
  getDocs,
  addDoc,
  updateDoc,
  collection,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

export async function createDelivery(payload) {
  const { recipient, address, parcel, amount, delivery_date } = payload
  const auth = getAuth()
  const deliveriesRef = collection(db, 'deliveries')
  const docRef = await addDoc(deliveriesRef, {
    recipient,
    address,
    parcel,
    amount,
    status: 'initiate',
    author: auth.currentUser.uid,
    delivery_date: Timestamp.fromDate(new Date(delivery_date)),
    created_at: serverTimestamp()
  })

  return {
    id: docRef.id
  }
}

export async function fetchDeliveries() {
  const auth = getAuth()
  const deliveriesCol = query(
    collection(db, 'deliveries'),
    where('author', '==', auth.currentUser.uid)
  )
  const deliverySnapshot = await getDocs(deliveriesCol)

  return deliverySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function getDeliveries(...queries) {
  const deliveriesCol = collection(db, 'deliveries')
  let deliveriesQuery

  if (queries && queries.length) {
    // TODO: Create index for created_at to enabled order
    deliveriesQuery = query(deliveriesCol, ...queries)
  } else {
    deliveriesQuery = query(deliveriesCol, orderBy('created_at', 'desc'))
  }

  const deliveriesSnap = await getDocs(deliveriesQuery)

  return deliveriesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function updateDeliveryStatus(delivery, status) {
  const deliveryRef = doc(db, 'deliveries', delivery.id)

  await updateDoc(deliveryRef, { status })
}
