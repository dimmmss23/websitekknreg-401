import { supabase } from './supabase';

// Bucket configuration
const BUCKET_NAME = 'Blog';

/**
 * Extract path from Supabase Storage URL
 * @param url - Full URL or path string
 * @returns Path string or null if invalid
 */
function extractPathFromUrl(url: string): string | null {
    if (!url) return null;

    // If it's already a path (not a URL), return it directly
    if (!url.startsWith('http')) {
        return url;
    }

    // Extract path from Supabase Storage URL
    const regex = /\/storage\/v1\/object\/public\/Blog\/(.+)$/;
    const match = url.match(regex);

    return match ? match[1] : null;
}

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param folder - Optional subfolder (e.g., 'artikel', 'thumbnail', 'gallery')
 * @returns Public URL of uploaded file or null if failed
 */
export async function uploadImage(
    file: File,
    folder?: string
): Promise<string | null> {
    try {
        // Get file extension
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        // Generate unique filename
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Build file path
        const filePath = folder ? `${folder}/${uniqueName}` : uniqueName;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error.message);
            return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload exception:', error);
        return null;
    }
}

/**
 * Delete image from Supabase Storage
 * @param imageUrl - Full URL or path of the image to delete
 * @returns Boolean indicating success/failure
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
    try {
        const path = extractPathFromUrl(imageUrl);

        if (!path) {
            console.error('Invalid image URL or path:', imageUrl);
            return false;
        }

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete exception:', error);
        return false;
    }
}

/**
 * Delete multiple images from Supabase Storage
 * @param imageUrls - Array of full URLs or paths of images to delete
 * @returns Boolean indicating success/failure
 */
export async function deleteMultipleImages(
    imageUrls: string[]
): Promise<boolean> {
    try {
        // Extract paths and filter out null values
        const paths = imageUrls
            .map((url) => extractPathFromUrl(url))
            .filter((path): path is string => path !== null);

        if (paths.length === 0) {
            console.warn('No valid paths to delete');
            return true;
        }

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(paths);

        if (error) {
            console.error('Delete multiple error:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete multiple exception:', error);
        return false;
    }
}

/**
 * Get public URL for an image
 * @param path - Path of the image in storage
 * @returns Public URL string
 */
export function getImageUrl(path: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * List images in a folder
 * @param folder - Optional folder path to list images from
 * @returns Array of file objects or null if failed
 */
export async function listImages(folder?: string) {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folder || '', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('List images error:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('List images exception:', error);
        return null;
    }
}

/**
 * Update image - delete old image and upload new one
 * @param oldImageUrl - URL of the old image to delete (null if no old image)
 * @param newFile - New file to upload
 * @param folder - Optional subfolder
 * @returns New public URL or null if failed
 */
export async function updateImage(
    oldImageUrl: string | null,
    newFile: File,
    folder?: string
): Promise<string | null> {
    try {
        // Delete old image if exists
        if (oldImageUrl) {
            const deleteSuccess = await deleteImage(oldImageUrl);
            if (!deleteSuccess) {
                console.warn('Failed to delete old image, continuing with upload');
            }
        }

        // Upload new image
        const newUrl = await uploadImage(newFile, folder);

        return newUrl;
    } catch (error) {
        console.error('Update image exception:', error);
        return null;
    }
}
