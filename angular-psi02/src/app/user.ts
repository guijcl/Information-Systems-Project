export interface User {
	_id: string;
	user_name: string;
	user_pass: string;
	user_liked_photos: string[];
	user_favorited_photos: string[];
	user_uploaded_photos: string[];
}