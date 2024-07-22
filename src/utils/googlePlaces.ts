import { Context } from "hono";

declare type GooglePlacesResponse = {
    candidates: {
        photos: {
            photo_reference: string;
        }[];
    }[];
};

declare type GooglePlacesPhoto = {
    photo_reference: string;
};

/**
 * Retrieves an image from Google Places API based on the provided place name.
 * @param c - The context object containing the request parameters and environment variables.
 * @returns A Promise that resolves to a Response object containing the image.
 */
export async function getImage(c: Context) {
    const {name} = c.req.param();

    //find place by nam eusing Google Places API
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${c.env.GOOGLE_PLACES_API_KEY}&input=${name}&inputtype=textquery&fields=photos`);
    const data = await response.json() as GooglePlacesResponse;

    console.log(data);

    //get photo reference
    const photoReference = data.candidates[0].photos[0].photo_reference;



    //get photo by reference
    const photo = await fetch(`https://maps.googleapis.com/maps/api/place/photo?key=${c.env.GOOGLE_PLACES_API_KEY}&photoreference=${photoReference}&maxheight=1600`);
    const photoBlob = await photo.blob() as Blob;

    return new Response(photoBlob, {
        headers: {
            'content-type': 'image/jpeg',
        },
    });


}