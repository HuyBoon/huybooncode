
export const uploadImageToCloudinary = async (
    file: File,
    brand: string,
    type: "thumbnail" | "editor"
): Promise<string> => {
    const folderPath =
        type === "thumbnail"
            ? `${brand}/Thumbnails`
            : `${brand}/EditorImages`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "netsea");
    formData.append("folder", folderPath);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        throw error;
    }
};



export type DeleteResult =
    | { success: true; public_id: string }
    | { success: false; public_id: string; error: any };

export const deleteFromCloudinary = async (public_id: string): Promise<DeleteResult> => {
    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const api_key = process.env.CLOUDINARY_API_KEY!;
    const api_secret = process.env.CLOUDINARY_API_SECRET!;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = require("crypto")
        .createHash("sha1")
        .update(`public_id=${public_id}&timestamp=${timestamp}${api_secret}`)
        .digest("hex");

    const formData = new URLSearchParams();
    formData.append("public_id", public_id);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
    });

    const data = await res.json();
    if (data.result === "ok") {
        return { success: true, public_id };
    } else {
        return { success: false, public_id, error: data.result || "unknown_error" };
    }
};
