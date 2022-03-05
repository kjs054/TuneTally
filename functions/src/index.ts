import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

export const updateAverageRating = functions.firestore
    .document('ratings/{ratingId}')
    .onWrite((change) => {
        const after_data = change?.after?.data();
        const before_data = change?.before?.data();
        const ref = db.collection("releases").doc(before_data ? before_data.release_id : after_data?.release_id);
        if (!after_data) {
            return ref.get().then(doc => {
                const value = getAverage(doc, undefined, before_data?.rating);
                return ref.set({ rating: value.rating, count: value.count, release_id: before_data?.release_id });
            });
        } else {
            return ref.get().then(doc => {
                const value = getAverage(doc, after_data.rating, before_data?.rating);
                return ref.set({ rating: value.rating, count: value.count, release_id: after_data?.release_id });
            });
        }
    });


function getAverage(docRef: DocumentSnapshot, new_rating?: number, previous_rating?: number) {
    // Check if release doc exists to add to existing count. If it doesnt start count at 1 with the first rating
    if (docRef.exists) {
        const data = docRef?.data() ?? [];
        const count = data.count;
        const current_average = data.rating;
        // Check if the user has already posted a rating to this release
        if (!previous_rating && new_rating) {
            const new_average = ((current_average * count) + new_rating) / (count + 1);
            return { rating: new_average, count: (count + 1) };
        } else {
            let removed = ((current_average * count) - previous_rating!) / (count - 1);
            if (Number.isNaN(removed)) {
                removed = 0;
            }
            if (previous_rating && new_rating) {
                const new_average = ((removed * (count - 1)) + new_rating) / count;
                return { rating: new_average, count: count };
            } else {
                return { rating: removed, count: count - 1 };
            }
        }
    } else {
        return { rating: new_rating, count: 1 };
    }
}

export const emails = require('./email-functions');