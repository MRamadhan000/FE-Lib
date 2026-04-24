const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  img?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get all books
export async function getAllBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    const data: ApiResponse<Book[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Get single book
export async function getBook(id: number): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    const data: ApiResponse<Book> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

// Create book
export async function createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    
    const data: ApiResponse<Book> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating book:', error);
    return null;
  }
}

// Update book
export async function updateBook(id: number, book: Partial<Book>): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    
    const data: ApiResponse<Book> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating book:', error);
    return null;
  }
}

// Delete book
export async function deleteBook(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    
    const data: ApiResponse<null> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    return false;
  }
}
