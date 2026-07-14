export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  description: string;
  image_url: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  description: string;
  image_url: string;
  status: string;
  is_featured: boolean;
}

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  setting_group: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  button_primary_text: string;
  button_primary_link: string;
  button_secondary_text: string;
  button_secondary_link: string;
  background_image: string;
  background_video: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  contact_type: string;
  contact_value: string;
  label: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_avatar: string;
  rating: number;
  comment: string;
  car_purchased: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  discount_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
