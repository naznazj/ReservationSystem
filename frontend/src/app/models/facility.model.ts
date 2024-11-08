export interface Facility {
  _id?: string; // Optional for editing
  name: string; // Name of the facility
  description: string; // Description of the facility
  price: number; // Price for renting or using the facility
  availability: {
      startDay: string; // Starting day of availability
      endDay: string; // Ending day of availability
      timeRange: {
          startTime: string; // Starting time of availability
          endTime: string; // Ending time of availability
      };
  };
  imageFilename: string; // Filename of the uploaded image (e.g., image-1728367273794-939303628.png)
  imageFile?: File | null; // For file uploads (when adding/updating)
  imageUrl?: string; // URL for displaying the image on the frontend
}
